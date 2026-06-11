var currentPage = 1;
var pageSize = 10;

$(function() {
    loadCategories('#categoryFilter', function() {
        loadArticles();
    });

    $('#searchBtn').click(function() {
        currentPage = 1;
        loadArticles();
    });

    $('#resetBtn').click(function() {
        $('#keyword').val('');
        $('#categoryFilter').val('');
        currentPage = 1;
        loadArticles();
    });

    $('#keyword').keydown(function(e) {
        if (e.keyCode === 13) {
            currentPage = 1;
            loadArticles();
        }
    });
});

function loadArticles() {
    var params = {
        page: currentPage,
        pageSize: pageSize,
        keyword: $('#keyword').val(),
        categoryId: $('#categoryFilter').val() || undefined,
        status: 'published'
    };
    if (!params.categoryId) delete params.categoryId;

    request('GET', '/articles?' + $.param(params)).then(function(res) {
        if (res.code === 200) {
            renderArticles(res.data.list);
            renderPagination(res.data);
        }
    });
}

function renderArticles(list) {
    var html = '';
    if (!list || list.length === 0) {
        html = '<div style="text-align:center; padding:40px; color:#999;">暂无文章</div>';
    } else {
        $.each(list, function(i, article) {
            html += '<div class="article-card">';
            html += '<h3><a href="article-detail.html?id=' + article.id + '">' + escapeHtml(article.title) + '</a></h3>';
            html += '<div class="meta">';
            html += '<span>作者: ' + (article.authorName || '未知') + '</span>';
            html += '<span>分类: ' + (article.categoryName || '未分类') + '</span>';
            html += '<span>' + formatTime(article.createTime) + '</span>';
            html += '<span>阅读: ' + article.viewCount + '</span>';
            html += '</div>';
            html += '<div class="summary">' + escapeHtml(article.summary || '') + '</div>';
            html += '</div>';
        });
    }
    $('#articleList').html(html);
}

function renderPagination(data) {
    var totalPages = Math.ceil(data.total / pageSize) || 1;
    var html = '';
    html += '<button ' + (currentPage <= 1 ? 'disabled' : '') + ' onclick="goPage(' + (currentPage - 1) + ')">上一页</button>';
    for (var i = 1; i <= totalPages; i++) {
        if (totalPages > 7 && i > 3 && i < totalPages - 2 && i !== currentPage) {
            if (i === 4) html += '<button disabled>...</button>';
            continue;
        }
        html += '<button class="' + (i === currentPage ? 'active' : '') + '" onclick="goPage(' + i + ')">' + i + '</button>';
    }
    html += '<button ' + (currentPage >= totalPages ? 'disabled' : '') + ' onclick="goPage(' + (currentPage + 1) + ')">下一页</button>';
    $('#pagination').html(html);
}

function goPage(page) {
    currentPage = page;
    loadArticles();
    $('html, body').animate({ scrollTop: 200 }, 200);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
