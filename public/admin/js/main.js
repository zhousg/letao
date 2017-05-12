$(function(){
    $('.lt_menu').on('click','li > a',function(){
        var that = $(this);
        if(that.attr('href') == 'javascript:;'){
            that.siblings('.child').slideToggle();
        }
    })
    $('[data-menu]').on('click',function(){
        $('aside').toggle();
        $('section').toggleClass('menu');
    });

    NProgress.configure({ showSpinner: false });
    $(window).ajaxStart(function(){
        NProgress.start();
    });
    $(window).ajaxStop(function(){
        NProgress.done();
    });

    $('[data-logout]').length && (function(){
        var data = '<div class="modal fade" id="logoutModal">' +
                        '<div class="modal-dialog modal-sm">' +
                            '<div class="modal-content">' +
                                '<div class="modal-header">' +
                                    '<button type="button" class="close" data-dismiss="modal"><span>&times;</span></button>' +
                                    '<h4 class="modal-title">温馨提示</h4>' +
                                '</div>' +
                                '<div class="modal-body">' +
                                    '<p class="text-danger"><span class=" glyphicon glyphicon-info-sign"></span> 您确定要退出乐淘后台管理系统吗？</p>' +
                                '</div>' +
                                '<div class="modal-footer">' +
                                    '<button type="button" class="btn btn-default" data-dismiss="modal">取消</button>' +
                                    '<button type="button" class="btn btn-primary">确定</button>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
        $('body').append(data);
        $('#logoutModal').on('click','.btn-primary',function(){
            $.ajax({
                type: "get",
                url: "/employee/employeeLogout",
                success: function (data) {
                    if (data.success) {
                        setTimeout(function(){
                            location.href = "login.html";
                        },500);
                    }
                }
            })
        });
    })();

});