$(function() {
    if (!requireLogin()) return;

    // 加载个人信息
    request('GET', '/users/me').then(function(res) {
        if (res.code === 200) {
            var u = res.data;
            var html = '<p><strong>用户名：</strong>' + u.username + '</p>';
            html += '<p><strong>昵称：</strong>' + (u.nickname || '-') + '</p>';
            html += '<p><strong>邮箱：</strong>' + (u.email || '-') + '</p>';
            html += '<p><strong>角色：</strong>' + (u.role === 'admin' ? '管理员' : '普通用户') + '</p>';
            html += '<p><strong>注册时间：</strong>' + formatTime(u.createTime) + '</p>';
            $('#userInfo').html(html);
        }
    });

    // 加载我的文章（不传 status，后端返回全部：已发布 + 草稿）
    var params = { page: 1, pageSize: 50 };
    request('GET', '/articles?' + $.param(params)).then(function(res) {
        if (res.code === 200) {
            var myId = currentUser().userId;
            var publishedHtml = '';
            var draftHtml = '';
            var pubCount = 0;
            var draftCount = 0;
            $.each(res.data.list, function(i, a) {
                if (a.authorId === myId) {
                    var statusBadge = a.status === 'published'
                        ? '<span class="status-published">[已发布]</span>'
                        : '<span class="status-draft">[草稿]</span>';
                    var itemHtml = '<div style="padding:10px 0; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">';
                    itemHtml += '<div><strong>' + escapeHtml(a.title) + '</strong> ' + statusBadge;
                    itemHtml += '<div style="font-size:12px; color:#999;">' + formatTime(a.createTime) + '</div></div>';
                    itemHtml += '<div>';
                    itemHtml += '<a href="article-detail.html?id=' + a.id + '" class="btn btn-sm btn-default">查看</a> ';
                    itemHtml += '<a href="article-edit.html?id=' + a.id + '" class="btn btn-sm btn-primary">编辑</a> ';
                    itemHtml += '<button class="btn btn-sm btn-danger" onclick="delArticle(' + a.id + ')">删除</button>';
                    itemHtml += '</div></div>';
                    if (a.status === 'published') {
                        publishedHtml += itemHtml;
                        pubCount++;
                    } else {
                        draftHtml += itemHtml;
                        draftCount++;
                    }
                }
            });
            var allHtml = '';
            // 草稿区
            allHtml += '<div style="margin-bottom:20px;">';
            allHtml += '<h4 style="color:#e67e22; margin-bottom:8px;">📝 草稿 (' + draftCount + ')</h4>';
            allHtml += (draftHtml || '<div style="text-align:center; padding:12px; color:#999;">暂无草稿</div>');
            allHtml += '</div>';
            // 已发布区
            allHtml += '<div>';
            allHtml += '<h4 style="color:#27ae60; margin-bottom:8px;">✅ 已发布 (' + pubCount + ')</h4>';
            allHtml += (publishedHtml || '<div style="text-align:center; padding:12px; color:#999;">暂无已发布文章</div>');
            allHtml += '</div>';
            if (pubCount === 0 && draftCount === 0) {
                allHtml = '<div style="text-align:center; padding:20px; color:#999;">暂无文章，<a href="article-edit.html">去写一篇</a></div>';
            }
            $('#myArticles').html(allHtml);
        }
    });
});

function delArticle(id) {
    if (!confirm('确定删除该文章？')) return;
    request('DELETE', '/articles/' + id).then(function(res) {
        if (res.code === 200) {
            showToast('删除成功');
            location.reload();
        } else {
            showToast(res.message, 'error');
        }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
