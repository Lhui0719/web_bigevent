$(function() {

    var layer = layui.layer
    var form = layui.form

    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            // headers 就是请求头配置

            success: function(res) {

                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                console.log(res);
            }
        })
    }

    // 为添加按钮绑定事件
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        })
    })


    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'post',
            url: '/my/article/addcates',

            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                initArtCateList()

                layer.close(indexAdd)
            }
        })
    })


    // 为编辑按钮绑定事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章类别',
            content: $('#dialog-edit').html()
        })

        var id = $(this).attr('data-id')
            // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,

            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })


    // 代理为表单绑定submit事件

    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/my/article/updatecate',

            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('数据更新失败')
                }
                layer.msg('数据更新成功')

                layer.close(indexEdit)

                initArtCateList()
            }
        })
    })

    // 为删除绑定事件
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除？', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,

                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })

})