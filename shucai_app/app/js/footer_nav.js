/**
 * Created by lenovo on 2017/4/5.
 */
footerNav  = { 
     str:'<div class="v_nav"> <div class="vf_nav"> <ul> <li> <a href="index.html"> <i class="vf_1"></i> <span>首页</span></a> </li> <li> <a href="snap_up.html"> <i class="vf_2"></i> <span>分类</span></a> </li> <li> <a href="shopping_cart.html"> <i class="vf_3"></i><em class="mui-badge mui-badge-danger car_count"></em><span>购物车</span> </a> </li> <li> <a href="personal.html"> <i class="vf_4"></i> <span>我的</span></a> </li> </ul> </div> </div>'
}

function addFooterNavListener(pageIndex){
     $('.vf_nav ul li a').each(function (i) {
          $(this).css({
               "background": "url(images/index/" + [i] + "-0.png)no-repeat center top",
               "background-size": "55%"
          });

     });
     $('.vf_nav ul li:nth-child('+pageIndex+') a').css({
          "background": "url(images/index/"+(pageIndex-1)+".png)no-repeat center top",
          "background-size": "55%",
          "color": "#fdb800"
     });
     $('.vf_nav ul li:nth-child('+pageIndex+') a').attr("href", "javascript:void(0)");

}
    