mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    scrollY: true, //是否竖向滚动
    scrollX: false, //是否横向滚动
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    bounce: true //是否启用回弹
});


// 使用zepto的$.ajax发送请求
// 分类页面左侧的数据请求
$.ajax({
    //默认的type就是get, 可以省略不写
    type:'get',
    url:'/category/queryTopCategory',//url是请求地址, 必须要写
    //dataType:'json',//默认的也是把json转出为JS对象, 可以省略
    dataType:'json',
    success:function(obj){
        console.log(obj);
        var html=template('categoryLeftTpl',obj);
        // console.log(html);
        $('#main .left ul').html(html);
    }
})


// 分类页面右侧的数据请求
getRigthtCategory(1)
$('#main .left ul').on('click','li a',function(){
    var id=$(this).data('id');
    getRigthtCategory(id);
    $('#main .left ul li').eq(id-1).addClass('active').siblings().removeClass('active');
})


//封装获取右侧数据的方法
function getRigthtCategory(id){
    $.ajax({
        url:'/category/querySecondCategory',
        data:{
            id:id
        },
        success:function(obj){
            console.log(obj);
            var html=template('categoryRightTpl',obj);
            $('#main .right .mui-row').html(html);
        }
    })
}