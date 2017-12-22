/**
 * Created by lenovo on 2017/3/24.
 */
var _tag = getUrlParam("tag"),$allPrice = $('#allPrice');


//清楚全选状态
function qx_qingchu(){
 	var m = 0;
    var k = $(".shop-xz span").length;

    $(".shop-xz span").each(function () {
        if ($(this).hasClass("ch")) {
            m++;
    }
    });
    if (m == k) {
        $(".shop-qx span").addClass("ch");
        $(".shop-xz").attr("select", "1");
    } else {
        $(".shop-qx span").removeClass("ch");
    }
}

function cart_count(jb) {
    $(".car_count").text(jb);
        $(".car_count").show();
        if (jb == 0) {
        $(".car_count").hide();
    }
}

//购物车商品数量
function _goodsCount(){
	var znum = 0;
	$(".num").each(function () {
		var fnum = $(this).val() * 1;
		znum = znum + fnum;
	})
	console.log(znum);
	cart_count(znum);
}
//已选中商品数量
function changeGoodsCount(count) {
    $('.shop-botton').text("去结算(" + count + ")");
}

function change_cart_goods(user_id, unique_id, token, streetNum,cart_form_data, type) {
    $.ajax({
        type: 'post',
        url: URL.SiteUrl + 'index.php?m=Api&c=Cart&a=cartList',
        data: {
            user_id: user_id,
            unique_id: unique_id,
            token: token,
            streetNum:streetNum,
            cart_form_data: JSON.stringify(cart_form_data)
        },
        dataType: 'json',
        success: function (data) {
            console.log(data.result.total_price.num);
        	console.log(data.result.total_price.total_fee);
        	//选中商品总价
            $allPrice.text("￥" + data.result.total_price.total_fee.toFixed(2));// 四舍五入为指定小数位数的数字
            //选中商品数量
            changeGoodsCount(data.result.total_price.num);
            
            if (type == "tijiao"){
                if (token) {
                    if (_tag) {
                        location.href = "order.html?tag=" + _tag + "";
                    } else {
                        location.href = 'order.html';
                    }
                } else {
                    location.href = 'login.html';
                }
            }else {

            }

            // console.log(data);

        }
    })
    return;
}


