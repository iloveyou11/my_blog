$(function() {
    let $loginBox = $('#loginBox');
    let $registerBox = $('#registerBox');
    let $userInfo = $('#userInfo');

    //切换到注册面板
    $("#registerBtn").on('click', function() {
        $registerBox.show();
        $loginBox.hide();
    });

    //切换到登录面板
    $("#loginBtn").on('click', function() {
        $loginBox.show();
        $registerBox.hide();
    });

    //注册
    $('#submitRegisterBtn').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/register',
            data: {
                username: $registerBox.find('[name="username"]').val(),
                password: $registerBox.find('[name="password"]').val(),
                repassword: $registerBox.find('[name="repassword"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $registerBox.find('.colWarning').html(result.message);

                if (!result.code) {
                    //注册成功
                    setTimeout(function() {
                        $loginBox.show();
                        $registerBox.hide();
                    }, 1000);
                }

            }
        });
    });

    //登录
    $('#submitLoginBtn').on('click', function() {
        //通过ajax提交请求
        $.ajax({
            type: 'post',
            url: '/api/user/login',
            data: {
                username: $loginBox.find('[name="username"]').val(),
                password: $loginBox.find('[name="password"]').val()
            },
            dataType: 'json',
            success: function(result) {
                $loginBox.find('.colWarning').html(result.message);
                if (!result.code) {
                    //登录成功
                    // 发送了cookie。直接刷新即可更新信息
                    window.location.reload();
                    // $loginBox.hide();
                    // $userInfo.show();
                    // $userInfo.find('.username').html(result.userInfo.username);
                    // $userInfo.find('.info').html('你好，欢迎光临我的博客！');
                }
            }
        })
    })

    //退出
    $('#logout').on('click', function() {
        $.ajax({
            url: '/api/user/logout',
            success: function(result) {
                if (!result.code) {
                    window.location.reload();
                }
            }
        });
    })


    // 导航栏滑动到顶部固定
    // 获取导航栏到屏幕顶部的距离
    let oTop = $(".menu").offset().top;
    //获取导航栏的高度，此高度用于保证内容的平滑过渡
    let martop = $('.menu').outerHeight();

    let sTop = 0;
    // 监听页面的滚动
    $(window).scroll(function() {
        // 获取页面向上滚动的距离
        sTop = $(this).scrollTop();
        // 当导航栏到达屏幕顶端
        if (sTop >= oTop) {
            // 修改导航栏position属性，使之固定在屏幕顶端
            $("nav").css({ "position": "fixed", "top": "0", "width": "100%", "z-index": 100 });
            // 修改内容的margin-top值，保证平滑过渡
            $(".clear").css({ "margin-top": martop });
        } else {
            // 当导航栏脱离屏幕顶端时，回复原来的属性
            $("nav").css({ "position": "static" });
            $(".clear").css({ "margin-top": "0" });
        }
    });


})