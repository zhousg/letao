$(function(){
    $('#login').bootstrapValidator({
        message: 'This value is not valid',
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',
            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            username: {
                message: '用户名错误',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    }
                }
            },
            password: {
                message: '密码错误',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            }
        }
    }).on('success.form.bv',function(e){
        e.preventDefault();
        var $form = $(e.target);
        $.ajax({
            url: "/employee/employeeLogin",
            dataType: "json",
            type: "POST",
            data: $form.serialize(),
            success: function (data) {
                if (data.success) {
                    location.href = "index.html";
                } else {
                    $form.data('bootstrapValidator').disableSubmitButtons(false);
                }
            }
        });
    });
});