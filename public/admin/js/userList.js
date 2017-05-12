$(function(){
    var currentPageNum = 1;
    var render = function(){
        getUserListData({
            page:currentPageNum,
            pageSize:5
        },function(data){
            $('tbody').html(template('rows',data));
            $(".pagination").bootstrapPaginator({
                bootstrapMajorVersion: 3,
                size: 'small',
                currentPage: data.pageNum,
                totalPages: Math.ceil(data.total/data.size),
                numberOfPages: 5,
                onPageClicked: function (event, originalEvent, type, page) {
                    render(currentPageNum = page);
                }
            });
        })
    };
    render();
    $('tbody').on('click','[data-id]',function(){
        var $btn = $(this),$modal = $('#optionModal');
        $modal.modal('show').find('.modal-body span').html($btn.html());
        $modal.off('click','.btn-primary').on('click','.btn-primary',function(){
            $.ajax({
                type:'post',
                url:'/user/updateUser',
                data:{
                    id:$btn.data('id'),
                    isDelete:$btn.html()=='启用'?1:0
                },
                success:function(data){
                    if(data.success){
                        render(currentPageNum);
                        $modal.modal('hide');
                    }
                }
            })
        });
    });
});
var getUserListData = function(params,callback){
    $.ajax({
        type:'get',
        url:'/user/queryUser',
        data:params,
        dataType:'json',
        success:function(data){
            setTimeout(function(){
                callback && callback(data);
            },500);
        }
    });
}