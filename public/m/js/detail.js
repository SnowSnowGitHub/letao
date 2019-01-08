$(function(){

    //请求数据
    //从地址栏获取传递过来的产品id 
    var id=getQueryString('id');
    console.log(id)
    $.ajax({
        url:'/product/queryProductDetail',
        data:{id:id},
        success:function(data){
            console.log(data)
            var min=data.size.split('-')[0];
            var max=data.size.split('-')[1];
            var size=[];
            for(var i=min;i<=max;i++){
                size.push(i)
            }
            data.size=size;
            //调用模板
            var html=template('productInfo',data);
            // console.log(html);
            $('#main .mui-scroll').html(html);

            //初始化 数量选择控件
            mui('.mui-numbox').numbox();

            //初始化区域滚动的插件
            mui('.mui-scroll-wrapper').scroll({
                deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
            });

            //初始化轮播图
            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
            interval:2000//自动轮播周期，若为0则不自动播放，默认为0；
            });
            
            
            //做尺码的点击按钮
            //已经渲染完了之后再点击选择的 所以可以不用使用事件委托注册
            $('#main .product-size button').on('tap',function(){
                
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            })


            /* 
            实现添加购物车的功能
                1 点击添加购物车的按钮 实现加入购物车
                2 获取当前用户选择的尺码和数量
                3 如果没有选择尺码或者数量要提示用户选择尺码 或者  数量
                4 把用户选择的尺码和数量作为参数调用加入购物车
                5 接收API返回值是成功还是失败  如果是成功表示加入成功 去购物车查看
                6 如果失败表示没有登录 跳转到登录页面去登录
            */
            //点击加入购物车  
            $('#footer .addCart').on('tap',function(){
                
                var size=$('.product-size .mui-btn-warning').data('size');
                var num=mui('.mui-numbox').numbox().getValue()
                if(!size){
                    mui.toast('请选择合适的尺码',{ duration:'1000', type:'div' });
                    return false;
                }
                if(!num){
                    mui.toast('请选择数量',{ duration:'1000', type:'div' });
                    return false;
                }
                $.ajax({
                    type:'post', //get 是默认的 post不是默认的 要写上
                    url:'/cart/addCart',
                    data:{productId:id,num:num,size:size},
                    success:function(data){
                        console.log(data);
                        if(data.success){
                            // mui.toast('添加购物车成功',{ duration:'1000', type:'div' });
                            var btnArray = ['是', '否'];
                            mui.confirm('添加购物车成功<br> 是否跳转到购物车页面', '', btnArray, function(e) {
                                if (e.index == 0) {
                                    location='cart.html'
                                }
                            })
                        }else{
                            // alert('请先登录');
                            location='login.html?returnUrl='+location.href;
                        }
                    }

                })
            })
        }
    })




    //封装函数 获取 传递过来的产品的id
    function getQueryString(id){
        var str=location.search;
        str=str.substr(1);
        var arr=str.split('&');
        console.log(arr);
        for(var i=0;i<arr.length;i++){
            var arr2=arr[i].split('=');
            //记得这里要转码
            if(arr2[0]==id) return arr2[1];
        }
    }
})