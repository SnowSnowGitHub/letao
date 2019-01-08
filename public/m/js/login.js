$(function(){

    // //点击登录按钮
    // $('#main form .login').on('tap',function(){
    //     //获取用户输入的用户名
    //     var username=$('form .username').val().trim();
    //     //获取用户输入的密码
    //     var password=$('form .password').val().trim();
    //     if(!username){
    //         mui.toast('请输入用户名',{ duration:1000, type:'div' }) ;
    //         return false;
    //     }
    //     if(!password){
    //         mui.toast('请输入密码',{ duration:1000, type:'div' }) ;
    //         return false;
    //     }
    //     $.ajax({
    //         type:'post',
    //         url:'/user/login',
    //         data:{username:username,password:password},
    //         success:function(data){
    //             console.log(data);
    //             if(data.success){
    //                 // console.log('登录成功');
    //                 //通过封装的函数 获取地址栏携带过来的产品详情页面的url
    //                 var returnUrl=getQueryString('returnUrl');
    //                 location.href=returnUrl;
    //             }else{
    //                 // console.log('登录失败');
    //                 mui.toast(data.message,{ duration:1000, type:'div' }) ;
    //             }
    //         }
    //     })
    // })

    // //点击免费注册按钮 跳转到用户注册页面
    // $('#main form .register').on('tap',function(){
    //     location='register.html';
    // })


    // //封装函数(使用正则)  获取地址栏携带过来的产品详情页面的url
    // // 获取url参数值的函数
    // function getQueryString(name) {
    //     var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    //     var r = window.location.search.substr(1).match(reg);
    //     // console.log(r); 
    //     if (r != null) return decodeURI(r[2]);
    //     return null;
    // }



    //点击登录按钮
    $('#main form .login').on('tap',function(){
        //获取用户输入的用户名
        var username=$('form .username').val().trim();
        //获取用户输入的用户名
        var password=$('form .password').val().trim();
        if(!username){
            mui.toast('请输入用户名',{duration:1000,type:'div'});
            return false ;
        }
        if(!password){
            mui.toast('请输入密码',{duration:1000,type:'div'});
            return false ; 
        }
        $.ajax({
            type:'post',
            url:'/user/login',
            data:{
                username:username,
                password:password
            },
            success:function(data){
                console.log(data);
                if(data.success){
                    console.log('登录成功');
                    // 从商品详情页面点击过来的时候 地址栏携带了商品页面完整的地址栏信息
                    var returnUrl=getQueryString('returnUrl');
                    location.href=returnUrl;
                }else{
                    console.log('登录失败');
                    mui.toast("登录失败",{duration:1000,type:'div'})
                }
            }
        })
    })



    //点击面给注册的按钮 跳转到用户注册页面
    $('#main form .register').on('tap',function(){
        location='register.html'
    })

    // 封装函数(使用正则) 获取地址栏携带过来的产品详情页面的url
        function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        // console.log(r); 
        if (r != null) return decodeURI(r[2]);
        return null;
    }

})