$(function() {
    // 分类管理页
    if ($('#categoryTable').length > 0) {
        if (!requireAdmin()) return;
        loadCategoryList();

        $('#addBtn').click(function() {
            var name = $('#catName').val().trim();
            if (!name) { alert('请输入分类名称'); return; }
            request('POST', '/categories', {
                name: name,
                description: $('#catDesc').val().trim(),
                sortOrder: parseInt($('#catSort').val()) || 0
            }).then(function(res) {
                if (res.code === 200) {
                    showToast('添加成功');
                    $('#catName').val(''); $('#catDesc').val(''); $('#catSort').val('0');
                    loadCategoryList();
                } else { showToast(res.message, 'error'); }
            });
        });

        $('#saveBtn').click(function() {
            var id = $('#editId').val();
            request('PUT', '/categories/' + id, {
                id: parseInt(id),
                name: $('#editName').val().trim(),
                description: $('#editDesc').val().trim(),
                sortOrder: parseInt($('#editSort').val()) || 0
            }).then(function(res) {
                if (res.code === 200) {
                    showToast('修改成功');
                    $('#editCard').hide();
                    loadCategoryList();
                } else { showToast(res.message, 'error'); }
            });
        });

        $('#cancelBtn').click(function() { $('#editCard').hide(); });
    }

    // 用户管理页
    if ($('#userTable').length > 0) {
        if (!requireAdmin()) return;
        loadUserList();
    }
});

function loadCategoryList() {
    request('GET', '/categories').then(function(res) {
        if (res.code === 200) {
            var html = '';
            $.each(res.data, function(i, c) {
                html += '<tr>';
                html += '<td>' + c.id + '</td>';
                html += '<td>' + escapeHtml(c.name) + '</td>';
                html += '<td>' + escapeHtml(c.description || '-') + '</td>';
                html += '<td>' + c.sortOrder + '</td>';
                html += '<td>' + formatTime(c.createTime) + '</td>';
                html += '<td>';
                html += '<button class="btn btn-sm btn-primary" onclick="editCategory(' + c.id + ', \'' + escapeHtml(c.name) + '\', \'' + escapeHtml(c.description || '') + '\', ' + c.sortOrder + ')">编辑</button> ';
                html += '<button class="btn btn-sm btn-danger" onclick="delCategory(' + c.id + ')">删除</button>';
                html += '</td></tr>';
            });
            $('#categoryTable').html(html);
        }
    });
}

function editCategory(id, name, desc, sort) {
    $('#editCard').show();
    $('#editId').val(id);
    $('#editName').val(name);
    $('#editDesc').val(desc);
    $('#editSort').val(sort);
    $('html, body').animate({ scrollTop: $('#editCard').offset().top - 100 }, 300);
}

function delCategory(id) {
    if (!confirm('确定删除该分类？（分类下的文章将变为未分类）')) return;
    request('DELETE', '/categories/' + id).then(function(res) {
        if (res.code === 200) {
            showToast('删除成功');
            loadCategoryList();
        } else { showToast(res.message, 'error'); }
    });
}

function loadUserList() {
    request('GET', '/users').then(function(res) {
        if (res.code === 200) {
            var html = '';
            $.each(res.data, function(i, u) {
                html += '<tr>';
                html += '<td>' + u.id + '</td>';
                html += '<td>' + escapeHtml(u.username) + '</td>';
                html += '<td>' + escapeHtml(u.nickname || '-') + '</td>';
                html += '<td>' + escapeHtml(u.email || '-') + '</td>';
                html += '<td>' + (u.role === 'admin' ? '管理员' : '用户') + '</td>';
                html += '<td>' + (u.status === 1 ? '<span style="color:#27ae60;">正常</span>' : '<span style="color:#e74c3c;">已禁用</span>') + '</td>';
                html += '<td>' + formatTime(u.createTime) + '</td>';
                html += '<td>';
                if (u.role !== 'admin') {
                    if (u.status === 1) {
                        html += '<button class="btn btn-sm btn-danger" onclick="toggleUser(' + u.id + ', 0)">禁用</button>';
                    } else {
                        html += '<button class="btn btn-sm btn-success" onclick="toggleUser(' + u.id + ', 1)">启用</button>';
                    }
                }
                html += '</td></tr>';
            });
            $('#userTable').html(html);
        }
    });
}

function toggleUser(id, status) {
    request('PUT', '/users/' + id, { status: status }).then(function(res) {
        if (res.code === 200) {
            showToast('操作成功');
            loadUserList();
        } else { showToast(res.message, 'error'); }
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
