$(function() {
    // 切换到注册 切记 js不支持link-reg -杠 id尽量用下划线
    $('#link_reg').on('click', function() {
            $('.login-box').hide()
            $('.reg-box').show()
        })
        // 切换到登录
    $('#link_login').on('click', function() {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    var form = layui.form
    var layer = layui.layer

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6 - 12 位且不能出现空格'],

        repwd: function(value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致'
            }
        }
    })

    // 监听注册表单提交事件
    $('#form_reg').on('submit', function(e) {
        // 阻止默认提交行为
        e.preventDefault();
        // 把要传输的值拿出来
        var data = { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() }
            // 发起ajax post请求
        $.post('http://api-breakingnews-web.itheima.net/api/reguser', data, function(res) {
            if (res.status !== 0) {

                return layer.msg(res.message)
            }

            layer.msg('注册成功')
                // 模拟人为点击登录
            $('#link_login').click()
        })
    })

    // 监听登录表单提交事件
    $('#form_login').submit(function(e) {
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: 'http://api-breakingnews-web.itheima.net/api/login',
            method: 'POST',
            // 快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                layer.msg('登录成功!')

                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)

                // 跳转到后台主页
                location.href = '/index.html'

            }

        })
    })



})