(function () {
    document.body.addEventListener('touchstart', function () {
    });
    var page = 1, tag;
    var urlSearch = document.location.search;
    console.log(urlSearch);
    var gId = urlSearch.charAt(urlSearch.length - 1);
    // $(".footNav").html(footerNav.str)
    var tx = window.location.search;
    // tx = tx.split("=");
    tx = tx.slice(-1);
    var token = localStorage.getItem("token");
    var user_id = localStorage.getItem("user_id");
    var unique_id = localStorage.getItem("unique_id");
    console.log(token);
    if (token) {
        $(".message").on("click", function () {
            location.href = "mobile.html";
            console.log(123);
        })
    }else{
    	console.log('请登录');
    }

    $.ajax({
        type: 'get',
        url: URL.SiteUrl + '/index.php?m=Api&c=Goods&a=goodsLists&',
        data: {id: tx},
        dataType: 'json',
        success: function (data) {
            // console.log(gId);
            $(".mui-title").text(data.result.name);

//      	渲染商品分类数据
            var html = template('temp_nav', data.result);
            console.log(data.result.navlist);
            if (data.result.navlist == null) {
                $('.nav').hide()
            } else {
                $('.nav').html(html);
            }
            catgort_event();


            var $liss = $('.scoll').find('.lis1');
            var realScollWidth = ($liss.width() + $liss.offset().left) * $liss.length;
            $('.scoll').width(realScollWidth + 20);


//           渲染每日抢鲜数据
//          var html = template('tmp_snapUp', data.result.promote);
//          console.log(data.result.promote);
//          if (data.result.promote == null) {
//              $('#snapUpItems').hide()
//              $('#snapUp').hide()
//          } else {
//              $('#snapUpItems').html(html);
//          }

//           渲染今日特价数据
//          var html = template('tmp_dicount', data.result.dicount);
//          if (data.result.dicount == null) {
//              $('#dicount').hide();
//          } else {
//              $('#dicountItems').html(html);
//          }

//			精选商品数据渲染
            var html = template('temp2', data.result.recommend);
            if (data.result.recommend == null) {
                $('#choiceItems').hide()
                $('#choice').hide()
            } else {
                $('#choiceItems').html(html);
            }

            // 热销商品数据
            var html = template('temp3', data.result);
            $('#hotItems').html(html);
          	
            function load(){
				console.log($('img').length);
				//使用了data-original就不要写src了，要不然没有效果    
				//在没有完全获取到图片的资源前，是得不到图片的宽高的，所以预先设置宽高，让它提前有个占位    
					$('img').lazyload({   
					            threshold: 50,//滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉    
					            effect: 'fadeIn',//show fadeIn slideDown    
					            //placeholder: '',//设置加载中的占位图片路径，如image.load.gif，个人建议不设置，可以通过css设置背景图片加提前设置src=reload.gif的方式，来达到图片正在加载中的效果    
					        });
					}
                load();
				  			
            // 加入购物车
            addListener();

//            顶部跳转部分 start
            var timer = null;

            $('#back_top').on('click', function () {
                var top = scrolls()
                scrollTo(0, top.top)
            });
//        	顶部跳转部分 end
        },
        error: function (data) {
            mui.toast(data.msg, {duration: 'long', type: 'div'})
        }
    });

    /**
     * 初始化刷新
     */
    function init_refresh() {
        tag = refresh({
            content: "#hotItems",
            down: ".pre_lodding",
            up: ".up_lodding",
            null: ".null"
        }, {
            upCallback: function (e) {
                var that = this;
                setTimeout(function () {
                    that.back.call();
                    that.hideUp();
                }, 100);
            },
            downCallback: function (e) {

                var that = this;
                setTimeout(function () {
                    that.back.call();
                    page++;
                    $.ajax({
                        type: "post",
                        url: URL.SiteUrl + "/index.php?m=Api&c=Goods&a=goodsLists&id=" + gId + "&p=" + page + "",
                        data: {id: gId},
                        dataType: 'json',
                        success: function (data) {
                            that.hideDown();
                            var html = template('temp3', data.result);
                            that.currentElement.append(html);
				          	if(html){
				                function load(){
									    	console.log($('img').length);
									        //使用了data-original就不要写src了，要不然没有效果    
									        //在没有完全获取到图片的资源前，是得不到图片的宽高的，所以预先设置宽高，让它提前有个占位    
									        $('img').lazyload({    
									            threshold: 50,//滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉    
									            effect: 'fadeIn',//show fadeIn slideDown    
									            //placeholder: '',//设置加载中的占位图片路径，如image.load.gif，个人建议不设置，可以通过css设置背景图片加提前设置src=reload.gif的方式，来达到图片正在加载中的效果    
									        });
									}
				                load();
								}                            
                            var $goods_list = data.result.goods_list;
                            console.log($goods_list);
                            addListener();

                            if (!$goods_list || !$goods_list.length) {
                                that.showNull();
                            }

                        },
                        error: function (data) {
                            mui.toast(data.msg, {duration: 'long', type: 'div'})
                        },
                    });
                }, 100);
            }
        });
    }

  			init_refresh();


    function catgort_event() {
        //分类数据请求
        $(".lis1").click(function () {

            console.log('..');
            gId = $(this).attr('data-id');
            tag.hideNull();
            $.ajax({
                type: 'post',
                url: URL.SiteUrl + "/index.php?m=Api&c=Goods&a=goodsLists&id=" + gId + "&p=1",
                data: {id: gId},
                dataType: 'json',
                success: function (data) {
					
                    if (location.href.indexOf('#') != -1) {
                        $("#choice").hide();
                    }

                    if (data.result.goods_list == null) {
                        $(".no_items").css("display", "block");
                    } else {
                        $(".no_items").css("display", "none");
                    }
                    // 			热销商品数据
                    var html = template('temp3', data.result);
                    $('#hotItems').html(html);

		          	if(html){
		                function load(){
							    	console.log($('img').length);
							        //使用了data-original就不要写src了，要不然没有效果    
							        //在没有完全获取到图片的资源前，是得不到图片的宽高的，所以预先设置宽高，让它提前有个占位    
							        $('img').lazyload({    
							            threshold: 50,//滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉    
							            effect: 'fadeIn',//show fadeIn slideDown    
							            //placeholder: '',//设置加载中的占位图片路径，如image.load.gif，个人建议不设置，可以通过css设置背景图片加提前设置src=reload.gif的方式，来达到图片正在加载中的效果    
							        });
							}
		                load();
						}
          	
                    init_refresh();


                    // 加入购物车
                    $(".shopping_car_wrap").on("click", function () {
                        var goods_id = $(this).attr('data-id');
                        var gooods_num = 1;
                        $.ajax({
                            type: 'post',
                            url: URL.ApiUrl + URL.addCart,
                            data: {
                                user_id: user_id,
                                unique_id: unique_id,
                                token: token,
                                goods_id: goods_id,
                                goods_num: gooods_num
                            },
                            dataType: 'json',
                            success: function (data) {
                                if (data.status == 1) {
                                    $(".car_count").text(data.result)
                                }
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            },
                            error: function (data) {
                                mui.toast(data.msg, {duration: 'long', type: 'div'});
                            }
                        });
                    });
                }
            })
        });
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

    function scrolls() {
        return {
            top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
            left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
        }
    }

    //加入购物车事件
    function addListener() {
        $(".shopping_car").on("click", function () {
            var goods_id = $(this).attr('data-id');
            var gooods_num = 1;
            $.ajax({
                type: 'post',
                url: URL.ApiUrl + URL.addCart,
                data: {
                    user_id: user_id,
                    unique_id: unique_id,
                    token: token,
                    goods_id: goods_id,
                    goods_num: gooods_num
                },
                dataType: 'json',
                success: function (data) {
                    mui.toast(data.msg, {duration: 'long', type: 'div'});
//                  if (data.status == 1) {
//                      $(".car_count").text(data.result);
//                      $(".car_count").show();
//                  }
                },
                error: function (data) {
                    mui.toast(data.msg, {duration: 'long', type: 'div'})
                },
            });
        });
    }

//  $.ajax({
//      type: 'post',//用post方法获取
//      //获取首页数据
//      url: URL.SiteUrl + '/index.php?m=Api&c=Index&a=get_laster_cartnum',
//      //指定传入的数据格式为json
//      dataType: 'json',
//      data: {unique_id: unique_id, user_id: user_id},
//
//      //成功后执行函数,获得一个返回数据对象data
//      success: function (data) {
//          if (data.status == 1) {
//              if (data.result !== 0) {
//                  $(".car_count").text(data.result)
//                  $(".car_count").show();
//              }
//          }
//          console.log(data);
//      }
//  });

    //搜索跳转
//  $(".mui-input-clear").focus(function () {
//      location.href = "search.html"
//  })
    // 底部导航
    /*$('.vf_nav ul li a').each(function (i) {
     $(this).css({
     "background": "url(images/index/" + [i] + "-0.png)no-repeat center top",
     "background-size": "55%"
     });
     $('.vf_nav ul li a:first').css({
     "background": "url(images/index/0.png)no-repeat center top",
     "background-size": "55%",
     "color": "#f29600"
     });
     })*/


    $('#back_top').hide();
    window.onscroll = function () {
        var sTop = $("body").scrollTop();
        if (sTop >= 800) {
            $('#back_top').show();
        } else {
            $('#back_top').hide();
        }
    }

})();