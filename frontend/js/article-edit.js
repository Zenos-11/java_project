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

    $('#publishBtn').click(function() { saveArticle('published'); });
    $('#draftBtn').click(function() { saveArticle('draft'); });
});

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

    // 未填摘要时自动截取
    if (!summary) {
        summary = content.replace(/<[^>]+>/g, '').substring(0, 200);
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
            showToast(status === 'published' ? '发布成功' : '草稿已保存');
            setTimeout(function() { window.location.href = 'index.html'; }, 600);
        } else {
            showToast(res.message, 'error');
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
