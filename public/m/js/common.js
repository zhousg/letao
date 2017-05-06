/*封装工具函数*/
window.lt = {};
/*获取地址栏参数*/
lt.getUrlParams = function(){
    /*拿到以get形式传递的地址栏的数据 ?key=1&name=10*/
    var search = location.search;
    /*需要把字符串转换成对象  便于开发使用*/
    var params = {};
    /*如果有？代表有参数*/
    /*没有问号就没有参数*/
    if(search.indexOf('?') == 0){
        search = search.substr(1);
        var arr = search.split('&');
        for(var i = 0 ; i < arr.length ; i++){
            /*itemArr name=10  ----> [name,10]*/
            var itemArr = arr[i].split('=');
            params[itemArr[0]] = itemArr[1];
        }
    }
    return params;
}