$(function() {


    var form = layui.form
    var layer = layui.layer
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位,且不能出现空格'],

        samePwd: function(value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新密码不能和旧密码相同'
            }

        },
        rePwd: function(value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致'
            }
        }
    })


    // 修改密码
    $('.layui-form').on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: 'http://api-breakingnews-web.itheima.net/my/updatepwd',
            // 快速获取表单内容
            data: $(this).serialize(),
            headers: {
                Authorization: localStorage.getItem('token') || ''

            },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')
                    // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})