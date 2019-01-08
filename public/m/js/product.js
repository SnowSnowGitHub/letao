$(function(){
      //获取查询的产品名  
      var key=getQueryString('key');
    //   console.log(key);

      //把请求的参数放到一个对象里面  方便后面的添加 修改
      var obj={
          proName:key,
          page:1,
          pageSize:4
      };

      //执行请求的产品模块的数据的函数 并渲染到页面上
      getQueryProducts(obj);



    //点击 上架时间 价格 销量  折扣的事件
    $('#main .mui-card-header a').on('tap',function(){
        // console.log('测试');
        var sortType=$(this).data('sort-type');
        var sort=$(this).data('sort');
        sort=sort==1?2:1;
        //修改行内的sort属性
        $(this).data('sort',sort);
        if(sortType=='price'){
            obj.price=sort;
        }else if(sortType=='num'){
            obj.num=sort
        }
        getQueryProducts(obj);
        //回复obj的内容
        obj={
            proName:key,
            page:1,
            pageSize:4
        };
        //给点击的a添加类名改变文字的颜色
        $(this).addClass('active').siblings().removeClass('active')
        //根据升序或者降序来改变 i图标的方向 
        if(sort==1){
            $(this).find('i').removeClass('fa-angle-down').addClass('fa-angle-up')
        }else if(sort==2){
            $(this).find('i').removeClass('fa-angle-up').addClass('fa-angle-down')
        }
        
        //每次重新点击查询之后之后 page要会服到第一页
        page=1;

        //重置上拉加载数据
        mui('#refreshContainer').pullRefresh().refresh(true);

    })



    //封装函数 查询地址栏 根据参数名获取参数的值
    function getQueryString(name){
        var str=location.search;
        str=str.substr(1);
        var arr=str.split('&');
        for(var i=0;i<arr.length;i++){
            var arr2=arr[i].split('=');
            //记得这里要转码
            if(arr2[0]==name) return decodeURI(arr2[1])
        }
    }

  

    //封装函数 通过ajax请求 向数据库 请求产品模块的内容 并渲染到页面上面
    function getQueryProducts(obj){
        $.ajax({
            url:'/product/queryProduct',
            data:obj,
            success:function(obj){
                // console.log(obj);
                var html=template('productList',obj);
                $('#main .products').html(html);
            }
        })
    }

 
    /*
    商品下拉刷新和上拉加载更多
        1 下拉刷新时请求第一页的数据  重新刷新页面html函数
        2 上拉是加载更多 请求下一页的数据  在页面基础上追加下一页的数据 使用append追加
        3 如何让他下拉 或者 上拉使用插件 MUI下拉刷新和上拉加载插件
        4 写上拉下拉的结构
        6 调用JS初始化上拉和下拉
        6 下拉的时候回调函数里面刷新数据 并且结束下拉转圈圈
        7 上拉的时候加载更多的数据 定义一个全局的page=1  每次上拉page++
        8 请求++之后的数据 然后追加渲染到页面上面
        9 判断上拉之后的数据里面是否有长度 有就追加渲染到页面上面 没有的话就提示没有数据了
        10 但是有些时候希望下拉之后 还可以重新继续上拉, 所以在下拉里面要重置一下上拉的加载效果

    */

    //使用mui插件做下拉刷新功能
    mui.init({
        pullRefresh : {
          container:"#refreshContainer",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
          down : {
            height:50,//可选,默认50.触发下拉刷新拖动距离,
            auto: false,//可选,默认false.首次加载自动下拉刷新一次
            contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
            contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
            contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
            //callback :pullfresh-function //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            callback :pulldownRefresh
          },
          up : {
            contentrefresh : "正在加载数据...",
            callback :pullupRefresh          }
        }
      });
      
      //定义下拉后执行的回调函数
      function pulldownRefresh(){

        setTimeout(function(){
            //下拉查询数据
            getQueryProducts(obj);
            //下拉刷新结束  结束转圈圈
            mui('#refreshContainer').pullRefresh().endPulldownToRefresh();
            //重置上拉加载数据
            mui('#refreshContainer').pullRefresh().refresh(true);
        },1000)
    }


    //定义上拉后执行的回调函数
    var page=1;
    function pullupRefresh(){
        page++;
        setTimeout(function(){
            //下拉查询数据
            $.ajax({
                url:'/product/queryProduct',
                data:{
                    proName:key,
                    page:page,
                    pageSize:4,
                },
                success:function(obj){
                    console.log(obj);
                    if(obj.data.length>0){
                        var html=template('productList',obj);
                        $('#main .products').append(html);
                        //下拉刷新结束  结束转圈圈
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh();
                    }else{
                        //是否还有更多数据；若还有更多数据，则传入false; 默认的是false
                        //否则传入true，之后滚动条滚动到底时，将不再显示“上拉显示更多”的提示语，
                        //而显示“没有更多数据了”的提示语；
                        mui('#refreshContainer').pullRefresh().endPullupToRefresh(true);
                    }
                }
            })
            
        },1000)
    }



    //点击立即购买的函数
    $('#main .mui-card-content .products').on('click','.byeNow',function(){
        console.log('哈哈哈')
        var productId=$(this).data('id');
        location='detail.html?id='+productId+'&time='+new Date().getTime();
    })
})