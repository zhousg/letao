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
    $('form').bootstrapValidator({
        message: 'This value is not valid',
        custom: {
            priceThan: function() {
                var old = $("[name=oldPrice]").val();
                var now = $("[name=price]").val();
                if(now > old){
                    return false;
                }else{
                    return true;
                }
            }
        },
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
            brandId: {
                validators: {
                    notEmpty: {
                        message: '请选择品牌'
                    }
                }
            },
            proName: {
                validators: {
                    notEmpty: {
                        message: '请输入商品名称'
                    }
                }
            },
            num: {
                validators: {
                    notEmpty: {
                        message: '请输入商品数量'
                    },
                    regexp: {
                        regexp: /^\d+$/,
                        message: '请输入正确的手机号码'
                    }
                }
            },
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: '请输入商品原价'
                    },
                    regexp: {
                        regexp: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
                        message: '请输入正确的价格'
                    },
                    priceThan: {
                        message: '现价必须大于等于原价格'
                    }
                }
            },
            price: {
                validators: {
                    notEmpty: {
                        message: '请输入商品现价'
                    },
                    regexp: {
                        regexp: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
                        message: '请输入正确的价格'
                    },
                    priceThan: {
                        message: '现价必须大于等于原价格'
                    }
                }
            },
            size: {
                validators: {
                    notEmpty: {
                        message: '请输入鞋子尺码'
                    }
                }
            },
            proDesc: {
                validators: {
                    notEmpty: {
                        message: '请输入商品描述'
                    },
                    stringLength:{
                        min:10,
                        max:100,
                        message: '请输入10-100个字符'
                    }
                }
            },
            pic: {
                validators: {
                    notEmpty: {
                        message: '请上传3张商品图片'
                    }
                }
            }
        }
    }).on('success.form.bv',function(e){
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            url: "/product/addProduct",
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
    $('.dropdown-menu').on('click','a',function(e){
        $('.dropdown-toggle').html($(this).html());
        $('[name=brandId]').val($(this).data('id'));
        $('form').data('bootstrapValidator').updateStatus('brandId', 'NOT_VALIDATED').validateField('brandId');
    });
});
var getUserListData = function(params,callback){
    $.ajax({
        type:'get',
        url:'/product/queryProductDetailList',
        data:params,
        dataType:'json',
        success:function(data){
            setTimeout(function(){
                callback && callback(data);
            },500);
        }
    });
}
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