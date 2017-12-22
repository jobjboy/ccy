(function () {
    window.URL = window.URL || window.webkitURL;
    var token = localStorage.getItem("token");
    var user_id = localStorage.getItem("user_id");

    var order_detail_url = 'http://192.168.0.116/index.php?m=Api&c=User&a=getOrderDetail&id={0}&user_id={1}&token={2}';

    //获取url中的order_id参数
    try {
        var order_id = getUrlParam('order_id');
    } catch (e) {
        mui.alert('参数错误', '温馨提示');
    }
    var order_detail_url1 = order_detail_url.format(order_id, user_id, token); //url动态替换

    //获取订单详情
    resdata(order_detail_url1, function (data) {
        console.log(data);
        switch (data.status) {
            case -1:
                mui.alert(data.msg, '温馨提示', function () {
                    location.href = "index.html";
                });
                break;
            case 1:
                if (data.result.order_status_code != 'WAITCCOMMENT') {
                    mui.alert('该订单——' + data.result.order_status_desc, '温馨提示', function () {
                        history.go(-1);
                    });
                }
                var goods_id_string = '';
                data.result.goods_list.forEach(function (val) {
                    goods_id_string += val.goods_id + ',';
                });

                $("#goods_id").val(goods_id_string.substring(0, goods_id_string.length - 1));
                $("#user_id").val(user_id);
                $("#order_id").val(order_id);
                $("#token").val(token);


                var html = template('order_goods_img', data.result);
                $('.describe-title').html(html);
                break;
            default:
                mui.alert(data.msg, '温馨提示', function () {
                    location.href = "index.html";
                });
                break;
        }
    });

    //评分
    $(".describe-tb li").mouseover(function () {
        // console.log("over");
        $(this).parent().find("li").removeClass("checkall-ys");
        for (var i = 0; i < $(this).attr("data-start"); i++) {
            $(this).parent().find("li").eq(i).addClass("checkall-ys");
        }
    });

    $(".describe-tb li").mouseout(function () {
        // console.log("out");
        $(this).parent().find("li").removeClass("checkall-ys");
        for (var i = 0; i < $(this).attr("data-start"); i++) {
            $(this).parent().find("li").eq(i).addClass("checkall-ys");
        }
    });

    $(".describe-tb li").click(function () {
        var p = $(this).parent();
        var _this_start = $(this).data("start");

        p.find("input").val(_this_start);
        p.find("span").html(_this_start + "星");

        p.find('li').each(function (index, item) {
            var t = $(item);
            var start = t.attr('data-start');
            t = t.find('img');
            (parseInt(start) <= parseInt(_this_start)) ? t.removeClass() : t.addClass('filter');
        })

    });
    //end   评分

    //提交
    $("#evaluate_button").click(function () {
        //  a=$("#checkbox").is(":checked");

        var content = $("#content_13").val();
        var error = [];
        var img_num = 0;
        var AllImgExt = ".jpg|.jpeg|.gif|.bmp|.png|";//全部图片格式类型
        //var title = document.getElementById("title").value;
        $(".up_file input").each(function (index) {
            FileExt = this.value.substr(this.value.lastIndexOf(".")).toLowerCase();
            if (this.value != '') {
                img_num++;
                if (AllImgExt.indexOf(FileExt + "|") == -1) {
                    error.push("第" + (index + 1) + "张图片格式错误");
                }
            }
        });
        $(".describe-tb input").each(function (index) {
            if (this.value == '0') {
                if (this.name == 'goods_rank') {
                    error.push('请给描述评分！');
                }
                ;
                if (this.name == 'service_rank') {
                    error.push('请给服务评分！');
                }
                ;
                if (this.name == 'deliver_rank') {
                    error.push('请给物流评分！');
                }
                ;
            }
        });
        if (content == '') {
            error.push('评价内容不能为空！');
        }

        if (error.length > 0) {
            mui.alert(error, '温馨提示', function () {
            });
            return false;
        } else {
            // console.log($("#goods_id").val() + "-----------");
            $("#evaluate_form").ajaxSubmit({
                type: 'post',
                url: 'http://192.168.0.116/index.php?m=Api&c=User&a=add_comment',
                success: function (data) {
                    mui.alert('评论成功', '温馨提示', function () {
                        history.go(-1);
                    });
                },
                error: function (XmlHttpRequest, textStatus, errorThrown) {
                    mui.alert('提交失败，请稍后重试', '温馨提示', function () {
                        location.href = "index.html";
                    });
                }
            });
        }
        return false;
    });

})();


function handleFiles(obj, id) {
    fileList = document.getElementById("fileList" + id);
    var files = obj.files;
    img = new Image();
    if (window.URL) {
        img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
        img.style.maxHeight = "100px";
        img.style.maxWidth = "100px";
        img.style.margin = "0px auto";
        img.style.display = "blcok"
        img.onload = function (e) {
            window.URL.revokeObjectURL(this.src); //图片加载后，释放object URL
        }
        if (fileList.lastElementChild) {
            fileList.removeChild(fileList.lastElementChild);
        }
        fileList.appendChild(img);
    } else if (window.FileReader) {
        //opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
        var reader = new FileReader();
        reader.readAsDataURL(files[0]);
        reader.onload = function (e) {
            img.src = this.result;
            img.style.maxHeight = "100px";
            img.style.maxWidth = "100px";
            img.style.margin = "0px auto";
            img.style.display = "blcok"
            fileList.appendChild(img);
        }
    } else {
        //ie
        obj.select();
        obj.blur();
        var nfile = document.selection.createRange().text;
        document.selection.empty();
        img.src = nfile;
        img.style.maxHeight = "100px";
        img.style.maxWidth = "100px";
        img.style.margin = "0px auto";
        img.style.display = "blcok"
        img.onload = function () {

        }
        fileList.appendChild(img);
    }

    $(".up_file input img ").css({"max-height": "100px", "max-width": "100px"})
}

// ajax 获取数据
function resdata(url, successCall) {
    $.ajax({
        type: "get",
        url: url,
        dataType: "json",
        error: function (data) {
            // mui.alert("请求失败", '温馨提示', function () {
            //     location.href = "index.html";
            // });
            mui.toast(data.msg, {duration: 'long', type: 'div'})
        },
        success: successCall,
    });
}