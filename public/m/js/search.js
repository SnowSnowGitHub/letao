$(function(){
    /*
    1 添加搜索记录
        a 获取当前的搜索内容
        b 不能直接添加这个内容到数组里面, 把内容存储到一个数组里面去 把数组添加到本地存储中
        c 判断 去除重复的 如果之前的数组中就存在这个值, 就要先删除 再往里面添加
        d 把数组存储到本地存储中的时候, 要把数组转出一个json字符串再存进去
        e 调用设置本地存储的函数 把json字符串存储到本地存储中
    */

    $('.searchBtn').on('click',function(){
        // console.log(this);
        //获取搜索的内容
        var searchCon=$('.searchInput').val().trim();
        if(searchCon==''){
            mui.toast('请输入搜索内容',{ duration:100000, type:'div' }) 
            return;
        }

        //获取以前的历史记录
        var arr=localStorage.getItem('historyItem');
        arr=JSON.parse(arr) || [];
        if(arr.indexOf(searchCon)!=-1){
            arr.splice(arr.indexOf(searchCon),1);
            }

        //把本次搜索记录存入到历史记录中去    
        arr.unshift(searchCon);
        arr=JSON.stringify(arr);
        localStorage.setItem('historyItem',arr);
        
        //清空搜索框的内容
        $('.searchInput').val('');

        //更新当前的历史记录
        updateHistory();
        console.log(searchCon)
        //完成搜索记录后跳转到商品详情的页面
        var params='key='+searchCon+'&time'+new Date().getTime();
        //如果不手动加密的话 默认的是encodeURI加密
        location='product.html?'+params;
    })


    //做历史搜索记录的删除功能
    $('.search-history ul').on('click','span',function(){
        
        var arr=localStorage.getItem('historyItem');
        arr=JSON.parse(arr);
        var id=$(this).data('id');
        //移除点击的这一个span标签
        $('.search-history ul li').eq(id).remove();
        arr.splice(id,1);
        arr=JSON.stringify(arr);
        localStorage.setItem('historyItem',arr);
        //更新页面显示的历史记录
        updateHistory();
    })

    //做清空历史记录的功能
    $('.clearRecord').on('click',function(){
        //删除localStorage里面key为historyItem的值
        localStorage.removeItem('historyItem');
        //删除全部的localstorage的值 现在我们localStorage里面只有historyItem这一个项 所以可以使用下面的全部清空
        // localStorage.clear();
        updateHistory();
    })


    //初始化历史搜索记录
    updateHistory();
    function updateHistory(){
        var arrJson=localStorage.getItem('historyItem');
        arr=JSON.parse(arrJson) || [];
        var html=template('historyItem',{data:arr});
        $('.search-history ul').html(html);
    }
    

    // 做历史记录的点击搜索功能  点击跳转到产品对应的产品 需要使用事件委托进行注册
    $('#main .search-history .mui-card-content ul').on('tap','li',function(){
        var searchCon=$(this).data('value');
        console.log(searchCon);
        //拼接url然后跳转到商品详情页面 要把点击的这个历史记录的值传递过去
        location='product.html?key='+searchCon+'&time='+new Date().getTime();
    })
})





/* 
    知识点:localstorage 只能够存储简单类型的数据 数组 对象 函数代码等浮渣类型都存储不了
    如果是对象或者数组 需要转成json字符串去存储
    如果存储的时候是字符串 那么取出来的时候也是字符串  
    需要通过JSON.parse  和 JSON.stringify 来转换
*/