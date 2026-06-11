$(function() {
    // 登录逻辑
    $('#loginBtn').click(function() {
        var username = $('#username').val().trim();
        var password = $('#password').val();

        if (!username) { $('#usernameError').text('请输入用户名').show(); return; }
        $('#usernameError').hide();
        if (!password) { $('#passwordError').text('请输入密码').show(); return; }
        $('#passwordError').hide();

        $('#loginBtn').prop('disabled', true).text('登录中...');

        request('POST', '/auth/login', { username: username, password: password })
            .then(function(res) {
                if (res.code === 200) {
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('user', JSON.stringify({
                        userId: res.data.userId,
                        username: res.data.username,
                        nickname: res.data.nickname,
                        role: res.data.role
                    }));
                    showToast('登录成功');
                    setTimeout(function() { window.location.href = 'index.html'; }, 500);
                } else {
                    showToast(res.message, 'error');
                }
            })
            .fail(function(xhr) {
                var msg = JSON.parse(xhr.responseText).message || '登录失败';
                showToast(msg, 'error');
            })
            .always(function() {
                $('#loginBtn').prop('disabled', false).text('登录');
            });
    });

    // 注册逻辑
    $('#registerBtn').click(function() {
        var username = $('#username').val().trim();
        var nickname = $('#nickname').val().trim();
        var email = $('#email').val().trim();
        var password = $('#password').val();
        var confirmPassword = $('#confirmPassword').val();
        var valid = true;

        if (!username) { $('#usernameError').text('请输入用户名').show(); valid = false; } else { $('#usernameError').hide(); }
        if (!password || password.length < 6) { $('#passwordError').text('密码不少于6位').show(); valid = false; } else { $('#passwordError').hide(); }
        if (password !== confirmPassword) { $('#confirmError').text('两次密码不一致').show(); valid = false; } else { $('#confirmError').hide(); }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { $('#emailError').text('邮箱格式不正确').show(); valid = false; } else { $('#emailError').hide(); }
        if (!valid) return;

        $('#registerBtn').prop('disabled', true).text('注册中...');

        request('POST', '/auth/register', {
            username: username,
            password: password,
            nickname: nickname || username,
            email: email || undefined
        }).then(function(res) {
            if (res.code === 200) {
                showToast('注册成功，请登录');
                setTimeout(function() { window.location.href = 'login.html'; }, 800);
            } else {
                showToast(res.message, 'error');
            }
        }).fail(function(xhr) {
            var msg = JSON.parse(xhr.responseText).message || '注册失败';
            showToast(msg, 'error');
        }).always(function() {
            $('#registerBtn').prop('disabled', false).text('注册');
        });
    });

    // 回车提交
    $(document).keydown(function(e) {
        if (e.keyCode === 13) {
            if ($('#loginBtn').length > 0) $('#loginBtn').click();
            if ($('#registerBtn').length > 0) $('#registerBtn').click();
        }
    });
});
