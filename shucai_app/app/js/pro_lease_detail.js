var luoApp = {
    shopData: {},//商品数据
    shopAttr: {},//商品属性
    shopPrice: '',//商品价格
    shopNum: '',//商品库存
    /* 获取数据 */
    token: localStorage.getItem("token"),
    user_id: localStorage.getItem("user_id"),
    unique_id: localStorage.getItem("unique_id"),
    getlunboData: function (dom, callback) {
        var tx = window.location.search;
        var tx2 = tx.split("?")[1];
        console.log(tx2);


        $('.shop_car').on('click', function () {
            window.location.href = "shopping_cart.html?tag=" + tx2;
        })
        var tx = function () {
            var tx = window.location.search;
            var tx1 = tx.split("?")[1];

            return tx1
        };
        tx();
        console.log(tx());
        this.invoke(tx, dom);

    },
    //租借商品详情
    rentout:function () {
        var rent = window.location.hash;
        var renttype = rent.split("=")[1];

        // var gid=tx2

        if (renttype=="rentout"){
            $(".mui-bar").show();
            $(".returnBack").hide();
            $(".more").hide();
            $(".navTmp").hide();
        }

    },

    invoke: function (tx, dom) {
        var t = this;
        luoApp.rentout();
        $.ajax({
            type: "get",
            url: URL.SiteUrl + "/index.php?m=Api&c=Goods&a=goodsInfo",
            dataType: "json",
            data: {id: tx, token: this.token, user_id: this.user_id, unique_id: this.unique_id},
            beforeSend: function () {
                //console.log(123);
                $(".mui-slider").addClass("bj")
                //console.log(456);
            },
            success: function (data) {
                console.log(data);
                $(".mui-slider").removeClass("bj");
                if (data.result.comment.length > 0) {
                    function getLocalTime(nS) {
                        return new Date(parseInt(nS) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
                    }

                    data.result.comment[0].add_time = getLocalTime(data.result.comment[0].add_time);
                    var html = template("evaluate_des_id", data.result.comment[0]);
                    $('.pro_all').append(html);
                }
                //console.log(data);
                if (data.result.goods.is_collect == 1) {
                    $(".collect").find(".star").addClass("star_ye");
                    $(".collect").find(".collect_text").css("color", "#f29600");
                } else {
                    $(".collect").find(".star").removeClass("star_ye");
                    $(".collect").find(".collect_text").css("color", "");
                }
                if (data.result.goods.cart_count != 0) {
                    $(".car_count").text(data.result.goods.cart_count);

                } else {
                    $(".car_count").hide();
                }

                luoApp.shopData = data;
                var html = template("template", data.result);
                var inBox = document.querySelector(".idex");
                var indicator = data.result.gallery.length;
                console.log(indicator);
                //动态圆点
                for (i = 0; i < indicator; i++) {
                    var objdiv = document.createElement("div");
                    // objdiv .innerHTML = i+1;
                    // if (i=1){
                    //     objdiv.className ="mui-indicator mui-active";

                    // }else {
                    objdiv.className = "mui-indicator";
                    // }

                    inBox.appendChild(objdiv);
                }
                $(".idex div:nth-child(1)").addClass("mui-active");

                $("#product_name").html(data.result.goods.goods_name);
                $("<span class='share'></span>").appendTo("#product_name")

                $(".share").on("click", function () {
                    shareHref();
                })
                dom.html(html);
                /* 轮播  */
                var gallery = mui('.mui-slider');
                gallery.slider({
                    interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
                });

                /* 价格 */
                sprice = data.result.goods.shop_price.split(".");
                $("#price1").html(sprice[0]);
                $("#price2").html(sprice[1]);
             

                /* 规格 */
                if (data.result.goods.goods_spec_list.length > 0) {
                    var guige = template("temp_guige", data.result.goods);
                    //console.log(guige);
                    $("#guige").html(guige);
                } else {
                    $('#guige').parents('ul').css({"display": "none"});
                }

                //console.log($(".guideAttr"))
                $(".guideAttr").each(function () {
                    // console.log($(this).find("span").eq(0).html())
                    $(this).find("span").eq(0).addClass("pro-standard-active");
                });

                /* 食物相克 */
                if (data.result.goods.goods_taboo == "") {
                    $(".pro-foods").hide();
                } else {
                    $("#xiangke").html(data.result.goods.goods_taboo);
                }

                $(".pro-evaluate a").html("顾客评价(" + data.result.goods.comment_count + ")");
              
//              console.log(service);
                $("#goods_service").html(service);
                $(".pro-evaluate a").attr("href", "customer.html?goods_id=" + data.result.goods.goods_id);
                /* 商品详情图 */
                var detail = data.result.goods.goods_content, detailHtml = '';
                for (var i = 0; i < detail.length; i++) {
                    detailHtml += "<img src='" + detail[i].href + "'/>";
                }
                $("#pro_detail").html(detailHtml);
                /* 商品属性 */
                var shopattr = data.result.goods.goods_spec_list;
                // console.log(shopattr)
                luoApp.shopAttrTo(shopattr, data);

                // 商品增减
                $(".minus").click(function () {
                    if ($(this).siblings(".num").val() == 1) {
                        var cartID = $(this).parent().attr("carid");
                    } else {
                        $(this).siblings(".num").val(parseInt($(this).siblings(".num").val()) - 1);
                    }
                });
                // 点击增加按钮
                $(".plus").click(function () {
                    _this = $(this);
                    val = parseInt($(this).prev().val());
                    if ((val + 1) > parseInt(_this.attr('data-store'))) {
                        mui.toast("当前库存不足!", {duration: 'long', type: 'div'});
                        return;
                    }
                    if ($(this).siblings(".num").val() == 20) {
                        mui.toast('一次下单不能超过20件', {duration: 'long', type: 'div'})
                    } else {
                        $(this).prev().val(parseInt($(this).prev().val()) + 1);
                    }
                });

                var nav = $(".back_top"); //得到导航对象
                var win = $(window); //得到窗口对象
                var sc = $(document); //得到document文档对象。
                win.scroll(function () {
                    if (sc.scrollTop() >= 300) {
                        // nav.addClass("fixednav");
                        $(".back_top").fadeIn();
                    } else {
                        // nav.removeClass("fixednav");
                        $(".back_top").fadeOut();
                    }
                })

                var timer = null;

                function scrolls() {
                    return {
                        top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
                        left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
                    }
                }

                function scrollTo(target, leader) {
                    timer = setInterval(function () {
                        var step = (target - leader) / 10;
                        step = step > 0 ? Math.ceil(step) : Math.floor(step);
                        leader = leader + step;
                        window.scrollTo(0, leader);
                        if (leader === target) {
                            clearInterval(timer);
                        }
                    }, 20)
                }

                $('.back_top').on('click', function () {
                    var top = scrolls();
                    scrollTo(0, top.top);
                });

                // 添加到购物车

                var that = t;
                $(".pro-detail-buy").on("click", function () {
                    //console.log(that.user_id);
                    var goods_id = tx;
                    // console.log(tx);
                    var gooods_num = $(".num").val();
                    // console.log(goods_id)
                    $.ajax({
                        type: 'post',
                        url: URL.SiteUrl + '/index.php?m=Api&c=Cart&a=addCart',
                        data: {
                            user_id: that.user_id,
                            unique_id: that.unique_id,
                            token: that.token,
                            goods_id: goods_id,
                            goods_num: gooods_num
                        },
                        dataType: 'json',
                        success: function (data) {
                            //console.log(data);
                            if (data.status == 1) {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                                location.href = "shopping_cart.html"
                            } else if (data.status == -101) {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            } else {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            }

                        },
                        error: function (data) {
                            mui.toast(data.msg, {duration: 'long', type: 'div'});
                        },
                    })
                })
                $(".pro-detail-cart").on("click", function () {
                    var goods_id = tx;
                    var gooods_num = $(".num").val();
                    //console.log(gooods_num);
                    $.ajax({
                        type: 'post',
                        url: URL.SiteUrl + '/index.php?m=Api&c=Cart&a=addCart',
                        data: {
                            user_id: that.user_id,
                            unique_id: that.unique_id,
                            token: that.token,
                            goods_id: goods_id,
                            goods_num: gooods_num
                        },
                        dataType: 'json',
                        success: function (data) {

                            //console.log("ok");
                            if (data.status == 1) {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                                $(".car_count").css("display", "block").text(data.result);
                            } else if (data.status == -101) {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});

                            } else {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            }
                        }, error: function (data) {
                            mui.toast(data.msg, {duration: 'long', type: 'div'});
                        }
                    })
                })

                $('#lunbo').on('click', function () {
                    location.href = "show_image.html?good_id=" + data.result.goods.goods_id;
                });
                
                //点击租借商品
                $("#rentout").on("click", function () {
                    var rent = window.location.hash;
                    var rentid =rent.split("&")[1];
                    var rentprcie =rent.split("&")[2];
                    // console.log(goods_id)
                    $.ajax({
                        type: 'post',
                        url: URL.ApiUrl + URL.rentouCanLease,
                        data: {
                            user_id: that.user_id,
                            unique_id: that.unique_id,
                            token: that.token,
                            // goods_id: goods_id,
                            // goods_num: gooods_num
                        },
                        dataType: 'json',
                        success: function (data) {
                            console.log(data);
                            if (data.status==1){
                                location.href="rentoutOrder.html?rentoutOrder="+rentid+"&price="+rentprcie+"";
                            }else {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            }

                            // alert(data.msg)
                        }
                    })
                })
                //点添加到收藏夹
                $(".collect").click(function () {
                    var goods_id = tx;
                    var type = 0;
                    user_id = localStorage.getItem("user_id");
                    token = localStorage.getItem("token");
                    var that = this;
                    if ($(that).find(".star").hasClass("star_ye")) {
                        $.ajax({
                            type: "post",
                            url: URL.ApiUrl + '' + URL.collectGoods,
                            dataType: "json",
                            data: {goods_id: goods_id, type: 1, user_id: user_id, token: token},
                            success: function (data) {
                                if (data.status == -102 || data.status == -100) {
                                    mui.toast('请登录', {duration: 'long', type: 'div'})
                                    // location.href = "login.html"
                                    // console.log(data);
                                } else if (data.status == 1) {
                                    $(that).find(".star").removeClass("star_ye");
                                    $(that).find(".collect_text").css("color", "");
                                    mui.toast('取消收藏', {duration: 'long', type: 'div'})
                                }

                                // mui.alert(data.msg, '温馨提示', function () {
                                //     // history.go(0);
                                //     // console.log(data);
                                // });
                            }
                        });
                    } else {
                        $.ajax({
                            type: "post",
                            url: URL.ApiUrl + '' + URL.collectGoods,
                            dataType: "json",
                            data: {goods_id: goods_id, type: type, user_id: user_id, token: token},
                            success: function (data) {
                                if (data.status == -102 || data.status == -100) {
                                    mui.toast('请登录', {duration: 'long', type: 'div'})
                                    // location.href = "login.html"
                                    // console.log(data);
                                } else if (data.status == 1) {
                                    $(that).find(".star").addClass("star_ye");
                                    $(that).find(".collect_text").css("color", "#f29600");
                                    mui.toast('收藏成功', {duration: 'long', type: 'div'})
                                }

                                // mui.alert(data.msg, '温馨提示', function () {
                                //     // history.go(0);
                                //     // console.log(data);
                                // });
                            }, error: function (data) {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            }
                        });
                    }

                })

            },
            error: function (data) {
                mui.toast(data.msg, {duration: 'long', type: 'div'});
            }
        });
    },
    /* 商品属性 */
    shopAttrTo: function (obj, datas) {
        var data = {};
        for (var key in obj) {
            if (data.hasOwnProperty(obj[key].spec_name)) {
                //对象存在改属性
                data[obj[key].spec_name][obj[key].item_id] = obj[key];
            }
            else {
                //不存在改属性
                data[obj[key].spec_name] = {};
                data[obj[key].spec_name][obj[key].item_id] = obj[key];
            }
        }
        var html = '', j = 0;
        for (var key in data) {
            html += "<div class='guideAttr'>";
            html += "<p>" + key + "</p>";
            for (var i in data[key]) {
                html += "<span  data-itemid='" + data[key][i].item_id + "'>" + data[key][i].item + "</span>";
            }
            html += "</div>";
            j++;
        }
        // console.log(data);
        $("#guige").html(html);
        luoApp.shopAttr = data;
        luoApp.shopClick(datas);
    }
    ,
    /*商品属性点击事件*/
    shopClick: function (data) {
        //console.log(data);
        if (data.result.spec_goods_price) {
            $.each(data.result.spec_goods_price, function (index, obj) {
                if (data.result.goods.goods_id == obj.relation_id) {
                    var tar = index;
                    var strList = tar.split("_");
                    var list = data.result.goods.goods_spec_list;
                    // console.log(list.length);
                    for (var i = 0; i < list.length; i++) {
                        if (strList.indexOf(list[i].item_id) != -1) {
                            for (var j = 0; j < $(".guideAttr").length; j++) {
                                $(".guideAttr").eq(j).find("span").each(function (ii, o) {
                                    if (list[i].item_id == $(o).attr("data-itemid")) {
                                        $(o).addClass("pro-standard-active");
                                    }
                                })
                            }
                        }
                    }
                }
            });
        }


        /*事件*/
        // $(".guideAttr").each(function () {
        //     // console.log($(this).find("span").eq(0).html())
        //     $(this).find("span").eq(0).addClass("pro-standard-active");
        // });
        $(".guideAttr span").click(function () {
            //console.log("------------" + $(this).parent().find("span").length);
            if ($(this).parent().find("span").length > 1) {
                $(this).attr("class", "pro-standard-active").siblings().removeClass("pro-standard-active");
            }

            var keyId = '';//key值拼接
            var leng = $(".guideAttr").length, keyArr = [];
            for (var i = 0; i < leng; i++) {
                var itemid = $(".guideAttr").eq(i).find(".pro-standard-active").data("itemid");
                keyArr.push(itemid);
            }
            var goodsKey = luoApp.bubbleSort(keyArr).join("_");
            luoApp.shopPrice = luoApp.shopData.result.spec_goods_price[goodsKey].price;
            var _id = luoApp.shopData.result.spec_goods_price[goodsKey].relation_id;
            //console.log(_id);
            // window.location.href =
            luoApp.invoke(_id, $("#lunbo"));
            // sprice = luoApp.shopPrice.split(".");
            // $("#price1").html(sprice[0]);
            // $("#price2").html(sprice[1]);
        });

    }
    ,
    bubbleSort: function (array) {
        /*start根据已排列好的项数决定*/
        var start = 1;
        /*按顺序，每一项检查已排列好的序列*/
        for (var i = start; i < array.length; start++, i++) {
            /*跟已排好序的序列做对比，并插入到合适的位置*/
            for (var j = 0; j < start; j++) {
                /*小于或者等于时（我们是升序）插入到该项前面*/
                if (array[i] <= array[j]) {
                    // console.log(array[i] + ' ' + array[j]);
                    array.splice(j, 0, array[i]);
                    /*删除原有项*/
                    array.splice(i + 1, 1);
                    break;
                }
            }
            return array;

        }
    }
}


luoApp.getlunboData($("#lunbo")); 