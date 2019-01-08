$(function(){
    /*
    1 添加搜索记录
        a 获取当前的搜索内容
        b 不能直接添加这个内容到数组里面, 先把内容存储到一个数组里面去, 把数组添加到本地的localstorage 存储中
        c 判断 去除重复的 如果之前的数组中就存在这个值 那么就要先删除原先数组里面的这个值, 再往数组里面进行添加
        d 把数组存储到本地存储当中去, 要把数组转为一个json的字符串再存进去
        e 调用设置本地存储的函数, 把json字符串存储到本地存储当中去

    */

    $('#main .searchBtn').on('click',function(){
        var searchCon=$('.searchInput').val();
        if(searchCon==''){
            alert('请输入您要搜索的内容');
            return;
        }
        var arr=localStorage.getItem('historyItem');
        arr=JSON.parse(arr) || [];
        if(arr.indexOf(searchCon)!=-1){
            //判断 如果原来的数组中有本次搜索的内容 就删除
            arr.splice(arr.indexOf(searchCon),1);
        }
        arr.unshift(searchCon);
        localStorage.setItem('historyItem',JSON.stringify(arr));

        //清空搜索框的内容
        $('.searchInput').val('');

        //更新当前页面的历史记录
        updateHistoryItem();

    })
    //做点击 x 删除的功能
    $('#main ul').on('click','li span',function(){
        var id=$(this).data('id');
        $('#main ul li').eq(id).remove();
        var arrJson=localStorage.getItem('historyItem');
        arr=JSON.parse(arrJson);
        arr.splice(id,1);
        localStorage.setItem('historyItem',JSON.stringify(arr));
        updateHistoryItem();
    })

    updateHistoryItem();
    function updateHistoryItem(){
        var arrJson=localStorage.getItem('historyItem');
        arr=JSON.parse(arrJson);
        var html=template('historyItem',{data:arr});
        $('.search-history ul').html(html);
    }
})