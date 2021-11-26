$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()

    // 引用富文本编辑器
    initEditor()

    function initCate() {
        $.ajax({
            method: 'get',
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取失败')
                }
                // 调用模板引擎
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                    // 用layui一定要调用 form.render() 不然页面不会渲染
                form.render()
            }
        })
    }


    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 选择封面的点击事件
    $('#btnChooseImage').on('click', function() {
            $('#coverFile').click()
        })
        // 监听发布按钮的change事件
    $('#coverFile').on('change', function(e) {
        // 拿到用户选择的文件
        var files = e.target.files

        if (files.length === 0) return

        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })

    // 定义发布文章的状态
    var art_state = '已发布'

    // 为已存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function() {
        art_state = '草稿'

    })

    //1.为表单绑定事件
    $('#form-pub').on('submit', function(e) {
        // 阻止表单默认行为
        e.preventDefault();

        // 2.new一个FormData对象用fd存起来
        var fd = new FormData($(this)[0])
            // 3.将发布状态存储给fd
        fd.append('state', art_state)

        // 4.将封面裁剪区域，输出为一个对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5.将文件对象，存储到fa
                fd.append('cover_img', blob)

                // 6.发起ajax请求
                publishArticle(fd)

            })
    })

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'post',
            url: '/my/article/add',
            data: fd,
            // 注意 如果要向服务器发布 FormData 格式的数据 
            // 必须要添加以下两个配置项
            contentType: false,
            processData: false,
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布成功')
                location.href = '/article/art_list.html'
            }
        })
    }

    $('tbody').on('click', '#data-id', function() {
        console.log('aaa');
    })

})