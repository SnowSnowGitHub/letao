$(function () {
    // 获取用户信息并渲染到页面上
    $.ajax({
        url: '/user/queryUserMessage',
        success: function (data) {
            console.log(data);
            if (data.error) {
                location = 'login.html?returnUrl=' + location.href;
            } else {
                document.documentElement.style.display="block";
                $('.username').html(data.username);
                $('.tel').html(data.mobile)
            }
        }

    })



    //点击退出登录按钮
    $('.btn-loginout').on('tap',function(){
        $.ajax({
            url:'/user/logout',
            success:function(data){
                //判断 如果退出登录成功则跳转到登录页面
                if(data.success){
                    //去登录页面携带上当前用户中心的地址
                    location='login.html?returnUrl='+location.href;
                }
            }
        })
    })

})