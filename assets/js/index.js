$(function() {
    getUserIofo()


    var layer = layui.layer
    $('#btnLogout').on('click', function() {
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' },
            function(index) {
                // 清空本地存储
                localStorage.removeItem('token')
                    // 跳转到登录框
                location.href = '/login.html'
                layer.close(index)
            })
    })
})

function getUserIofo() {

    $.ajax({
        method: 'get',
        url: 'http://api-breakingnews-web.itheima.net/my/userinfo',
        // headers 就是请求头配置
        headers: {
            Authorization: localStorage.getItem('token') || ''

        },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('请求失败')
            }
            // console.log(res.data.user_pic);
            // 调用renderrAvatar 渲染用户头像
            renderrAvatar(res.data)
        },
        // 不论成功还是失败都会调用complete回调函数
        complete: function(res) {
            // console.log('执行了');
            // console.log(res);
            // 在complete 回调函数当中，可以使用res.responseJSON
            if (res.responseJSON.status === 1 || res.responseJSON.message === '身份认证失败！') {
                // 强制清空本地存储
                localStorage.removeItem('token')
                    // 跳转到登录页
                location.href = '/login.html'
            }
        }

    })
}


function renderrAvatar(user) {
    // 1.获取用户名称
    var name = user.nickname || user.username
        // 2.渲染名称
    $('#welcome').html('欢迎 &nbsp &nbsp' + name)

    //3渲染头像
    if (user.user_pic !== null) {
        //3.1按需渲染头像
        $('.layui-nav-img').attr('src', user.user_pic)
        $('.text-avatar').hide()
    } else {
        //3.2文字头像
        $('.layui-nav-img').hide()
            // 设置name第一个属性大写
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show
    }

}