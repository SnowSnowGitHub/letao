$(function(){
    //点击注册按钮
    $('.btnRegister').on('tap',function(){
        var inputLists=$('.mui-input-row input');
        // console.log(inputLists);
        var check=true;
        inputLists.each(function(index,ele){
            var inputValue=$(this).val().trim();
            if(!inputValue){
                var labelName=$(this).prev().text();
                mui.toast('请输入'+labelName,{ duration:1000, type:'div' });
                check=false;
                return false;
            }

        })
        //如果这个时候的check 为true 表示没有进入if的判断里面 表示表单全部输入有值
        if(check){
            //判断手机号
            var mobile=$('.mobile').val();
            var username=$('.username').val();
            var password1=$('.password1').val();
            var password2=$('.password2').val();
            //判断手机号是否合理
            if(!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(mobile)){
                mui.toast('请输入正确的手机号',{ duration:1000, type:'div' });
                return false;
            }
            //判断两次的密码是否输入一致
            if(password1!=password2){
                mui.toast('两次密码输入不一致',{ duration:1000, type:'div' });
                return false;
            }
            //判断验证码是否输入正确
            if(vCode!=$('.vcode').val().trim()){
                mui.toast('验证码输入错误',{ duration:1000, type:'div' });
                return false; 

            }

            //都判断完了之后 调用注册的api 传入这些参数
            $.ajax({
                url:'/user/register',
                type:'post',
                data:{
                    username:username,
                    password:password1,
                    mobile:mobile,
                    vCode:vCode
                },
                success:function(data){
                    if(data.success){
                        location='login.html?returnUrl=user.html'
                    }else{
                        mui.toast(data.message,{ duration:1000, type:'div' });
                        return false; 
                    }
                }
            })
        }
    })




    /*
        获取验证码
            1 点击获取验证码按钮 获取验证码
            2 调用获取验证码的API 去获取验证码
            3 正常情况下是根据手机号去获取验证码的  验证码是会发送到手机上面的
            4 现在我们是做的一个假的验证码发送到控制台 供我们写项目的时候调试用
    */
    //定义一个全局变量vCode 存储的是后台返回的验证码
    var vCode='';
    $('.btnGetVcode').on('tap',function(){
        //调用获取验证码的API去获取验证码
        $.ajax({
            url:'/user/vCode',
            success:function(data){
                console.log(data.vCode);
                vCode=data.vCode;
            }
        })   
    })
})