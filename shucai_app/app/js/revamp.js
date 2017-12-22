/**
 * Created by lenovo on 2017/4/2.
 */
(function () {
//传递的参数
    var token, user_id, old_password, new_password, confirm_password
    token = localStorage.getItem("token");
    user_id = localStorage.getItem("user_id");

    var urls = {
        url1: URL.SiteUrl+"/index.php?m=Api&c=User&a=password",
    }
    $(function () {
        // ajax 获取数据
        function resdata(url, mdata, successCall) {
            $.ajax({
                type: "post",
                url: url,
                data: mdata,
                dataType: "json",
                error: function (data) {
                    mui.toast(data.msg, {duration: 'long', type: 'div'})
                },
                success: successCall,
            })
        }

        $(".user-button").on("click", function () {
            old_password = $(".old_password").val();

            new_password = $(".new_password").val();
            confirm_password = $(".confirm_password").val();
            // console.log(old_password);
            var data1 = {
                token: token,
                uesr_id: user_id,
                old_password : old_password,
                new_password : new_password,
                confirm_password : confirm_password
            }
            resdata(urls.url1, data1, function (data) {
                	 console.log(data);
                // console.log("ok");
                // console.log(typeof data.result.shippingList[0].code);
                if (data.status == -2) {
                    mui.alert(data.msg, '温馨提示', function () {
                    });
                } else if (data.status == -102||data.status == -101) {
                    mui.alert(data.msg, '温馨提示', function () {
                        location.href = "login.html"
                    });
                } else if (data.status == 1) {
                        mui.confirm("修改成功，请重新登录。", '温馨提示', ['确认', '取消'], function (e) {
                            if (e.index == 0) {
                                localStorage.removeItem("user_id");
                                localStorage.removeItem("token");
                                location.href = "login.html"
                            } else {
                                //console.log(132);
                            }

                        })
                   
                }else{
                	mui.toast("当前账户无法修改", {duration: 'long', type: 'div'});
                }
            })
        })

    })
})()