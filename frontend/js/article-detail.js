var articleId;

$(function() {
    articleId = getUrlParam('id');
    if (!articleId) { window.location.href = 'index.html'; return; }
    loadArticle();
    loadComments();

    $('#submitComment').click(function() {
        submitComment();
    });
});

function getUrlParam(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    var r = window.location.search.substr(1).match(reg);
    return r ? decodeURIComponent(r[2]) : null;
}

function loadArticle() {
    request('GET', '/articles/' + articleId).then(function(res) {
        if (res.code === 200) {
            var article = res.data.article;
            var tags = res.data.tags || [];
            var html = '<h1>' + escapeHtml(article.title) + '</h1>';
            html += '<div class="meta">';
            html += '<span>作者: ' + (article.authorName || '未知') + '</span>';
            html += '<span>分类: ' + (article.categoryName || '未分类') + '</span>';
            html += '<span>' + formatTime(article.createTime) + '</span>';
            html += '<span>阅读: ' + (article.viewCount || 0) + '</span>';
            if (currentUser() && (currentUser().role === 'admin' || currentUser().userId === article.authorId)) {
                html += '<a href="article-edit.html?id=' + article.id + '" class="btn btn-sm btn-default" style="float:right;">编辑</a>';
            }
            html += '</div>';
            if (tags.length > 0) {
                html += '<div class="tags">';
                $.each(tags, function(i, tag) { html += '<span>' + escapeHtml(tag) + '</span>'; });
                html += '</div>';
            }
            // 使用 marked 渲染 Markdown
            var contentHtml = window.marked ? marked.parse(article.content || '') : escapeHtml(article.content).replace(/\n/g, '<br>');
            html += '<div class="content markdown-body">' + contentHtml + '</div>';
            $('#articleDetail').html(html);
        }
    });
}

function loadComments() {
    request('GET', '/articles/' + articleId + '/comments').then(function(res) {
        if (res.code === 200) {
            var html = '';
            if (!res.data || res.data.length === 0) {
                html = '<div style="color:#999; text-align:center; padding:20px;">暂无评论</div>';
            } else {
                $.each(res.data, function(i, c) {
                    html += '<div class="comment-item">';
                    html += '<span class="comment-user">' + (c.nickname || c.username) + '</span>';
                    html += '<span class="comment-time">' + formatTime(c.createTime) + '</span>';
                    if (currentUser() && (currentUser().role === 'admin' || currentUser().userId === c.userId)) {
                        html += '<button class="btn btn-sm btn-danger" style="float:right;" onclick="deleteComment(' + c.id + ')">删除</button>';
                    }
                    html += '<div class="comment-text">' + escapeHtml(c.content) + '</div>';
                    html += '</div>';
                });
            }
            $('#commentList').html(html);

            if (!isLoggedIn()) {
                $('#commentForm').html('<div style="color:#999; text-align:center;">请先<a href="login.html">登录</a>后评论</div>');
            }
        }
    });
}

function submitComment() {
    if (!isLoggedIn()) { window.location.href = 'login.html'; return; }
    var content = $('#commentContent').val().trim();
    if (!content) { $('#commentError').text('请输入评论内容').show(); return; }
    $('#commentError').hide();

    request('POST', '/comments', { content: content, articleId: parseInt(articleId) }).then(function(res) {
        if (res.code === 200) {
            $('#commentContent').val('');
            showToast('评论成功');
            loadComments();
        } else {
            showToast(res.message, 'error');
        }
    });
}

function deleteComment(id) {
    if (!confirm('确定删除该评论？')) return;
    request('DELETE', '/comments/' + id).then(function(res) {
        if (res.code === 200) {
            showToast('删除成功');
            loadComments();
        } else {
            showToast(res.message, 'error');
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
