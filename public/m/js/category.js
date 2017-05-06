/*初始左侧滚动*/
mui('.lt_cateLeft').scroll({
    indicators:false
});
/*初始右侧滚动*/
var scrollRight = mui('.lt_cateRight').scroll({
    indicators:false
});

/*
 - 渲染动态
 + 左侧分类  需要获取一级分类数据 渲染在页面当中
 + 默认选中一个分类   加载出第一个分类对应的数据  渲染二级分类（右侧内容）
 + 点击一级分类的时候  需要去加载对应的分类数据   渲染二级分类（右侧内容）
 * */
$(function () {
    /*页面*/
    getFirstCategoryData(function (data) {
        /*获取到了数据 data*/
        /*渲染一级分类*/
        $('.lt_cateLeft').find('ul').html(template('firstCategory',data));
        /*默认已经显示的是第一个分类*/
        /*根据第一个分类的id去渲染二级分类*/
        getSecondCategoryData({
            id:data.rows[0].id /*第一个一级分类的id*/
        },function(data){
            /*渲染二级分了*/
            $('.lt_cateRight').find('ul').html(template('secondCategory',data));
        })
    });
    /*交互*/
    $('.lt_cateLeft').on('tap','ul li',function(){
        /*改变当前样式*/
        $('.lt_cateLeft').find('li').removeClass('now');
        $(this).addClass('now');
        /*通过id去获取二级分类的数据*/
        /*获取当前分类的id*/
        getSecondCategoryData({
            id:$(this).data('id') /*第一个一级分类的id*/
        },function(data){
            /*渲染二级分了*/
            $('.lt_cateRight').find('ul').html(template('secondCategory',data));
            /*需要唯一到0的位置  顶部*/
            scrollRight.scrollTo(0,0,100);
        })
    });
});
/*获取一级分类数据*/
var getFirstCategoryData = function (callback) {
    $.ajax({
        type: 'get',
        url: '/category/queryTopCategory',
        data: {},
        dataType: 'json',
        success: function (data) {
            /*做获取数据之后的事情*/
            callback && callback(data);
        }
    })
}
/*获取二级分类的数据*/
var getSecondCategoryData = function(params,callback){
    $.ajax({
        type: 'get',
        url: '/category/querySecondCategory',
        data: params,
        dataType: 'json',
        success: function (data) {
            /*做获取数据之后的事情*/
            callback && callback(data);
        }
    });
}
