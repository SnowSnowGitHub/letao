$(function(){
    //执行获取购物车产品列表的函数 渲染购物车页面的产品
    getCartProduct()

    //实现下拉刷新和上拉加载页面内容
    //初始化插件
    mui.init({
        pullRefresh: {
            container: '#pullrefresh',
            down: {
                callback: pulldownRefresh
            },
            up: {
                contentrefresh: '正在加载...',
                callback: pullupRefresh
            }
        }
    });


    //定义一个全局变量page 当页面的页码数
    var page=1;
    //封装下拉刷新执行的回调函数
    function pulldownRefresh(){
        setTimeout(function(){
            //加载数据
            getCartProduct();
            //结束下拉刷新
            mui('#pullrefresh').pullRefresh().endPulldownToRefresh();

            //重置下拉加载事件
            mui('#pullrefresh').pullRefresh().refresh(true);
            //page也要重置为1  下次加载的时候 从第一页开始加载
            page=1;
        }, 1500);
    }


    //封装上拉加载执行的回调函数
    function pullupRefresh(){
		setTimeout(function() {
            page++;
            $.ajax({
                url:'/cart/queryCartPaging',
                data:{
                    page:page,
                    pageSize:5
                },
                success:function(obj){
                    console.log(obj);
                    if(obj instanceof Array){
                        obj={data:obj}
                    }
                    if(obj.data.length>0){
                        // 请求成功渲染到页面上面
                        var html=template('cartProductList',obj);
                        $('#main ul').append(html);
                        //加载完成后 结束上拉加载
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                    }else{
                        // mui.toast('没有更多数据了');
                        mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
                    }
                }
            });


		}, 1500);
    }

    //做产品的编辑点击事件
    $('#main ul').on('tap','.btn-update',function(){
        //获取当前点击编辑按钮所在的li标签 用于后面 关闭滑动使用
        var currentLi=this.parentNode.parentNode;
        var data=$(this).data('value');
        console.log(data);
        var min=+data.productSize.split('-')[0];
        var max=+data.productSize.split('-')[1];
        var size=[];
        for(var i=min;i<=max;i++){
            size.push(i);
        }
        data.productSize=size;
        var html=template('updateTpl',data)
        
        // . 去掉html标签中的回车换行 不然变成br标签
        html = html.replace(/[\r\n]/g, "");
        var btnArray=['确定','取消']
        mui.confirm(html, ' ', btnArray, function(e) {
            if (e.index == 0) {
                //获取新选择的鞋码
                var size=$('.mui-btn.mui-btn-warning').data('size');
                console.log(size);
                var num=mui('.mui-numbox').numbox().getValue();
                console.log(num);
                $.ajax({
                    url:'/cart/updateCart',
                    type:'post',
                    data:{
                        id:data.id,
                        size:size,
                        num:num
                    },
                    success:function(data){
                        if(data.success){
                            //更新成功 刷新当前页面的产品信息
                            getCartProduct()
                        }else{
                            alert('更新产品信息失败')
                        }
                    }
                })
            } else {
                mui.swipeoutClose(currentLi);
            }
        })

        //弹窗出来后
        //初始化数字输入框
        mui('.mui-numbox').numbox()
        //初始化尺码点击 让尺码能够点击切换 这里不需要委托 因为到这里已经渲染完毕了
        $('.product-size button').on('tap',function(){
            $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning')
        })
    })


    // 做产品删除的事件
    $('#main ul').on('tap','.btn-delete',function(){
        //获取点击产品所在的li元素  为了后面点击否 取消左滑动
        var currentLi=this.parentNode.parentNode;
        //当前点击产品的id
        var id=$(this).data('id');
        console.log(id);
        var btnArray = ['是', '否'];
        mui.confirm('确定要删除该商品吗?', '', btnArray, function(e) {
            if (e.index == 0) {
                $.ajax({
                    url:'/cart/deleteCart',
                    data:{
                        id:[id]
                    },
                    success:function(data){
                        if(data.success){
                            getCartProduct()
                        }else{
                            alert('删除失败')
                        }
                    }
                })
            } else {
                mui.swipeoutClose(currentLi);
            }
        })

    })



    /* 计算选中商品的订单总额
        1 获取页面所有的复选框 添加一个选择事件 (change)
        2 在change里面获取所有选中的复选框 :checked
        3 遍历所有选中的复选框获取他们的价格和数量  价格*数量
        4 把每个商品总价 累加就是总金额

    */
    $('#main ul').on('change','.input-select',orderTotalPrice);
    function orderTotalPrice(){
        var selectList=$('#main ul .input-select:checked');
        var totalPrice=0;
        selectList.each(function(index,ele){
            var num=$(this).data('num');
            var price=$(this).data('price');
            totalPrice+=num*price;
        })
        totalPrice=totalPrice.toFixed(2);
        $('#order .totalPrice').html(totalPrice);
    }

    // 封装函数 请求购物车产品列表的数据
    function getCartProduct(){
        $.ajax({
            url:'/cart/queryCartPaging',
            data:{
                page:1,
                pageSize:5
            },
            success:function(data){
                // console.log(data);
                // 请求成功渲染到页面上面
                var html=template('cartProductList',data);
                $('#main ul').html(html);
                //下面这个是 页面一渲染完 就计算选中的总价格
                orderTotalPrice();
            }
        })
    }
})