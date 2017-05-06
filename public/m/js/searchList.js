mui.init({
    /*下拉刷新*/
    pullRefresh : {
        container:".mui-scroll-wrapper",
        down : {
            callback :function(){
                /*注意：下拉操作完成之后 业务 */
                /*模拟一次向后台发送请求 响应之后的时间消耗*/
                var that = this;/*这个是下拉组件对象  对象当中含有终止下拉操作的方法*/
                setTimeout(function(){
                    /*下拉效果隐藏*/
                    that.endPulldownToRefresh();
                },1000);
            }
        },
        /*上拉加载*/
        up : {
            callback:function(){
                /*注意：上拉操作完成之后 业务 */
                /*模拟一次向后台发送请求 响应之后的时间消耗*/
                var that = this;/*这个是上拉组件对象  对象当中含有终止下拉操作的方法*/
                setTimeout(function(){
                    /*上拉效果隐藏*/
                    /*可传参 如果传的是true 表示没有更多数据*/
                    that.endPullupToRefresh();
                },1000);
            }
        }
    }
});

$(function(){
    /*
     初始化渲染
     1.获取地址栏关键字
     2.通过关键字去后台获取和关键字相关的商品数据
     3.渲染商品列表

     当前页搜索
     1.点击搜索按钮 获取到关键字
     2.通过关键字去后台获取和关键字相关的商品数据
     3.渲染商品列表

     排序展示
     1.点击排序按钮 获取排序方式
     2.通过当前的关键字和排序方式去后台获取相关的商品数据
     3.渲染商品列表

     下拉刷新
     1.当用户下拉页面
     2.通过关键字去后台重新获取和关键字相关的商品数据
     3.渲染商品列表

     上拉加载
     1.当用户上拉页面
     2.通过关键字去后台获取和关键字相关的商品数据（而且是根据当前页面进行获取）
     3.渲染商品列表 当时是追加到页面当中
     * */

    /*1.初始化渲染*/
    var render = function(){
        /*获取地址栏关键字*/
        var key = lt.getUrlParams().key || '';
        /*显示在搜索框中*/
        $('.search_input').val(key);
        /*去后台获取数据*/
        getProductListData({
            proName:key,
            page:1,
            pageSize:10
        },function(data){
            /*渲染商品列表*/
            $('.lt_product').html(template('productTpl',data));
        });
    };
    render();

    /*2.当前页搜索*/
    $('.search_btn').on('tap',function(){
        /*获取搜索框当中的按钮*/
        var key = $.trim($('.search_input').val());
        /*判断是否输入了内容*/
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }

        $('[data-type].now').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');

        $('.lt_product').html('<div class="loading"><span class="mui-icon mui-icon-spinner"></span></div>');
        /*去后台获取数据*/
        getProductListData({
            proName:key,
            page:1,
            pageSize:10
        },function(data){
            /*渲染商品列表*/
            $('.lt_product').html(template('productTpl',data));
        });
    });

    /*3.排序展示*/
    $('[data-type]').on('tap',function(){
        /*当前点击的元素*/
        var $this = $(this);
        /*换箭头*/
        if($this.hasClass('now')){
            var arrow = $(this).find('span');
            if(arrow.hasClass('fa-angle-down')){
                arrow.removeClass('fa-angle-down').addClass('fa-angle-up');
            }else{
                arrow.removeClass('fa-angle-up').addClass('fa-angle-down');
            }
        }else{
            /*给当前元素加上now*/
            $('[data-type].now').removeClass('now').find('span').removeClass('fa-angle-up').addClass('fa-angle-down');
            $this.addClass('now');
        }

        /*获取需要排序的方式*/
        var type = $('[data-type].now').attr('data-type');
        var value = $('[data-type].now').find('span').hasClass('fa-angle-down')?2:1;
        var order = {};
            order[type] = value;

        /*获取搜索框当中的按钮*/
        var key = $.trim($('.search_input').val());
        /*判断是否输入了内容*/
        if(!key){
            mui.toast('请输入关键字');
            return false;
        }

        $('.lt_product').html('<div class="loading"><span class="mui-icon mui-icon-spinner"></span></div>');
        getProductListData($.extend({
            proName:key,
            page:1,
            pageSize:10,
        },order),function(data){
            /*渲染商品列表*/
            $('.lt_product').html(template('productTpl',data));
        });

    });

});

/*获取后台数据 商品列表数据*/
var getProductListData = function(prams,callback){
    $.ajax({
        type:'get',
        url:'/product/queryProduct',
        data:prams,
        dataType:'json',
        success:function(data){
            /*模拟一下加载时间*/
            setTimeout(function(){
                if(data.data.length == 0) mui.toast('没有相关商品');
                callback && callback(data);
            },1000);
        }
    });
}