/**
 * Created by lenovo on 2017/4/3.
 */
(function () {
    //传递的参数
    var token = localStorage.getItem("token");
    var unique_id = localStorage.getItem("unique_id");
    //请求地址
    var urls = {
        url1: URL.ApiUrl + '' + URL.sendSms,
        url2: URL.ApiUrl + '' + URL.register,
    }
    $('#return').on('click',function(){
       window.location.href = "login.html";
    });


    function yzPhone(that, tag) {
        var reg = /^1[3|4|5|7|8][0-9]\d{4,8}$/i;//验证手机正则(输入前7位至11位)
        var str = "";
        
        if (that.val() == "" || that.val() == "请输入手机号") {
            str = "手机号不能为空";
        } else if (that.val().length < 11) {
            str = "手机号码长度有误";
        } else if (!reg.test(that.val())) {
            str = "手机号码不存在";
        }
        if (!str) {
            return true;
        }
        if (tag) {
            that.focus(function () {
                that.val("");
                that.css("color", "black")
            });
            that.val(str).css("color", "#EC8924");
        } else {
            mui.toast(str, {duration: 'long', type: 'div'});
        }
        return false;
    }

    $(function () {

        //验证手机号码
        $(".moblie").blur(function () {
            yzPhone($(this), true);
        });
        //验证验证码
        $(".test").blur(function () {
            var reg = /^\d{4}$/;
            if ($(".test").val() == "" || $(".test").val() == null) {
                $(".test").val("验证码不能为空").css("color", "#EC8924");
                $(".test").focus(function () {
                    $(".test").val("");
                    $(".test").css("color", "black")
                });
            }
            else if ($(".test").val().length < 4) {
                $(".test").val("验证码长度有误").css("color", "#EC8924");
                $(".test").focus(function () {
                    $(".test").val("");
                    $(".test").css("color", "black")
                });
            }
            else if (!reg.test($(".test").val())) {
                $(".test").val("验证码不存在").css("color", "#EC8924");
                $(".test").focus(function () {
                    $(".test").val("");
                    $(".test").css("color", "black")
                });
            }
        });
        //密码栏失去焦点
        $(".password").blur(function () {
            var reg = /^[\@A-Za-z0-9\!\#\$\%\^\&\*\.\~]{6,22}$/;
            if (!reg.test($(".password").val())) {
                $(".password").attr("type", "text").val("请输入6~12位的数字、字母！").css("color", "#EC8924");
                $(".password").focus(function () {
                    $(".password").attr("type", "password");
                    $(".password").val("");
                    $(".password").css("color", "black")
                });
            }
        });
        /*确认密码失去焦点*/
        $(".password2").blur(function () {
            var pwd1 = $(".password").val()
            var pwd2 = $(this).val();
            if (($(this).val() == '请再次输入密码' || $(this).val() == "") && (pwd1 == "请输入密码" || pwd1 == "")) {
                return;
            } else if (pwd1 != pwd2) {
                $(".password2").attr("type", "text").val("两次密码输入不一致！").css("color", "#EC8924");
                $(".password2").focus(function () {
                    $(".password2").attr("type", "password");
                    $(".password2").val("");
                    $(".password2").css("color", "black")
                })
            }
        });


        // ajax 获取数据
        function resdata(url, method, mdata, successCall) {
            $.ajax({
                type: method,
                url: url,
                data: mdata,
                dataType: "json", 
                error: function (data) {
                    mui.toast(data.msg, {duration: 'long', type: 'div'})
                },
                success: successCall,
            })
        }

        var times;
        //点击获取短信验证码
        $(".register-yzm").on("click", function () {
            times = 60;
            if (yzPhone($(".moblie"), false)) {
                var username = $(".moblie").val();
                var data1 = {mobile: username, unique_id: unique_id}
                // console.log(data1.mobile);
                resdata(urls.url1, "get", data1, function (data) {
                    console.log(data);
                    // console.log("ok");
                    if (data.status == -2) {
                        mui.alert(data.msg, '温馨提示', function () {
                        });
                    } else if (data.status == -102 || data.status == -101) {
                        mui.alert(data.msg, '温馨提示', function () {
                        });
                    }
                })
                function timeEnd() {
                    if (times == 0) {
                        $(".register-yzm").removeAttr("disabled");
                        $(".register-yzm").text("获取短信验证码");
                        times = 60;
                    } else {
                        $(".register-yzm").attr("disabled", "disabled");
                        $(".register-yzm").text("重新获取(" + times + "秒)");
                        times--;
                        setTimeout(function () {
                            timeEnd();
                        }, 1000)
                    }
                }
                timeEnd();

            }
        })


        //点击注册提交
        $(".register-button").on("click", function () {
            // 获取页面传递参数
            var code = $(".test").val();
            var password = $(".password").val();
            var password2 = $(".password2").val();
            var username = $(".moblie").val();

            var data2 = {
                username: username,
                password: password,
                unique_id: unique_id,
                password2: password2,
                code: code
            }
            resdata(urls.url2, "post", data2, function (data) {
                // console.log(data);
                // console.log("ok");
                if (data.status == -1) {
                    mui.alert(data.msg, '温馨提示', function () {
                    });
                } else if (data.status == -102) {
                    mui.alert(data.msg, '温馨提示', function () {
                    });
                } else if (data.status == 1) {
                    mui.alert(data.msg, '温馨提示', function () {
                        location.href = "login.html"
                    });
                } else {
                    mui.alert(data.msg, '温馨提示', function () {
                    });
                }


            })
        })
    })
})()