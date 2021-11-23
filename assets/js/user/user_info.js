$(function() {

    var form = layui.form
    var layer = layui.layer
    form.verify({
        nickname: function(value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间'
            }
        }

    })
    initUserInfo()

    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
            // headers 就是请求头配置
            headers: {
                Authorization: localStorage.getItem('token') || ''

            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败')
                }
                console.log(res);
                // 调用 form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }

        })
    }

    // 重置表单数据
    $('#btnReset').on('click', function(e) {
        e.preventDefault();
        initUserInfo()
    })


    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
            headers: {
                Authorization: localStorage.getItem('token') || ''

            },
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败')
                }
                layer.msg('更新用户信息成功')

                // 调用父页面中的方法，重新渲染用户的头像和用户信息
                window.parent.getUserIofo()
            }
        })
    })
})