(function () {
    function windowDes() {
        return {
            width: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
            height: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
        }
    }

    $(".fail").height(windowDes().height - 150);
    var unique_id = localStorage.getItem("unique_id");
    console.log(unique_id);
    
    var user_id = localStorage.getItem("user_id");
    console.log(user_id);
    
    var token = localStorage.getItem("token");
    console.log(token);
    
    var city = localStorage.getItem("city");
    city=JSON.parse(city);
    console.log(city);
    var streetNum = city.streetNum;//地区编号
    
    if(!streetNum){
        mui.toast("请选择配送范围")
        $(".returnBack").show();
        $(".returnBack").click(function () {
            window.location.href = "index.html";
        })
        return;
    }
    
    $(function () {
        $(".footNav").html(footerNav.str)
        if(!token){
            $("#lodding").css("display", "none");
            $(".fail").css("display", "block");
            mui.toast("请登录");
            location.href="login.html";
        }
        $.ajax({
            type: "post",
            url: URL.SiteUrl + "/index.php?m=Api&c=Cart&a=cartList",
            dataType: "json",
            data: {unique_id: unique_id, user_id: user_id, token: token,streetNum:streetNum},
            success: function (data) {
                $("#lodding").hide();
                if (data.msg) {
                    mui.toast(data.msg, {duration: 'short', type: 'div'})
                }
                //总价计算
                
                // console.log(data.result.total_price.total_fee);//选中商品价格
                $allPrice.text("￥" + data.result.total_price.total_fee.toFixed(2));// 四舍五入为指定小数位数的数字
                
                changeGoodsCount(data.result.total_price.num);//选中商品数量
                
                if(data.result!=''){

                    if (data.result.cartList.length > 0) {
                        $(".shopping-bottom").css("display", "block");
                    } else {
                        $(".fail_text").on("click", function () {
                            window.location.href = "index.html";
                        });
                    }

                }else{
                    $("#lodding").css("display", "none");
                    $(".fail").css("display", "block");
                    return;
                }

                // 购物车有无商品
                if (data.result.cartList.length > 0) {
                    $(".fail").css("display", "none");
                    $(".shop-qx").click();
                    $("#edit").css("display", "block");
                } else {
                    $("#lodding").css("display", "none");
                    $(".fail").css("display", "block");
                }

                // 渲染数据
                var html = template('item_form', data.result);
                $("#lodding").hide();
                
                if (data.result.cartList.length > 0) {
                    $('#itemForm').html(html);
                }
//购物车所有数量
                _goodsCount();//购物车总商品数量

                (function (m) {
                    $('#itemForm').on('tap', '.remove_cart', function (event) {
                        var elem = this;
                        var _this = $(elem);
                        var li = elem.parentNode.parentNode;
                        mui.confirm('您确认从购物车移除吗？', '温馨提示', ['取消', '确认'], function (e) {                   
                            if (e.index == 1) {
									$.ajax({
				                        type: "post",
				                        url: 'http://192.168.0.116/index.php/Api/Cart/delCart',
				                        data:{
											user_id: user_id,
			            					unique_id: unique_id,
			            					token: token,
			            					ids:_this.attr("data-id")
											},
										dataType: "json",
				                        success: function (data) {
				                        	console.log(data.msg);
				                            if (data.status == 1) {
				                            	li.parentNode.removeChild(li);
				                            	accounts();
				                            	_goodsCount();
				                                mui.toast(data.msg, {duration: 'long', type: 'div'})
				                            } else {
				                                mui.toast(data.msg);
				                            }
				                        }
				                    })
//                              remove_goods({
//                                  ids: _this.attr('data-id'),
//                                  unique_id: unique_id,
//                                  user_id: user_id,
//                                  token: token
//                              }, li);

                            } else {
                                setTimeout(function () {
                                    m.swipeoutClose(li);
                                }, 0);
                            }
                        });
                    });
                })(mui);


                $(".shopping-close").on("click", function () {
                    $(".shopping-title").toggle();
                })

                /**
                 * 移除购物车
                 * @param data
                 * @param li
                 */

//              function remove_goods(data, li) {
//                  var url = ( URL.ApiUrl + '' + URL.remove_cart_goods).format(data.ids, data.unique_id, data.user_id, data.token); //url动态替换
//                  $.get(url, {}, function (res) {
//                      if (res && res.status == 1) {
//
//                          mui.toast("删除成功");
//                          accounts();
//                          history.go(0);
//                      } else {
//                          mui.toast('删除失败');
//                      }
//                  }, 'json');
//              }

				qx_qingchu();
                // 单选
                $(".shop-xz").each(function () {        
                  $(this).on("click", function () {
 					if ($(this).children('span').hasClass("ch")){
 						$(".shop-qx span").removeClass("ch");
                        $(this).children('span').removeClass("ch");         
                        $(this).attr("select", "0");
						accounts();
 					}else{
                        $(this).children('span').addClass("ch");
                        $(this).attr("select", "1");
                        accounts();
 					}
 					qx_qingchu();
				});
                });

                //全选
                $(".shop-qx").click(function () {
                    if ($(".shop-qx span").hasClass("ch")) {
                        $(".shop-xz span").removeClass("ch");
                        $(".shop-qx span").removeClass("ch");
                        $(".shop-xz").attr("select", "0");
						accounts();
                    }
                    else {                                             
                        $(".shop-xz span").addClass("ch");
                        $(".shop-qx span").addClass("ch");
                        $(".shop-xz").attr("select", "1");
                        accounts();
                    }

                });
                var plus_money = 0;
                // 商品增减
                $(".minus").on("tap",function () {


                    plus_money = ($(this).parent().prev().text()).split("￥")[1] * 1;
                    if ($(this).siblings(".num").val() == 1) {
                        var cartID = $(this).parent().attr("carid");
                    } else {                        
                        			
                        var num1=$(this).siblings(".num").val(parseInt($(this).siblings(".num").val()) - 1);                        
						accounts();
						_goodsCount();					
                    }


                });
                // 点击增加按钮
                $(".plus").on("tap",function () {
                    _this = $(this);
					
                    val = parseInt($(this).prev().val());
                    if ((val + 1) > parseInt(_this.attr('data-store'))) {
                        mui.toast('当前库存不足!', {duration: 'long', type: 'div'})
                        return;
                    } else if ((val + 1) > parseInt(_this.attr('data-num')) && _this.attr('data-num') != 0) {
                        mui.toast('活动商品,超出购买数量!', {duration: 'long', type: 'div'})
                        return;
                    }
                    if ($(this).siblings(".num").val() == 20) {
                        mui.toast('一次下单不能超过20件', {duration: 'long', type: 'div'})
                    } else {          

                        $(this).prev().val(parseInt($(this).prev().val()) + 1);                        
                        accounts();
                        _goodsCount();                      
                    }
                });

                //点击结算购物车
                function accounts(type) {
                    var cart_form_data = [], sel_count = 0,can_send=0;

                    $("#list li").each(function () {
                        var cartID = $(this).find('.numbox').attr("carid");//商品ID
                        var selected = $(this).find('.shop-xz').attr("select");//是否被选中
                        var goodsNum = $(this).find('.num').val();//商品数量
                        if (selected == "1") {
                            sel_count++;
                            if ($(this).find('.peisong').attr("data-send")==-1){
                                can_send++;
                            }
                        }
                        var carArr = {
                            "cartID": cartID,
                            "goodsNum": goodsNum,
                            "selected": selected
                        };
                       	console.log(carArr);
                        cart_form_data.push(carArr)
                    });
                    console.log(sel_count);
                    if (type == "tijiao") {
                        if (sel_count > 0) {
                            if (can_send>0){
                                mui.toast("您选中的商品,该地区无货");
                                return;
                            }
                            change_cart_goods(user_id, unique_id, token, streetNum,cart_form_data,"tijiao");

                        } else {
                            mui.toast("请选择商品结算", {duration: 'long', type: 'div'})
                        }
                    } else {
                        change_cart_goods(user_id, unique_id, token,streetNum,cart_form_data);
                    }

                }

                //点击结算购物车
                $(".shop-botton").click(function () {
                    accounts("tijiao");
                    // return;
                })

                //离开购物车结算
//              $(".returnBack").click(function () {
//                  accounts();
//                  window.location.href = "index.html";
//              })

                $(".vf_nav li").on("click", function () {
                    accounts();
                })
                $(".kefu_click").on("click", function () {
                    accounts();
                })

                //点击移除购物车
                $(".shop-delete").click(function () {
                    var carIds = [];
                    var _li=[];
                    $("#list li .shop-xz").each(function () {
                        if ($(this).attr("select") == 1) {
                            carIds.push($(this).siblings(".mui-clearfix").children(".numbox").attr("carid"));
                            _li.push(this.parentNode.parentNode);             
                        }
                    });
                    console.log(_li);	
                    var ids = carIds.join(',');
                    console.log(ids);
                    $.ajax({
                        type: 'post',
                        url:'http://192.168.0.116/index.php/Api/Cart/delCart',
                        data:{
							user_id: user_id,
			            	unique_id: unique_id,
			            	token: token,
			            	ids:ids
							},
                        dataType: "json",
                        success: function (data) {
                            if (data.status == 1) {                            	
	                            $.each(_li, function(index,obj) {
	                        		obj.parentNode.removeChild(obj);
	                        	});
	                        	accounts();
	                        	if (data.result <= 0)
	                        	{
				                    $("#lodding").css("display", "none");
				                    $(".fail").css("display", "block");
				                    $(".shopping-bottom").css("display", "none");
				                    $("#list").css("display","none");
				                }
	                        	_goodsCount();
                               	mui.toast(data.msg, {duration: 'long', type: 'div'})
                            } else {
                                mui.toast(data.msg);
                            }
                        },error:function(data){
                        	console.log(data.msg);
                        }
                    });
                })


                //点添加到收藏夹
                $(".shop-collect").click(function () {
                    //console.log(123);
                    var goodsId = [];
                    $("#list li .shop-xz").each(function () {
                        if ($(this).attr("select") == 1) {
                            goodsId.push($(this).siblings(".mui-clearfix").children(".numbox").attr("gid"))
                        }
                    });
                    // console.log(goodsId);
                    var goods_id = goodsId.join();
                    var type = 0;
                    user_id = localStorage.getItem("user_id");
                    token = localStorage.getItem("token");
                    $.ajax({
                        type: "post",
                        url: URL.ApiUrl + '' + URL.collectGoods,
                        dataType: "json",
                        data: {goods_id: goods_id, type: type, user_id: user_id, token: token},
                        success: function (data) {
                            // console.log(data);
                            mui.toast(data.msg, {duration: 'long', type: 'div'})

                        }
                    })
                })


                //价格计算
//              function allPrice() {
//                  var allPrice = 0;
//                  $.each($("#list li"), function () {
//                      if ($("#list li .shop-xz").hasClass("ch")) {
//
//                      }
//                  })
//              }


            },
            beforeSend: function () {
                $("#lodding").show();
            },
            error: function (data) {
                $("#lodding").hide();
                mui.toast(data.msg, {duration: 'short', type: 'div'})
            }
        });
        // $('#all_select').hide();
        $(".edit").click(function () {
            if ($(".edit").text() == "编辑") {
                $(".edit").text("完成");
                $(".shop-botton").hide();
                $(".shop-delete").show();
                $(".shop-collect").show();
                // $(".shop-xz").show();
                $(".shopping-bottom span").hide();
                // $('#all_select').show();
            } else {
                $(".edit").text("编辑");
                $(".shop-botton").show();
                $(".shop-delete").hide();
                $(".shop-collect").hide();
                // $(".shop-xz").hide();
                // $('#all_select').hide();
                $(".shopping-bottom span").show();

            }
        })
    })

})();