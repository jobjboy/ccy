(function () {
	
	
    var token = localStorage.getItem("token");


    var cache = JSON.parse(window.localStorage.getItem("result"));
    
    if (cache) {
    	//轮播图
        var html = template('items_slider', cache);
        $('#slider').html(html);
		
		//分类
        var lists = {};
        var oldlist = cache.navlist;
        //console.log(oldlist);
        for (var i = 0; i < Math.ceil(oldlist.length / 8); i++) {
            
            if (i + 1 == Math.ceil(oldlist.length / 8)) {
                lists["list_" + i] = {};
                lists["list_" + i].navlist = oldlist.slice(8 * i, cache.navlist.length + 1);
            }
            lists["list_" + i] = {};
            lists["list_" + i].navlist = oldlist.slice(8 * i, 8 * (i + 1));
        }
        for (var obj in lists) {console.log(obj);
            var html = template('items_nav', lists[obj]);
            //console.log(html);
            $(".swiper-wrapper").append(html);
        }

//		var mrtj={
//			caipu:[{goods_id: "578",img:'http://127.0.0.1:8020/app/images/fuxin/dami.png',name:'每日推荐',jianjie:'优质黑土地大米'},
//					{goods_id: "574",
//					img:'http://127.0.0.1:8020/app/images/fuxin/rou2.png',name:'新鲜食品',jianjie:'肉类产品新鲜卫生'},
//					{goods_id: "588",
//					img:'http://127.0.0.1:8020/app/images/fuxin/fancai.png',name:'食堂承包',jianjie:'优质食堂配送'},
//					{goods_id: "581",
//					img:'http://127.0.0.1:8020/app/images/fuxin/jiance.png',name:'食品卫生',jianjie:'标准化监测流程'}]
//		}
		
		//每日推荐
//		var html3=template('tuijian_itens',mrtj);
//		document.getElementById('tuijian').innerHTML=html3;
    
    	//banner
        var banner_item = template("banner_item", cache);
        $("#banner_content").html(banner_item);	
    }
  
    $(function () {

        var user_id = localStorage.getItem("user_id");
        var unique_id = localStorage.getItem("unique_id");
        //底部样式表
        $(".footNav").html(footerNav.str);
        // console.log(footerNav);
        // $("#itemsCont1,#itemsCont2,#itemsCont3,#floorBanner1,#floorBanner2,#floorBanner3,#itemsRecommend").hide();
        //1.发送ajax请求商品分类信息
        $.ajax({
            type: 'post',
            url: URL.SiteUrl + '/index.php?m=Api&c=Index&a=get_laster_cartnum',
            dataType: 'json',
            data: {unique_id: unique_id, user_id: user_id},

            success: function (data) {
                if (data.status == 1) {
                    if (data.result !== 0) {
                        if(!token){
                            $(".car_count").hide();
                        }else {
                            $(".car_count").text(data.result);
                            $(".car_count").show();
                        }
                    }
                }
                
            }
        });

        $.ajax({
            type: 'post',//用post方法获取
            //获取首页数据
            url: URL.SiteUrl + '/index.php?m=Api&c=Index&a=home',
            //指定传入的数据格式为json
            dataType: 'json',
            beforeSend: function () {
                $(".loading").html('<div id="loading"></div>');
            },
            //成功后执行函数,获得一个返回数据对象data
            success: function (data) {



                // 唯一id
                var v = data.result.unique_id;
                if (!unique_id) {
                    localStorage.setItem("unique_id", v);
                }
//      	轮播图片渲染
//
                console.log(data);
                var html = template('items_slider', data.result);
                $('#slider').html(html);
                var inBox = document.querySelector(".idex");
                var indicator = data.result.ad.length;
                console.log(indicator);
                //动态圆点
                for (i = 0; i < indicator; i++) {
                    var objdiv = document.createElement("div");
                    objdiv.className = "mui-indicator";
                    inBox.appendChild(objdiv);
                }
                $(".idex div:nth-child(1)").addClass("mui-active");

				//banner
                var banner_item = template("banner_item", data.result);
                $("#banner_content").html(banner_item);


				//分类导航渲染
                var lists = {};
                var oldlist = data.result.navlist;
                for (var i = 0; i < Math.ceil(oldlist.length / 8); i++) {
                    if (i + 1 == Math.ceil(oldlist.length / 8)) {
                        lists["list_" + i] = {};
                        lists["list_" + i].navlist = oldlist.slice(8 * i, data.result.navlist.length + 1);
                    }
                    lists["list_" + i] = {};
                    lists["list_" + i].navlist = oldlist.slice(8 * i, 8 * (i + 1));
                }
                var attributeCount = function (obj) {
                    var count = 0;
                    for (var i in obj) {
                        if (obj.hasOwnProperty(i)) {
                            count++;
                        }
                    }
                    return count;
                }
                              
                var mySwiper = new Swiper('.swiper-container', {
                    direction: 'horizontal',
                    loop: false,
                    pagination: attributeCount(lists) == 1 ? "" : '.swiper-pagination',
                    onTouchStart: function (swiper, even) {
                        swiper.unlockSwipeToPrev();
                        swiper.unlockSwipeToNext();
                        //console.log(swiper.activeIndex);
                        if (attributeCount(lists) == 1) {
                            swiper.lockSwipeToNext();
                            swiper.lockSwipeToPrev();
                        }
                        if (swiper.isEnd) {
                            swiper.lockSwipeToNext();
                        }
                        else if (swiper.activeIndex == 0) {
                            swiper.lockSwipeToPrev();
                        }
                    }
                })               
                 	//分类图片
                $('.itemsNav').find("img").each(function (index, obj) {
                    data.result.navlist[index].nav_img = "data:image/png;base64," + data.result.navlist[index].nav_img;
                    console.log(data.result.navlist[index].nav_img);
                    $(obj).attr('src', data.result.navlist[index].nav_img);
                });
               
                $(".swiper-wrapper").children().remove();
                for (var obj in lists) {
                    var html = template('items_nav', lists[obj]);
//                    console.log(html);
                    $(".swiper-wrapper").append(html);
                }
               
                window.localStorage.setItem("result", JSON.stringify(data.result));
                
//      	楼层商品信息渲染
                                
                var html = template('items_cont', data.result.goods[0]);	
                $('#itemsCont1').html(html);                
                         
                var html = template('items_cont', data.result.goods[1]);
                $('#itemsCont2').html(html);
              
                var html = template('items_cont', data.result.goods[2]);
                $('#itemsCont3').html(html);
                
                if(html){
                function load(){
					    	console.log($('img.lazy').length);
					        //使用了data-original就不要写src了，要不然没有效果    
					        //在没有完全获取到图片的资源前，是得不到图片的宽高的，所以预先设置宽高，让它提前有个占位    
					        $('img.lazy').lazyload({    
					            threshold: 50,//滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉    
					            effect: 'fadeIn',//show fadeIn slideDown    
					            //placeholder: '',//设置加载中的占位图片路径，如image.load.gif，个人建议不设置，可以通过css设置背景图片加提前设置src=reload.gif的方式，来达到图片正在加载中的效果    
					        });
					}
                load();
				}
                
                
		        /*var aImg = document.querySelectorAll('.lazy');
		       
		        var len = aImg.length;
		        var n = 0;//存储图片加载到的位置，避免每次都从第一张图片开始遍历
		        window.onscroll = function() {
		            var seeHeight = document.documentElement.clientHeight;
		            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		            for (var i = n; i < len; i++) {
		                if (aImg[i].offsetTop < seeHeight + scrollTop) {
		                    if (aImg[i].getAttribute('src') == '') {
		                        aImg[i].src = aImg[i].getAttribute('data-src');
		                        console.log(aImg[i].getAttribute('data-src'));
		                    }
		                    n = i + 1;
		                    console.log('n = ' + n);
		                }
		            }
		        };   */         
                
                
                
                
                
				//跳到商品详情
                $(".species_item").on("click", function () {
                    window.location.href = $(this).attr("data-href");
                });
                                
                
                
                //加入购物车
                $(".species_car").on("click", function (event) {

                    event.stopPropagation();
                    var goods_id = $(this).attr("data-id");
                    var gooods_num = 1;
                    //console.log(goods_id)
                    $.ajax({
                        type: 'post',
                        url: URL.SiteUrl + '/index.php?m=Api&c=Cart&a=addCart',
                        data: {
                            user_id: user_id,
                            unique_id: unique_id,
                            token: token,
                            goods_id: goods_id,
                            goods_num: gooods_num
                        },
                        dataType: 'json',
                        success: function (data) {
                            //console.log(123);
                            // console.log(data);
                            mui.toast(data.msg, {duration: 'long', type: 'div'});
                            if (data.status == 1) {
                                $(".car_count").text(data.result);
                                $(".car_count").show();
                            }

                            // alert(data.msg)
                        }, error: function (data) {
                            mui.toast(data.msg, {duration: 'long', type: 'div'});
                        }
                    })
                });

//			自动轮播
                var gallery = mui('.slider');
                gallery.slider({
                    interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
                });


//          <!--顶部跳转部分 start-->
//              var timer = null;
//
//              function scroll() {
//                  return {
//                      top: window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0,
//                      left: window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || 0
//                  }
//              }
//
//              function scrollTo(target, leader) {
//                  timer = setInterval(function () {
//                      var step = (target - leader) / 10;
//                      step = step > 0 ? Math.ceil(step) : Math.floor(step);
//                      leader = leader + step;
//                      window.scrollTo(0, leader);
//                      if (leader === target) {
//                          clearInterval(timer);
//                      }
//                  }, 20)
//              }
//
//              $('.back_top').on('click', function () {
//                  var top = scroll()
//                  scrollTo(0, top.top)
//              });
			 $(".back_top").click(function(){
                $('body,html').animate({scrollTop:0},500);
                return false;
            });
                // <!--顶部跳转部分 end-->
            },
            error: function (data) {
                mui.toast(data.msg, {duration: 'long', type: 'div'});
            }
        })


        $("#search_bar").on("focus", function () {
            location.href = "search.html?1";
        })

        addFooterNavListener(1);
//      $("#scan_icon").on('click', function () {
//          if (token) {
//              mui.plusReady(function () {
//                  mui.init();
//                  var embed = plus.webview.create("scan.html", "scan", {
//                      width: "100%",
//                      height: "100%",
//                      position: "absolute",
//                      background: "#000000"
//                  });
//                  plus.webview.currentWebview().append(embed);
//              });
//          } else {
//              mui.toast("请登录", {duration: 'long', type: 'div'});
//          }
//          // return;
//
//      });


    });

    function scrolls() {
        return {
            top: window.pageY || document.documentElement.scrollTop || document.body.scrollTop || 0,
            left: window.pageX || document.documentElement.scrollLeft || document.body.scrollLeft || 0
        }
    }

//  var op = 0;
//  document.onscroll = function () {
//      op = scrolls().top / 300;
//      if (op > 1) {
//          op = 1;
//      }
//  };

    function toDataURL(src, callback, outputFormat) {
        var img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function () {
            var canvas = document.createElement('CANVAS');
            var ctx = canvas.getContext('2d');
            var dataURL;
            canvas.height = this.height;
            canvas.width = this.width;
            ctx.drawImage(this, 0, 0);
            dataURL = canvas.toDataURL(outputFormat);
            callback(dataURL);
        };
        img.src = src;
        if (img.complete || img.complete === undefined) {
            img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
            img.src = src;
        }
    }


    //===============定位===================

    var _container = $('#city_container');
    var city_toast = $("#toast");
    var _city_bg = $("#city_bg");
    var _dialog_city = $("#dialog_city");
    var deatas = $("#deatas");
    var city_confim = $("#city_confim"); //确认按钮
    var address_detail = $("#address_detail");


    var BTN_STATUS_COUNTY = 0; //跳转到选择区/县
    var BTN_STATUS_CLOSE = 1; //确认关闭
    var BTN_STATUS_STREET = 2; //跳转到选择街道
    var BTN_STATUS_STREETNUM = 3; //跳转到选择街道号
    var flag2 = localStorage.getItem("flag2");
    var province,city,district,street,streetNum;
    //第一次改
    var adInfo ={"province":"广东省","city":"深圳市","district":"龙岗区","street":"坪地街道","streetNum":"坪西社区","addresses":"广东省深圳市龙岗区坪地街道坪西社区"}
    //第二次改
    var  city = JSON.stringify({"province":"28240","provinceName":"广东省","city":"28558","cityName":"深圳市","district":"28604","districtName":"龙岗区","street":"28606","streetName":"坪地街道","streetNum":"47499","streetNumName":"坪西社区"})
    localStorage.setItem("is_already_location", 1);
    localStorage.setItem("city", city);


    var ps = localStorage.getItem("is_already_location");

    if (!ps) {
        address_detail.html('正在获取您的当前位置....');
        openCityDialog();
    }

    //修改后
    if(!flag2){
        openCityDialog();
        localStorage.setItem("flag2", "ture");
    }
   //===============城市选择===================

    //打开城市选择弹框
    $("#city_model").click(function () {
        openCityDialog();
    });

    function openCityDialog() {

        var data = localStorage.getItem('city');
        if (data) {
            data = JSON.parse(data);   //跳转到选择街道;

            if (data.province && data.city && data.district && data.street && data.streetNum) {

                $('#gr_zone_ids').html(data.cityName);
                city_confim.attr('data-vs', 1);
                // address_detail.html(data.districtName + data.streetName + data.streetNumName + data.poiName);
                address_detail.html(data.districtName + data.streetName + data.streetNumName);
            }

        }

        _dialog_city.addClass('temp');
        _city_bg.show();
        _dialog_city.show();

        $.ajax({
            url: 'http://192.168.0.116/index.php/api/index/get_city_html',
            type: 'GET',
            // dataType:"jsonp",
            success: function (data) {
                // console.log(data);
                $("#city_list").empty().append(data);
            }
        });
    }

    var data = localStorage.getItem('city');
    if (data) {
        data = JSON.parse(data);   //跳转到选择街道;

        if (data.province && data.city && data.district && data.street && data.streetNum) {
        } else {
            openCityDialog();
        }
    } else {
        openCityDialog();
    }


    //城市关闭
    $(".close").click(function () {

        var data = localStorage.getItem('city');
        if (data) {
            data = JSON.parse(data);
            if (data.province && data.city && data.district && data.street && data.streetNum) {
                _city_bg.hide();
                _dialog_city.hide().toggleClass('temp');
                _container.hide();
                deatas.show();
                return;
            }
        }
        mui.toast("请选择配送范围", {duration: 'long', type: 'div'});
        return;

    });

    //城市确认
    city_confim.click(function () {

        vs = city_confim.attr('data-vs');
        if (!vs) {
            mui.toast("亲，请先选择区域哦", {duration: 'long', type: 'div'});
            return;
        }

        var status = city_confim.data('status');

        var data = localStorage.getItem('city');

        if (data) {
            data = JSON.parse(data);   //跳转到选择街道
        }

        //console.log('val=' + status);

        switch (status) {
            case  BTN_STATUS_CLOSE:
                _city_bg.hide();
                _dialog_city.hide();
                break;

            case  BTN_STATUS_STREET: //去选择街道

                location.href = 'city_list.html?id=' + data.district + '&type=street_1';
                return;

            case  BTN_STATUS_STREETNUM: //去选街道区域


                location.href = 'city_list.html?id=' + data.street + '&type=street_2';
                break;

            case  BTN_STATUS_COUNTY: //跳转到选择区

                location.href = 'city_list.html?id=' + data.city + '&type=area&level=3';
                return;
        }

    });

    //加载城市事件
    $('#zone_ids,#first_li,#update_city').on('tap', function () {
        var zid = $(this).attr('id');
        deatas.toggle();
        _container.slideToggle(200);
        _dialog_city.toggleClass('temp');
    })


    //选择城市 start
    $('body').on('tap', '.city-list p', function () {

        var _this = $(this);
        var html = _this.html();
        var type = _container.data('type');
        var id = _this.attr('data-id');
        var pid = _this.attr('data-pid');

        city_confim.attr('data-vs', 1);

        $('#zone_ids').html(html).attr('data-id', id);
        $('#gr_zone_ids').html(html).attr('data-id', id);

        city_confim.data('status', BTN_STATUS_COUNTY);
        city_confim.html('确认');

        //保存选择的城市和省份
        localStorage.setItem("city", JSON.stringify({province: pid, city: id}));
        _dialog_city.toggleClass('temp');
        $("#upmsgs").show();
        deatas.hide();
        _container.slideUp();

    });

    var city_list = $("#city_list");


    //锚点
    $("#letter span.md").on('tap', function () {
        var s = $(this).text();
        console.log(s);

        city_list.scrollTop(0);
        city_toast.text(s).fadeIn();

        var t = $('#' + s + '1');
        city_list.scrollTop(t.position().top);

        setTimeout(function () {
            city_toast.fadeOut();
        }, 1200)
    })


})();

