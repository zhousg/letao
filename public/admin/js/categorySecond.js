$(function(){
    var currentPageNum = 1;
    var render = function(page){
        getUserListData({
            page:page || currentPageNum,
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
    $('#second').bootstrapValidator({
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
            categoryId: {
                message: '选择分类错误',
                validators: {
                    notEmpty: {
                        message: '请选择分类'
                    }
                }
            },
            brandName: {
                message: '品牌名称错误',
                validators: {
                    notEmpty: {
                        message: '品牌名称不能为空'
                    }
                }
            },
            brandLogo: {
                message: '品牌logo错误',
                validators: {
                    notEmpty: {
                        message: '请上传品牌logo'
                    }
                }
            }
        }
    }).on('success.form.bv',function(e){
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            url: "/category/addSecondCategory",
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
    $('#myModal').on('hidden.bs.modal',function(){
        $('#second').data('bootstrapValidator').resetForm();
        $('.dropdown-toggle').html('选择一级分类');
        $('[name=categoryId]').val('');
        $('#fileupload').siblings('img').remove();
        $('[name=brandLogo]').val('');
        $('[name=brandName]').val('');
    });
    renderCategory();
    $('.dropdown-menu').on('click','a',function(e){
        $('.dropdown-toggle').html($(this).html());
        $('[name=categoryId]').val($(this).data('id'));
        $('#second').data('bootstrapValidator').updateStatus('categoryId', 'NOT_VALIDATED').validateField('categoryId');
    });
    $('#fileupload').fileupload({
        url:'/category/addSecondCategoryPic',
        dataType:'json',
        done:function(e,data){
            var content = '<img style="border:1px solid #ccc;margin-left:10px;" width="100" height="100" src="'+data.result.picAddr+'">';
            if($('#fileupload').siblings('img').length){
                $('#fileupload').siblings('img').replaceWith(content);
            }else{
                $('#fileupload').after(content);
            }
            $('[name=brandLogo]').val(data.result.picAddr);
            $('#second').data('bootstrapValidator').updateStatus('brandLogo', 'NOT_VALIDATED').validateField('brandLogo');
        }
    });
});
var getUserListData = function(params,callback){
    $.ajax({
        type:'get',
        url:'/category/querySecondCategoryPaging',
        data:params,
        dataType:'json',
        success:function(data){
            setTimeout(function(){
                callback && callback(data);
            },500);
        }
    });
};
var renderCategory = function(){
    $.ajax({
        url:"/category/queryTopCategoryPaging",
        type:"get",
        data:{page:1,pageSize:30},
        success:function(data){
            var rows=data.rows,html='';
            for(var i=0;i<rows.length;i++){
                html += '<li><a data-id="'+rows[i].id+'" href="#">'+rows[i].categoryName+'</a></li>'
            }
            $(".dropdown-menu").html(html);
        }
    });
};