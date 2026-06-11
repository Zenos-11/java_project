// 公共工具函数
var API_BASE = 'http://localhost:8080/api';

// AJAX 封装
function request(method, url, data) {
    return $.ajax({
        url: API_BASE + url,
        type: method,
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : undefined,
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    });
}

// Toast 消息
function showToast(message, type) {
    type = type || 'success';
    var toast = $('<div class="toast ' + type + '">' + message + '</div>');
    $('body').append(toast);
    setTimeout(function() { toast.fadeOut(300, function() { toast.remove(); }); }, 2000);
}

// 登录状态检查
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

function currentUser() {
    var u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
}

function isAdmin() {
    var u = currentUser();
    return u && u.role === 'admin';
}

// 渲染导航栏
function renderNavbar() {
    var user = currentUser();
    var navHtml = '<div class="logo"><a href="index.html">博客管理系统</a></div>';
    navHtml += '<div class="nav-links">';
    navHtml += '<a href="index.html">首页</a>';

    if (user) {
        if (user.role === 'admin') {
            navHtml += '<a href="admin/categories.html">分类管理</a>';
            navHtml += '<a href="admin/users.html">用户管理</a>';
        }
        navHtml += '<a href="article-edit.html">写文章</a>';
        navHtml += '<a href="profile.html">个人中心</a>';
        navHtml += '<span class="user-info">' + (user.nickname || user.username) + '</span>';
        navHtml += '<button onclick="logout()">退出</button>';
    } else {
        navHtml += '<a href="login.html">登录</a>';
    }
    navHtml += '</div>';
    $('#navbar').html(navHtml);
}

// 退出登录
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// 需要登录的页面检查
function requireLogin() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// 需要管理员的页面检查
function requireAdmin() {
    if (!isLoggedIn()) {
        window.location.href = '../login.html';
        return false;
    }
    if (!isAdmin()) {
        showToast('需要管理员权限', 'error');
        window.location.href = '../index.html';
        return false;
    }
    return true;
}

// 加载分类选项到 select 元素
function loadCategories(selector, callback) {
    request('GET', '/categories').then(function(res) {
        if (res.code === 200) {
            var html = '<option value="">全部分类</option>';
            $.each(res.data, function(i, cat) {
                html += '<option value="' + cat.id + '">' + cat.name + '</option>';
            });
            $(selector).html(html);
            if (callback) callback();
        }
    });
}

// 格式化时间
function formatTime(dateStr) {
    if (!dateStr) return '';
    var d = new Date(dateStr);
    var pad = function(n) { return n < 10 ? '0' + n : n; };
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
}

// 页面加载时渲染导航栏
$(function() {
    renderNavbar();
});
