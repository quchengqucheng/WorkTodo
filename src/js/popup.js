/**
 * @file popup.js 浮出层组件
 * @author qucheng(qucheng_se@163.com)
 * 
 */
define(['util','data','calendar'], function(_,d,cal) {

	/**
	 * [SuperPopup 浮出层的设定]
	 * @param {Object} o [初始数据]
	 */
	function SuperPopup(o){
		this.btnName = o.btnName;
	    this.idName = o.idName;
	    this.className = o.className;
	    this.headerName = o.headerName;
	    this.confirmBtn = o.confirmBtn;
	    this.textContent = o.textContent;
	    if (o.h1Name!==undefined)
	    	this.h1Name = o.h1Name;

	}

	/**
	 * [init 渲染浮出层]
	 * @param  {Object} o [创建的浮出层]
	 * @return {[null]}   [description]
	 */
	SuperPopup.prototype.init = function(o){
		var div = document.createElement("div");
		div.setAttribute("id",o.idName);
		div.setAttribute("className",o.className);
		var div2 = document.createElement("div");
		div2.setAttribute("class","popup-board");
		var header = document.createElement("header");
		var h1 = document.createElement("h1");
		if (o.h1Name!==undefined) {
			h1.setAttribute("id",this.h1Name);
		}
		h1.innerHTML= o.headerName;
		var i = document.createElement("i");
		i.setAttribute("class","fa fa-times-circle popup-close fa-lg");
		i.setAttribute("aria-hidden","true");

		header.appendChild(h1);
		header.appendChild(i);
		var section = document.createElement("section");
		section.innerHTML = o.textContent;
		var footer = document.createElement("footer");
		var btn1 = document.createElement("button");
		btn1.setAttribute("class","btn-ok");
		btn1.setAttribute("id",o.confirmBtn);
		btn1.innerHTML = "确认";
		var btn2 = document.createElement("button");
		btn2.setAttribute("class","btn-canel popup-close");
		btn2.innerHTML = "取消";
		div2.appendChild(header);
		div2.appendChild(section);

		if (o.idName !== "popup-task-more") {
			footer.appendChild(btn1);
			footer.appendChild(btn2);
			
		}
		div2.appendChild(footer);
		div.appendChild(div2);
		document.getElementsByTagName("body")[0].appendChild(div);
		o.AddListener.initClose(o);
		console.log("haha)))))))))))))))))))))))))))))))))");
	};

	SuperPopup.prototype.AddListener = {
		initClose:function(popup) {
			_.$(popup.idName).addEventListener('click',function(e) {
				var hasClassName = /popup-close/gi; 
				if ((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
					_.$(popup.idName).style.display = "none";
				}
			},false);
			_.$(popup.idName).addEventListener('click',function(e) {
				if (e.target.id ===popup.idName) {
					_.$(popup.idName).style.display = "none";
				}
			},false);
		}
	};

	/**
	 * [clearPopup 浮出层初始化]
	 * @return {[type]} [description]
	 */
	var clearPopup = function() {
		// _.$("text").value = cal.todayDate;
		_.$("text").value = cal.calendarCreate.todayDate;
		_.$("task-input-title").value = "";
		_.$("fast-task-input-title").value = "";
		_.$("task-input-content").value = "";
		_.$("calendar1").style.display = "none";
		_.$("addinputText").value = '';
	};
	var popupCreat = function() {
		var addClassify = new SuperPopup(d.popupAddClassify);
		addClassify.init(addClassify);
		var addTask = new SuperPopup(d.popupAddTask);
		addTask.init(addTask);
		var delClassify = new SuperPopup(d.popupDelClassify);
		delClassify.init(delClassify);
		var taskMore = new SuperPopup(d.popupTaskMore);
		taskMore.init(taskMore);
		var addFastTask = new SuperPopup(d.popupFastAdd);
		addFastTask.init(addFastTask);
	};
	return {
		popupCreat: popupCreat,
		clearPopup: clearPopup
	};
	
});