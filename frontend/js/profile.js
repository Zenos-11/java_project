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

    // 加载我的文章（包括草稿）
    var params = { page: 1, pageSize: 50, status: '' };
    request('GET', '/articles?' + $.param(params)).then(function(res) {
        if (res.code === 200) {
            var myId = currentUser().userId;
            var html = '';
            var hasArticle = false;
            $.each(res.data.list, function(i, a) {
                if (a.authorId === myId) {
                    hasArticle = true;
                    var statusBadge = a.status === 'published'
                        ? '<span style="color:#27ae60;">[已发布]</span>'
                        : '<span style="color:#e67e22;">[草稿]</span>';
                    html += '<div style="padding:10px 0; border-bottom:1px solid #eee; display:flex; justify-content:space-between; align-items:center;">';
                    html += '<div><strong>' + escapeHtml(a.title) + '</strong> ' + statusBadge;
                    html += '<div style="font-size:12px; color:#999;">' + formatTime(a.createTime) + '</div></div>';
                    html += '<div>';
                    html += '<a href="article-detail.html?id=' + a.id + '" class="btn btn-sm btn-default">查看</a> ';
                    html += '<a href="article-edit.html?id=' + a.id + '" class="btn btn-sm btn-primary">编辑</a> ';
                    html += '<button class="btn btn-sm btn-danger" onclick="delArticle(' + a.id + ')">删除</button>';
                    html += '</div></div>';
                }
            });
            if (!hasArticle) html = '<div style="text-align:center; padding:20px; color:#999;">暂无文章</div>';
            $('#myArticles').html(html);
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
