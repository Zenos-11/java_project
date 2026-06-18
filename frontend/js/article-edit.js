var articleId;
var tags = [];

$(function() {
    if (!requireLogin()) return;

    articleId = getUrlParam('id');
    loadCategories('#categorySelect');

    if (articleId) {
        $('#pageTitle').text('编辑文章');
        loadArticle();
    }

    // 标签输入
    $('#tagInput').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            var val = $(this).val().trim();
            if (val && tags.indexOf(val) === -1) {
                tags.push(val);
                renderTags();
            }
            $(this).val('');
        }
    });

    // Markdown 编辑/预览切换
    $('.md-tab').click(function() {
        var tab = $(this).data('tab');
        $('.md-tab').removeClass('active');
        $(this).addClass('active');
        if (tab === 'edit') {
            $('#content').show();
            $('#contentPreview').hide();
        } else {
            var raw = $('#content').val();
            $('#contentPreview').html(window.marked ? marked.parse(raw) : '<p>Markdown 解析库加载中...</p>');
            $('#content').hide();
            $('#contentPreview').show();
        }
    });

    // Markdown 工具栏
    $('.md-toolbar button[data-md]').click(function(e) {
        e.preventDefault();
        var ta = $('#content')[0];
        var cmd = $(this).data('md');
        insertMarkdown(ta, cmd);
        ta.focus();
    });

    $('#publishBtn').click(function() { saveArticle('published'); });
    $('#draftBtn').click(function() { saveArticle('draft'); });
});

// 在光标处插入 Markdown 语法
function insertMarkdown(textarea, cmd) {
    var start = textarea.selectionStart;
    var end = textarea.selectionEnd;
    var text = textarea.value;
    var before = text.substring(0, start);
    var sel = text.substring(start, end) || '文本';
    var after = text.substring(end);

    var insertMap = {
        'bold': ['**', '**'],
        'italic': ['*', '*'],
        'heading': ['\n## ', ''],
        'ul': ['\n- ', ''],
        'ol': ['\n1. ', ''],
        'link': ['[', '](url)'],
        'image': ['![', '](图片地址)'],
        'code': ['`', '`'],
        'quote': ['\n> ', ''],
        'hr': ['\n---\n', '']
    };

    var wrap = insertMap[cmd] || ['', ''];
    // 处理代码块特殊语法
    if (cmd === 'code' && (sel.indexOf('\n') !== -1 || sel.length > 30)) {
        wrap = ['```\n', '\n```'];
    }

    var val = before + wrap[0] + sel + wrap[1] + after;
    textarea.value = val;

    // 尝试选中之前选中的内容以方便覆盖
    var newStart = start + wrap[0].length;
    var newEnd = newStart + sel.length;
    textarea.setSelectionRange(newStart, newEnd);
}

function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    return r ? decodeURIComponent(r[2]) : null;
}

function loadArticle() {
    request('GET', '/articles/' + articleId).then(function(res) {
        if (res.code === 200) {
            var a = res.data.article;
            $('#title').val(a.title);
            $('#content').val(a.content);
            $('#summary').val(a.summary || '');
            $('#categorySelect').val(a.categoryId || '');
            tags = res.data.tags || [];
            renderTags();
        }
    });
}

function renderTags() {
    var html = '';
    $.each(tags, function(i, tag) {
        html += '<span class="tag">' + escapeHtml(tag) + '<span class="remove" onclick="removeTag(' + i + ')">x</span></span>';
    });
    html += '<input type="text" id="tagInput" placeholder="输入标签后按回车" />';
    $('#tagEditor').html(html);
    $('#tagInput').keydown(function(e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            var val = $(this).val().trim();
            if (val && tags.indexOf(val) === -1) {
                tags.push(val);
                renderTags();
            }
            $(this).val('');
        }
    });
}

function removeTag(index) {
    tags.splice(index, 1);
    renderTags();
}

function saveArticle(status) {
    var title = $('#title').val().trim();
    var content = $('#content').val().trim();
    var summary = $('#summary').val().trim();
    var categoryId = $('#categorySelect').val();

    if (!title) { $('#titleError').text('请输入标题').show(); return; }
    $('#titleError').hide();
    if (!content) { $('#contentError').text('请输入正文').show(); return; }
    $('#contentError').hide();

    // 未填摘要时自动截取（去除 Markdown 标记后的纯文本前200字）
    if (!summary) {
        summary = content.replace(/[#*`>\[\]()!\-~|\\]/g, '').replace(/\n+/g, ' ').substring(0, 200);
    }

    var data = {
        title: title,
        content: content,
        summary: summary,
        categoryId: categoryId ? parseInt(categoryId) : null,
        status: status,
        tags: tags
    };

    var url = articleId ? '/articles/' + articleId : '/articles';
    var method = articleId ? 'PUT' : 'POST';

    request(method, url, data).then(function(res) {
        if (res.code === 200) {
            if (status === 'published') {
                showToast('发布成功');
                setTimeout(function() { window.location.href = BASE + 'index.html'; }, 600);
            } else {
                showToast('草稿已保存（可在个人中心查看和继续编辑）');
                // 新建草稿后留在页面，如果是新建则刷新获取 id 以便后续编辑
                if (!articleId && res.data && res.data.id) {
                    articleId = res.data.id;
                    var newUrl = 'article-edit.html?id=' + articleId;
                    history.replaceState(null, '', newUrl);
                }
            }
        } else {
            showToast(res.message, 'error');
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
