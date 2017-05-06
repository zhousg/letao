/*初始化区域滚动组件*/
mui('.mui-scroll-wrapper').scroll({
    indicators:false
});
$(function(){
    /*都会和localStorage打交道   约定一个键  leTaoHistory */

    /*1渲染列表*/
    /*获取*/
    var historyList = getHistoryData();
    /*渲染*/
    $('.lt_history').html(template('historyTpl',{list:historyList}));
    $('.search_input').val('');

    /*2点击搜索*/
    $('.search_btn').on('tap',function(){
        /*获取关键字*/
        var key = $.trim($('.search_input').val());
        /*如果用户没有输入*/
        if(!key){
            /*提示*/
            mui.toast('请输入关键字');
            return false;
        }
        /*记录这一次的搜索*/
        var arr = getHistoryData();

        /*1.在正常的10条记录内 正常添加*/
        /*2.已经10条记录了    添加一条 并且 删除最早的一条 */
        /*3.如果有相同记录    添加一条 并且 删除相同的一条 */
        /*是否有相同数据*/
        var isHave = false;
        var haveIndex;
        for(var i = 0 ; i < arr.length ; i ++){
            if(key == arr[i]){
                isHave = true;
                haveIndex = i;
                break;
            }
        }
        if(isHave){
            /*3.如果有相同记录*/
            arr.push(key);
            /*删除*/
            arr.splice(haveIndex,1);
        }else{
            if(arr.length < 10){
                /*1.在正常的10条*/
                arr.push(key);
            }else{
                /*已经10条记录*/
                arr.push(key);
                /*清除第一条*/
                arr.splice(0,1);
            }
        }
        /*存起来*/
        localStorage.setItem('leTaoHistory',JSON.stringify(arr));
        /*跳转搜索列表*/
        location.href = 'searchList.html?key='+key;
    });

    /*3删除记录*/
    $('.lt_history').on('tap','.mui-icon',function(){
        /*1.获取索引*/
        var index = $(this).attr('data-index');
        /*2.获取数据*/
        var arr = getHistoryData();
        /*3.删除数据*/
        arr.splice(index,1);
        /*4.存储数据*/
        localStorage.setItem('leTaoHistory',JSON.stringify(arr));
        /*5.重新渲染*/
        $('.lt_history').html(template('historyTpl',{list:arr}));
    });

    /*4清空记录*/
    $('.lt_history').on('tap','.fa',function(){
        /*清空数据*/
        localStorage.setItem('leTaoHistory','');
        /*重新渲染*/
        $('.lt_history').html(template('historyTpl',{list:[]}));
    });

});
/*获取存储数据*/
var getHistoryData = function(){
    /*1.约定一个键  leTaoHistory 值存的是json格式的字符串*/
    /*2.通过这个键获取值 如果有就使用 如果没有默认空数组的字符串*/
    var str = localStorage.getItem('leTaoHistory')||'[]';
    /*3.转成成js数据*/
    var arr = JSON.parse(str);
    /*4.返回js可操作的数组*/
    return arr;
}
