/**
 * @file drag.js 拖拽操作
 * @author qucheng(qucheng_se@163.com)
 * 
 */
define(['util'], function(_) {
	function Drag() {
		var dragged;
	}
	Drag.prototype = {
		init:function() {
		// 为每个任务列表组<div class="task-ul">添加有效放置的事件代理
		_.$.delegate(_.$$("right-section")[0],"ul", "dragover", this.draginHandle);
		_.$.delegate(_.$$("right-section")[0],"li", "dragover", this.draginHandle);
		// 在创建元素的时候为所有的<li class="task-list task-list">设置为可拖动元素
		//  _.$.delegate(_.$$("right-section")[0],"li", "focus", this.draggableHandle);
		_.$.delegate(_.$$("right-section")[0],"li", "dragstart", this.dragstartHandle);
		_.$.delegate(_.$$("right-section")[0],"li", "drag", this.dragHandle);
		_.$.delegate(_.$$("right-section")[0],"li", "dragend", this.dragendHandle);
		_.$.delegate(_.$$("right-section")[0],"li", "dragenter", this.dragenterHandle);
		_.$.delegate(_.$$("right-section")[0],"li", "dragleave", this.dragleaveHandle);
		_.$.delegate(document,"ul", "drop",this.dropHandle);
		_.$.delegate(document,"li", "drop",this.dropHandle);
		},

		draginHandle:function (e) {
			var hasClassName = /task-ul|task-list/gi;
			if (hasClassName.test(e.target.className.toLowerCase())) {
				e.preventDefault();
			}
		},

		draggableHandle:function(e) {
			var hasClassName = /task-list/gi;
			if (hasClassName.test(e.target.className.toLowerCase())) {
				e.target.draggable = true;
			}
		},

		// 拖放某元素时，依次触发时间入下：dragstart drag dragend*
		dragstartHandle:function(e) {//拖拽开始瞬间触发
			var hasClassName = /task-list/gi;
			if ((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
				console.log("dragstart");
				console.log("dragstart:",e.clientX,e.clientY);
				// 记录拖动原件
				dragged = e.target;
				e.target.style.opacity = "1";
				// e.target.style.backgroundColor = "red";
			}
		},
		// 拖拽的过程中实时触发
		dragHandle:function (e) {
			var hasClassName = /task-list/gi;
			if ((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
				console.log("drag");
				// 原件拖动时，在元容器中消失设为display ?????为什么没有效果
				e.target.className = "dragging-section";
				// e.target.style.display = "none";
			}

		},

		dragendHandle:function (e) {
		    // 重置透明度
		    console.log("dragend");
			console.log("dragend:",e.clientX,e.clientY);
		    e.target.style.opacity = "";
		    e.target.className = "task-list";
		},

	    //元素被拖放到有效目标位置时，依次触发事件：dragenter dragover dragleave/drop
		dragenterHandle:function( e ) {
		    // 当可拖动的元素进入可放置的目标高亮目标节点
		    console.log("dragenter");
		    var hasClassName = /task-ul/gi;
		    if ( hasClassName.test(e.target.className.toLowerCase())) {
		        e.target.style.background = "#222";
		    }
		},

		dragleaveHandle:function ( e ) {
		    // 当拖动元素离开可放置目标节点，重置其背景
		    console.log("dragleave");
		    var hasClassName = /task-ul/gi;
		    if ( hasClassName.test(e.target.className.toLowerCase())) {
		        e.target.style.background = "";
		    }
		},

		dropHandle:function(e) {
			console.log("drop "+e.target.className+" is preventDefault！");
			// drapOn为可放置目标元素
			var drapOn = e.target;
			var hasClassName = /task-list/gi;
			if (hasClassName.test(e.target.className.toLowerCase())) {
				console.log("apreOrder");
				drapOn = e.target.parentNode;
			}

			// console.log(e.clientX,e.clientY,e.target.offsetLeft,e.target.offsetHeight,e.target.offsetTop,e.target.offsetParent,drapOn.offsetTop);
			// e.target.offsetParent是e.target元素上面最近的已定位的元素
			// 可拖放元素距离可放置目标元素最顶的距离
			var top = e.clientY - drapOn.offsetTop;
			// num为鼠标停止上方的小方块个数								
			var num = Math.floor(top/45);
			var allnum =  drapOn.getElementsByClassName("task-list");//
			if (num>allnum.length+1)
				num = allnum.length;

			drapOn.style.background = "";
		    dragged.parentNode.removeChild( dragged );
			drapOn.insertBefore(dragged,allnum[num]);
			// e.preventDefault();阻止默认动作（如打开一些元素的链接）
		}
	};
	var dragCreate = function() {
		var dragg= new Drag();
	 	dragg.init();
	 };
	return {
		dragCreate: dragCreate
	};
});