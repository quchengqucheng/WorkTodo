/**
 * @file countdown.js倒计时
 * @author qucheng(qucheng_se@163.com)
 * 
 */
define(['util'], function(_) {
	var doCountdown;
	var timeCountdown = function(endTime) {
		// 每次更新endTime日期后，清除上一次setInterval;
		if (doCountdown) window.clearInterval(doCountdown);
		var endTimeArr = endTime.split("-");
		var end = new Date(endTimeArr[0],endTimeArr[1]-1,endTimeArr[2],0,0,0);
		console.log(end);
		setCountdown();
		function setCountdown() {
			var start = new Date();
			var elapsed = Math.abs(end.getTime() - start.getTime());
			//1天 = 24小时*60分*60秒*1000毫秒|| 1时 = 60分*60秒*1000毫秒|| 1分 = 60秒*1000毫秒|| 1秒 = 1000毫秒
			var days =  Math.floor(elapsed/ (24 * 3600 * 1000));							
			var hours = Math.floor((elapsed%(24 * 3600 * 1000))/(3600*1000));
			var minutes  =Math.floor((elapsed%(24 * 3600 * 1000)%(3600*1000))/(60*1000));
			var seconds  =Math.floor((elapsed%(24 * 3600 * 1000)%(3600*1000)%(60*1000))/1000);
			var returnText;
			if (elapsed<0) {
				 window.clearInterval(doCountdown);
			} else if (end.getTime()>start.getTime()) {
				_.$("popup-task-more").getElementsByTagName("footer")[0].innerHTML =  "截止日期"+endTimeArr[0]+"-"+endTimeArr[1]+"-"+endTimeArr[2]+
				"<br>还有"+days+"天"+hours+"小时"+minutes+"分"+seconds+"秒";
			} else {
				_.$("popup-task-more").getElementsByTagName("footer")[0].innerHTML  =  "截止日期"+endTimeArr[0]+"-"+endTimeArr[1]+"-"+endTimeArr[2]+
				"<br>已过去"+days+"天"+hours+"小时"+minutes+"分"+seconds+"秒";
			}
		}
		doCountdown = window.setInterval(setCountdown, 1000);

	};
	return {
		timeCountdown: timeCountdown
	};
});