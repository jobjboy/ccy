/**
 * Created by Administrator on 2017/9/16 0016.
 */

define([], function () {

    
//  var api_url = "http://192.168.0.116/user/";
	
	var api_url = 'http://cw.skylartech.cn/user/';

    return {

        'API_URL': api_url,

        /**
         * 获取访问令牌
         * 返回参数:
         {
             "code": "1",
             "msg": "success",
             "data": "a687a7c5-57c1-4574-99dc-ddd023cab8a3"
         }
         */
        //app登录接口
        GET_TOKEN: 'login/?act=api&username={0}&password={1}&model_id={2}',
        
        //用户上传地理位置
		upload_coordinate: api_url + 'upload_coordinate/?act=api&aut_token={0}&latitude={1}&longitude={2}',
		
		//我的任务集合
		my_task: api_url + 'my_task/?act=api&aut_token={0}&status={1}',
		
		//用户每日签到，签退接口
		sign_in:api_url + 'sign_in/?act=api&aut_token={0}&latitude={1}&longitude={2}&img={3}&type=[4]',
		
		//该任务巡逻完成
		excute_task:api_url + 'excute_task',
		
		//申请支援
		task_hellp:api_url + 'task_apply_support',

		//突发任务申请
		task_apply:api_url + 'task_apply',
		
		//图片上传
		upload_img:api_url + 'upload_img/?act=api',
		
		//单个任务详情和操作记录
		get_task_info:api_url + 'get_task_info?act=api&aut_token={0}&task_id={1}',
		
		//退出登录接口
		log_out:api_url + 'log_out?act=api&aut_token={0}',
    };
});