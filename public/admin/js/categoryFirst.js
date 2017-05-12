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
    $('#top').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        submitHandle:function(validator, form, submitButton){
            validator.defaultSubmit();
        },
        excluded:[":disabled"],
        fields: {
            categoryName: {
                message: '分类名称错误',
                validators: {
                    notEmpty: {
                        message: '分类名称不能为空'
                    }
                }
            }
        }
    }).on('success.form.bv',function(e){
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            url: "/category/addTopCategory",
            dataType: "json",
            type: "POST",
            data: $form.serialize(),
            success: function (data) {
                if (data.success) {
                    $('#myModal').modal('hide');
                    render();
                } else {
                    $form.data('bootstrapValidator').disableSubmitButtons(false);
                }
            }
        });
    });
});
var getUserListData = function(params,callback){
    $.ajax({
        type:'get',
        url:'/category/queryTopCategoryPaging',
        data:params,
        dataType:'json',
        success:function(data){
            setTimeout(function(){
                callback && callback(data);
            },500);
        }
    });
}