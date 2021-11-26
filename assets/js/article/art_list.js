$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage
    var q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示多少条数据默认1
        cate_id: '', //文章分类的ID
        state: '' //文章发布的状态
    }
    initTable()
    initCate()


    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function(date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                // 使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', res)
                    // console.log(htmlStr);
                $('tbody').html(htmlStr)
                    // 调用渲染分页的方法
                    // renderPage(res.total)
                    // 调用分页
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }

                var htmlStr = template('tpl-cate', res)
                    // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
            // 查询参数对象 为q赋值
        q.cate_id = cate_id
        q.state = state

        initTable()

    })


    // 分页功能
    function renderPage(total) {
        // 调用 laypage.render() 来渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总条数
            limit: q.pagesize, //每页显示多少条内容 默认是2
            curr: q.pagenum, //选择第几页默认第一页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [1, 2, 3, 5, 10],

            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调

            jump: function(obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的

                // 把最新的页码值，赋值到 q 这个查询参数对象中
                q.pagenum = obj.curr
                    // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                    // console.log(obj.curr)
                    // 根据最新的 q 获取对应的数据列表，并渲染表格
                if (!first) {

                    initTable()
                }
            }

        })
    }


    // 删除功能

    $('tbody').on('click', '.btn-delete', function() {
        var len = $('.btn-delete').length
        console.log(len);
        var id = $(this).attr('data-id')
            // 询问用户是否要删除数据
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'get',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    if (len === 1) {
                        q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }

            })

            layer.close(index)
        })

    })




})