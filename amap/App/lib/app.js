/**
 * Created by Liangyong on 2017/4/17 0017.
 */
// 当前资源URL目录
var baseUrl = (function () {
    var scripts = document.scripts, src = scripts[scripts.length - 1].src;
    return src.substring(0, src.lastIndexOf("/") + 1);
})();
//console.log(baseUrl);
baseUrl = baseUrl.replace('/js', '');


/**
 * 占位符替换：
 * 使用方法： "http://{0}/{1}".format("a.com", "index.html")
 * @returns {String}
 */
String.prototype.format = function () {
    if (arguments.length == 0) return this;
    for (var s = this, i = 0; i < arguments.length; i++)
        s = s.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return s;
};

/*
 * 格式化日期
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
}	
// 获取url中的参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    } else {
        return null;
    }
}
//去除所有空格
//String.prototype.NoSpace = function() 
//{ 
//	return this.replace(/\s+/g, ""); 
//}
// RequireJs 配置参数
require.config({
    baseUrl: baseUrl,
    waitSeconds: 0,
    map: {'*': {css: './plugs/require/require.css'}},

    paths: {
        // 开源插件 CDN
        'jquery': ['https://cdn.bootcss.com/jquery/1.12.4/jquery.min', './plugs/jquery/jquery.min'],
        'jquery.cookies': ['https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie', './plugs/jquery/jquery.cookie'],

        'echarts': ['./plugs/echarts/echarts'],

        'range': ['./plugs/jquery/jquery.range'],

        'mui': ['./plugs/mui/mui'],       

        //==========================control .js===============================
		"amap": ["http://webapi.amap.com/ui/1.0/main.js?v=1.0.11"],
		
        'core': ['./core'],

        'URL': ['./URL'],

        'base64': ['./plugs/jquery/jquery.base64'],

        'banner': ['../js/banner'],

        'md5': ['./plugs/md5/md5'],

        'tpl': ['./plugs/arttempale/arttmpl'],
    },
    shim: {
        'base64': {deps: ['jquery']},
        'range': {deps: ['jquery']}
    },
    deps: ['css!https://cdn.bootcss.com/font-awesome/4.7.0/css/font-awesome.min.css'],

    // 开启debug模式，不缓存资源
    urlArgs: "t=" + (new Date()).getTime()
});


//框架初始化
require(['jquery', 'jquery.cookies', 'mui', 'URL', 'core'], function ($, cookie, mui, URL, core) {

    url = window.location.pathname;
    arr = url.split('/');
    
    var url_msg = URL.get_messages;
    
	var token = window.localStorage.getItem('aut_token');

	var data_msg = {
		act: 'api',
		aut_token: token,
		page: 1,
		page_size: 20,
		is_push: 0,
		is_read: 0
	}
//  console.log('val='+arr[arr.length - 1]);

    if (!core.getToken() && (arr[arr.length - 1] != 'login.html')) {
        location.href = './login.html';
    }
	
	function get_msg() {
		core.ajax(url_msg, data_msg, function(data) {
			if(data.status == 1) {		
				if($('.style_badge').length > 0){
					if(data.result.length > 0){
						if(data.result.length > 9){
							$('.style_badge').html(9);
							console.log($('.style_badge'));
						}else $('.style_badge').html(9);
					}
				}
			}
		}, function() {}, 'post');
	}

	get_msg();
	
});
 