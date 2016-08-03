/**
 * @file inputprompt.js输入提示
 * @author qucheng(qucheng_se@163.com)
 * 
 */
define(['util'], function(_) {	
	var treeSearch;
	var Inputprompt = {
	    addnoteText: function(id,innerText,color) {
			var alertText = _.$(id);
			alertText.innerHTML = innerText;
			alertText.style.color = color;
		},
		noteText:function(id,innerText,color) {
			var alertText = _.$(id);
			console.log(alertText);
			alertText.style.display = "inline-block";
			alertText.innerHTML = innerText;
			alertText.style.color = color;
			if (treeSearch) {
				window.clearTimeout(treeSearch);
				console.log("clean");
			}
			// treeSearch = window.setTimeout(this.HideAlertText,2000); 为什么一加参数就自动执行了
			// 用匿名函数 不会立即执行
			treeSearch = window.setTimeout(function() {							 		
				console.log(id);
				var alertText = _.$(id);
				alertText.style.display = "none";
			},2000);
			console.log("delay");
			
		},
		trimNode: function(e) {
			console.log(e);
			var trimReg = /^\s+|\s+_.$/g;
			return e.value.replace(trimReg,"");
		},
		checkInputText: function(id,e) {
		    //原始输入去除首尾空格                                
			var value = this.trimNode(e);
			if (value===null||value==="") {
				this.noteText(id,"查询不能为空","#EC9B69");
			} 
			return value;
		},
	    addcheckInputText: function(id,e) {                                       		
			var value = this.trimNode(e);        
			if (value===null||value==="") {
				this.addnoteText(id,"输入标题不能为空","#EC9B69");
			} else {
				this.addnoteText(id,"","#376337");
			}
			return value;
		}
	};
	return {
		Inputprompt: Inputprompt
	};
});