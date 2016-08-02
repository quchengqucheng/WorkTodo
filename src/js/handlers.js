define(['util', 'data'], function(_, d) {

/*-------------------------------------------------------------tree----------------------------------------------------------*/
var traverse = [];													// 储存创建的node节点
var queue = [];   													// 储存遍历的div节点
var search = [];  													// 储存搜索到div节点 用于清空样式
function Node(data,text,amount,childNode,FatherNode) {  			// 多叉树结点的构造函数
	this.data = data; 		  										// 存放当前div
	this.text = text;		   										// 节点名称
	this.amount= amount;       										// 子孩子个数
	this.childNode =[];   	   										// 子孩子节点
	this.FatherNode = FatherNode;								    //父亲节点
}
var rt;
function initTree() {
	rt = createTree(d.treedata);
	order(rt,_.$("root"));
	console.log(rt);
}

var signNode;														//记录添加初始数据的结点
function createTree(treedata) {										// 创建多叉树
	var root;
	console.log(treedata.length);
	createNode(treedata);
	function createNode(treedata) {
		for(var key in treedata) {
			var num = howManyKeys(treedata[key]);
			console.log(num,key,treedata[key]);
			var node= new Node(null,key,num,null,null);
			if(key === "任务列表") root = node;
			if(key === "使用说明")
			signNode =node;
			traverse.push(node);

			if(typeof treedata[key] === "object") {
				createNode(treedata[key]);
			}
		}
		
	}
	function addTree() {
		if(traverse.length!==0) {
			var parent = traverse[0];
			for(var i=0;i<parent.amount;i++) {
				parent.childNode.push(traverse[1]);
				traverse[1].FatherNode = parent;								
				traverse.shift();
				addTree();
			}
		}
	}

	addTree();
	return root;
}
function howManyKeys(data) {
	num=0;
	for(var key in data) {
		num++;
	}
	return num;
}

function renderTree(value,childType) {								// 渲染多叉树
		var childDiv = document.createElement("div");
		var span  = document.createElement("span");
		var div  = document.createElement("div");
		var div2 = document.createElement("div");
		var i = document.createElement("i");
		var deletSign       = document.createElement("i");
		var addClassifySign = document.createElement("i");
		var addTaskSign     = document.createElement("i");

		if(childType===0){											//添加新任务
			i.setAttribute("class","fa fa-file-text-o tree-title-sign");
			i.style.display = "inline-block";
			span.innerHTML = value;
			span.setAttribute("class","tree-title tree-title-task");
			deletSign.setAttribute("class","fa fa-trash-o tree-delet");
			childDiv.setAttribute("class","child");
			childDiv.style.display = "block";
			childDiv.value = value;									//记录节点名称
			div.setAttribute("class","i-collect");
			childDiv.appendChild(i);
			div2.setAttribute("class","tree-title-box");
			div2.appendChild(span);
			div2.appendChild(div);
			childDiv.appendChild(div2);

		}  else {   												//添加新分类
			i.setAttribute("class","fa fa-folder-open-o tree-title-sign");
			i.style.display = "inline-block";
			span.innerHTML = value;
			span.setAttribute("class","tree-title tree-title-classify");
			addTaskSign.setAttribute("class","fa fa-plus-circle task-add");
			addClassifySign.setAttribute("class","fa fa-folder-o tree-add");
			deletSign.setAttribute("class","fa fa-trash-o tree-delet");
			childDiv.setAttribute("class","child");
			childDiv.style.display = "block";
			childDiv.value = value;									//记录节点名称
			childDiv.setAttribute("id",d.fatherIdArr[d.fatherIdnum++]);
			div.setAttribute("class","i-collect");
			if(value == "任务列表")
			div.setAttribute("id","root-title");
			div.appendChild(addTaskSign);
			div.appendChild(addClassifySign);
			div.appendChild(deletSign);
			childDiv.appendChild(i);
			div2.setAttribute("class","tree-title-box");
			div2.appendChild(span);
			div2.appendChild(div);
			childDiv.appendChild(div2);
		}
	return childDiv;
}

function order(rt,parentDiv) {
	if(rt!==null) {
		value = rt.text;
		var childDiv = renderTree(value);
		rt.data = childDiv;
		parentDiv.appendChild(childDiv);
	}
	if(rt.childNode.length>=0) {
		rt.data.firstChild.style.display = "inline-block";
	}
	for(var i=0;i<rt.childNode.length;i++) {
		order(rt.childNode[i],childDiv);
	}
}
function clearAll() {          										//停止遍历、搜索
	function cleanShow(search) {									//已搜索到的元素恢复为原样式
		while(search.length>0) {
			search.shift().firstChild.nextSibling.id ="";
		}
	}
 	queue = [];
 	cleanShow(search);
}

function show(queue,value,rt) {										// 遍历过程中展示正在遍历的元素
	var count = 0;
	var findoutDiv = [];
	console.log(typeof(value));
	while(queue.length>0) {
		var div = queue.shift();
		search.push(div);
		if(findoutDiv.length>0) {
			for(var i=0;i<findoutDiv.length;i++) {
				var findDiv = findoutDiv[i];
				Order(rt);
			}
		}//if(findoutDiv.length>0)
		var valueMatch = new RegExp(value, 'gi');

		if(value!==null&&valueMatch.test(div.value.toString())) {	//搜索到元素
			div.firstChild.nextSibling.className = "tree-title-box highlight";
			findoutDiv.push(div);
			count++;
		}
	}//while
	
	if(value!==null) {
		if(count===0) Inputprompt.noteText("alertText","没有查询到元素","green");
    	else Inputprompt.noteText("alertText","查询到"+count+"个元素","green");
	}
	function Order(rt) {
		if(rt.data===findDiv){        
			if(!rt.FatherNode) return;
			rt.FatherNode.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
			for(var j=0;j<rt.FatherNode.childNode.length;j++) {
		       	rt.FatherNode.childNode[j].data.style.display = "block";
			}
			var grandeNode = rt.FatherNode;
			while(grandeNode.FatherNode!==null) {					//有父节点，父节点展开
				grandeNode.FatherNode.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
				for(j=0;j<grandeNode.FatherNode.childNode.length;j++) {
			       	grandeNode.FatherNode.childNode[j].data.style.display = "block";
				}
				grandeNode = grandeNode.FatherNode;
			}
			return;
		}
		if(rt!==null) {
			for(var k=0;k<rt.childNode.length;k++) {
				Order(rt.childNode[k]);
			}
		}
	}//Order(rt)

}
																
function preOrder(rt) {												// 先序遍历
	if(rt!==null) {
		queue.push(rt.data);
		for(var i=0;i<rt.childNode.length;i++) {
			preOrder(rt.childNode[i]);
		}
	}
	return queue;
}
var choseDiv;
var inputTextFocus;
var nowChangeli;
function initAddListener() {

	_.$.delegate(_.$("tree"),"i", "click", clickHandle);
	_.$.delegate(_.$("task-ul-one"),"span", "click", clickHandle);
	_.addEvent(_.$("fast-add-task-btn"), "click", clickHandle);
	_.addEvent(_.$("fast-task-list"), "click", showOrClose);
	_.$.delegate(_.$$("right-section")[0],"i", "click", clickHandle);
	_.$.delegate(_.$("task-ul-one"),"span", "click", Tasklist.taskMoreHandle);
	_.$.delegate(_.$$("right-section")[0],"div", "click", Tasklist.taskDoneHandle);

	_.addEvent(_.$$("theme-color")[0],"click",function(e) {
		if(e.target.nodeName.toLowerCase() === "button") {
			console.log(e.target.className);
			document.getElementsByTagName('body')[0].className = "theme-" + e.target.className;
			_.$$("settings")[0].style.display = "none";
			localStorage.setItem('color',"theme-" + e.target.className );
		}
	});
	_.addEvent(_.$$("font-size")[0],"click",function(e) {
		if(e.target.nodeName.toLowerCase() === "button") {
			console.log(e.target.className);
			document.getElementsByTagName('html')[0].className = "theme-" + e.target.className;
			_.$$("settings")[0].style.display = "none";
			localStorage.setItem('font',"theme-" + e.target.className );
		}
	});
	_.addEvent(_.$$("fa fa-cog fa-2x")[0],"click",function(e) {
		if(e.target.nodeName.toLowerCase() === "i") {
			console.log("focus");
			if(_.$$("settings")[0].style.display === "block")
				_.$$("settings")[0].style.display = "none";
			else
				_.$$("settings")[0].style.display = "block";
		}
	});

	function showOrClose(e) {
		if(e.target.className ==="fa fa-bolt tree-title-sign") {
			console.log("preOrderHHA");
			var childs = e.target.parentNode.getElementsByClassName("child");
			console.log(childs.length);
			for(var i=0;i<childs.length;i++) {
				if(childs[i].style.display==="block")
					childs[i].style.display = "none";
				else
					childs[i].style.display = "block";
			}
		}
	}
	// var popupId;
	function clickHandle(e) {
		var arrMatch = {
			"fa fa-folder-o tree-add":"popup-add-classify",
			"fa fa-plus-circle task-add":"popup-add-task",
			"fa fa-trash-o tree-delet":"popup-del-classify",
			"task-list-title": "popup-task-more",
			"fast-add-task": "popup-add-fast-task",
			"fa fa-pencil-square-o fa-lg": "popup-add-task",
			"fa fa-pencil-square-o fa-lg fast-change-list": "popup-add-fast-task"
		};

		if(arrMatch[e.target.className.toLowerCase()]) {
			var popupId = arrMatch[e.target.className.toLowerCase()];
			console.log(e.target);
			console.log(popupId);
			clearPopup();
			_.$(popupId).style.display = "flex";
			
		}

		if(e.target.className.toLowerCase() === "fa fa-pencil-square-o fa-lg") {
			
			for(var i=0;i<tasklistArr.length;i++) {
				if(e.target.parentNode.parentNode===tasklistArr[i].li) {
					nowChangeli = tasklistArr[i];
					_.$("text").value = tasklistArr[i].endTime;
					_.$("task-input-title").value = tasklistArr[i].title;
					_.$("task-input-content").value = tasklistArr[i].content;
					_.$("popup-add-task").getElementsByTagName("h1")[0].innerHTML = "编辑任务";
					
				}
			}

		}
		else if(e.target.className.toLowerCase() === "fa fa-pencil-square-o fa-lg fast-change-list") {
			for(var k=0;k<tasklistArr.length;k++) {
				if(e.target.parentNode.parentNode===tasklistArr[k].li) {
					nowChangeli = tasklistArr[k];
					
					_.$("fast-task-input-title").value = tasklistArr[k].title;
		
					_.$("popup-add-fast-task").getElementsByTagName("h1")[0].innerHTML = "编辑快速任务";	
				}
			}
		}

																	//添加任务时的浮出层内容界面
			var content = _.$("popup-add-task-content");
			content.parentNode.removeChild(content);
			_.$("popup-add-task").getElementsByTagName("section")[0].appendChild(content);
			content.style.display = "block";
	
		}

	_.$("tree").addEventListener('click',function(e){
       if((e.target||e.srcElement)&&(e.target.className==="fa fa-folder-open-o tree-title-sign"||e.target.className==="fa fa-folder-open tree-title-sign")) {
	       	var treeSign= e.target;
	       	var len;
	       	Order(rt);
	       	console.log(len);
	       	if(len) {
	       		if(treeSign.className==="tree-title-box") {			//fa fa-folder-open 选中节点更改图标
		       		treeSign =treeSign.previousSibling;
		       	}
		       	if(treeSign.className==="fa fa-folder-open-o tree-title-sign") {
		       		treeSign.className = "fa fa-folder-open tree-title-sign";
		   		}else if(treeSign.className === "fa fa-folder-open tree-title-sign") {
		   			treeSign.className = "fa fa-folder-open-o tree-title-sign";
		   		}	
	       	}
	      
	    }
	    else if((e.target||e.srcElement)&&(e.target.className==="tree-title tree-title-classify")) {
	    	console.log("title click");
	    	var focusNode = e.target.parentNode.parentNode;
	    	if(e.target.innerHTML ==="任务列表")
	    		_.$("task-ul-one").getElementsByTagName("span")[0].innerHTML = "任务列表";
	    	else
	    		_.$("task-ul-one").getElementsByTagName("span")[0].innerHTML = "任务列表 > "+e.target.innerHTML;
	    	var lis = _.$("task-ul-one").getElementsByTagName("li");
	    	while(lis.length) {
				_.$("task-ul-one").removeChild(lis[0]);
			}
	    	showLi(focusNode);
	    	
	    }
	     	function Order(rt) {
				if(rt.data===treeSign.parentNode){        			//找到选中节点 更改子元素display
					len = rt.childNode.length;
					for(var i=0;i<rt.childNode.length;i++) {
						if(rt.childNode[i].data.style.display === "block")
				       	   rt.childNode[i].data.style.display = "none";
				       	else rt.childNode[i].data.style.display = "block";
					}
				}
				if(rt!==null) {
					for(var k=0;k<rt.childNode.length;k++) {
						Order(rt.childNode[k]);
					}
				}
			}
			function showLi(node) {
	    		console.log(node);
				var childs = node.getElementsByClassName("child");
				if(childs.length > 0) {
					for(var j=0;j<childs.length;j++) {
						showLi(childs[j]);
					}
				}else {
					for(var i=0;i<tasklistArr.length;i++) {
						if(node === tasklistArr[i].cnode) {
							_.$("task-ul-one").appendChild(tasklistArr[i].li);
							break;
						}
					}
				}
					
			}
	},false);



	_.$("tree").addEventListener('click',function(e){
		if((e.target||e.srcElement)&&e.target.className==="fa fa-trash-o tree-delet") {
			choseDiv = e.target.parentNode.parentNode.parentNode;
			if(choseDiv.getElementsByClassName("tree-title-task").length>0) {
				console.log("文件夹里还有任务未完成");
				_.$("popup-del-classify").getElementsByTagName("section")[0].innerHTML = "此分类里还有任务未完成<br>请先完成任务后再删除";
				_.$("popup-del-classify").getElementsByTagName("footer")[0].style.display  = "none";			
			} else {

				_.$("popup-del-classify").getElementsByTagName("section")[0].innerHTML = "确定删除分类及分类中的全部任务";
				_.$("popup-del-classify").getElementsByTagName("footer")[0].style.display  = "block";
			_.$("del-classify-btn").addEventListener('click',function(){

			console.log("delet");
			clearAll();
			Order(rt);											//从存储树的结构中删除节点，遍历多叉树找到节点位置
			function Order(rt) {
				if(rt.data===choseDiv){          
					console.log(rt.text);
					var num = rt.FatherNode.childNode.indexOf(rt);
					console.log(num);
					rt.FatherNode.childNode.splice(num, 1);

					var jsq = Storage.delClassifySto(choseDiv);
					Storage.treeNodeIdChange();

					return;
				}
				if(rt!==null) {
					for(var i=0;i<rt.childNode.length;i++) {
						Order(rt.childNode[i]);
					}
				}
			}
																//从它的父元素中删除子元素,从dom中删除
			if (choseDiv.parentNode) {
				choseDiv.parentNode.removeChild(choseDiv);
			}
			_.$("popup-del-classify").style.display = "none";
		},false);

		}}
	},false);

	_.$("tree").addEventListener('click',function(e){
		var hasClassName =/tree-add|task-add/gi;
		if((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
			console.log("add");
			choseDiv = e.target.parentNode.parentNode.parentNode;
			clearAll();
		}

	},false);

	//添加新分类
	_.$("addbtn").addEventListener('click',function() {
		var value;
		value = Inputprompt.addcheckInputText("alertText2",_.$("addinputText"));
		if(value!==null&&value!=="") { 
			_.$("popup-add-classify").style.display = "none"; 
			console.log(value);
			var jsq = Storage.addClassifySto(choseDiv,value);
			var node = new Node(null,value,0,null,null);
			var childDiv =  renderTree(value);
                       
			d.fatherIdArr.pop();                                            	//新的结点渲染到页面上后删除该结点的id
			d.fatherIdArr.splice(jsq, 0, "fatherId"+d.fatherIdjsq++);        	//更新该结点id在id数组中的位置
			Storage.treeNodeIdChange(jsq);
			choseDiv.appendChild(childDiv);                                  	//新节点加入到选中节点中

				Order(rt);														//遍历找到选中节点 
			function Order(rt) {
				if(rt.data===choseDiv) {									 	//选中节点图标更新
					rt.childNode.push(node);
					node.FatherNode = rt;
					rt.data.firstChild.style.display = "inline-block";			//fa fa-folder-open-o tree-title-sign
					rt.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
					node.data = childDiv;
					
					for(var i=0;i<rt.childNode.length;i++) {					//选中节点子节点展开
						rt.childNode[i].data.style.display = "block";
					}
					return;
				}
				if(rt!==null) {
					for(var k=0;k<rt.childNode.length;k++) {
						Order(rt.childNode[k]);
					}
				}
			}
		}
	} ,false);

	//编辑、添加新任务
	_.$("add-task-btn").addEventListener('click',function() {
		var value   = Inputprompt.addcheckInputText("alertText3",_.$("task-input-title"));
		var content = Inputprompt.addcheckInputText("alertText3",_.$("task-input-content"));
		var endTime = _.$("text").value;
		if(_.$("h1Name").innerHTML === "编辑任务") {                          	//编辑任务
			console.log("编辑任务");
			if(value!==null&&value!=="") { 
				var pos = tasklistArr.indexOf(nowChangeli);
				tasklistArr[pos].endTime = _.$("text").value;
				tasklistArr[pos].title = _.$("task-input-title").value;
				tasklistArr[pos].content = _.$("task-input-content").value; 
				tasklistArr[pos].li.getElementsByClassName("task-list-title")[0].innerHTML = _.$("task-input-title").value;
				tasklistArr[pos].li.getElementsByClassName("task-list-endtime")[0].innerHTML = _.$("text").value;
				tasklistArr[pos].cnode.getElementsByClassName("tree-title")[0].innerHTML = _.$("task-input-title").value;
				_.$("popup-add-task").style.display = "none";
				_.$("h1Name").innerHTML = "添加任务";
			}

		}else {  																//添加任务                                                                              
			if(value!==null&&value!=="") { 
				_.$("popup-add-task").style.display = "none"; 
				console.log(value,content);
				var node = new Node(null,value,0,null,null);
				var childDiv =  renderTree(value,0);
				choseDiv.appendChild(childDiv);									//新节点加入到选中节点中

				Order(rt);														//遍历找到选中节点 
				function Order(rt) {
					if(rt.data===choseDiv) {									//选中节点图标更新
						rt.childNode.push(node);
						node.FatherNode = rt;
						rt.data.firstChild.style.display = "inline-block";		//fa fa-folder-open-o tree-title-sign
						rt.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
						node.data = childDiv;
						console.log(rt.data.id);
						var taskone = {
							"fatherId": rt.data.id,
							"title": value,
							"pnode": rt.data,
							"cnode": childDiv,
							"content": content,
							"endTime": endTime,
							"type" : "normal"
						};

						var newtask = new Tasklist(taskone);					//把任务添加到右侧任务列表中
						newtask.init(newtask);
						tasklistArr.push(newtask);

																				//文件夹内部添加任务，文件夹后面的数字+1
						var fileTitleName = rt.data.getElementsByClassName("tree-title")[0].innerHTML;
						rt.data.getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");

						for(var j=0;j<rt.childNode.length;j++) {				//选中节点子节点展开
							rt.childNode[j].data.style.display = "block";
						}
						return;
					}
					if(rt!==null) {
						for(var k=0;k<rt.childNode.length;k++) {
							Order(rt.childNode[k]);
						}
					}
				}
			}

		}
		Storage.TaskChange();
		clearPopup();
	} ,false);


																				//编辑、添加快速任务
	_.$("add-fast-task").addEventListener('click',function() {
		if(_.$("fastH1Name").innerHTML === "编辑快速任务") {   					//编辑快速任务

			console.log("编辑快速任务");

			var pos = tasklistArr.indexOf(nowChangeli);
			nowChangeli.title = _.$("fast-task-input-title").value;
																				//更改左侧树结点的标题
			nowChangeli.li.getElementsByClassName("task-list-title")[0].innerHTML = _.$("fast-task-input-title").value;
			nowChangeli.cnode.getElementsByClassName("tree-title")[0].innerHTML = _.$("fast-task-input-title").value;
			_.$("popup-add-fast-task").style.display = "none";
			_.$("fastH1Name").innerHTML = "添加快速任务";

		}else {												  					//添加快速任务
			var value = Inputprompt.addcheckInputText("alertText4",_.$("fast-task-input-title"));
			if(value!==null&&value!=="")  {										//把任务添加到左侧任务列表中
				var childDiv =  renderTree(value,0);
				_.$("fast-task-list").appendChild(childDiv);

				var taskone = {
					"fatherId": "fast-task-list",
					"title": value,
					"pnode": _.$("fast-task-list"),
					"cnode": childDiv,
					"type" : "fast"
				};

				var newtask = new Tasklist(taskone);							//把任务添加到右侧任务列表中
				newtask.init(newtask);
				tasklistArr.push(newtask);

				_.$("popup-add-fast-task").style.display = "none";

				var fileTitleName = _.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML;
				_.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");
			}
		}
		Storage.TaskChange();
		clearPopup();
	},false);
		

	_.$("preSearch").addEventListener('click',function(){
		console.log("click!!!!");
		var value = Inputprompt.checkInputText("alertText",_.$("inputText"));
		if(value!==null&&value!=="") {
			clearAll();
			show(preOrder(rt),value,rt);
		}
		else Inputprompt.noteText("alertText","查询不能为空","#EC9B69");
	},false);
	

	
	_.$("inputText").addEventListener('focus', function(){
		console.log("focus");
         Inputprompt.noteText("alertText","请输入查询元素","#313F5F");
         inputTextFocus = true;
    }, true);
    _.$("inputText").addEventListener('blur',function(e){
    	Inputprompt.checkInputText("alertText",_.$("inputText"));
    	inputTextFocus = false;
    }, true);

    _.addEvent(_.$("endtime-sort"),"click",function() {
		
		console.log("endtime sort");
		var copyTasklistArr = [];
		var nowTasklist = _.$("task-ul-one").getElementsByTagName("li");
		for(var l in nowTasklist) {
			for(var k in tasklistArr) {
				if(nowTasklist[l] === tasklistArr[k].li) {
					copyTasklistArr.push(tasklistArr[k]);
					break;
				}
			}
		}

		if(_.$("endtime-sort").className === "ascending") {
			copyTasklistArr.sort(function(a, b) { 
		    	if(a.endTime >= b.endTime ) return 1;							//降序 
		    	else return -1;
		    });
			_.$("endtime-sort").className = "descending";
		}
		else {
			copyTasklistArr.sort(function(a, b) { 
			    	if(a.endTime <= b.endTime ) return 1;						//升序return b.endTime - a.endTime; 比较字符串形式不能用'-'
			    	else return -1;
		    });
			_.$("endtime-sort").className = "ascending";
		}
		while(nowTasklist.length) {
			_.$("task-ul-one").removeChild(nowTasklist[0]);
		}
		for(var j in copyTasklistArr) {
			console.log(copyTasklistArr[j].endTime);
			_.$("task-ul-one").appendChild(copyTasklistArr[j].li);
		}
	});
}

function numOfTasks(fileTitleName,operating) {
	var titleName = fileTitleName;
	var titleArr = titleName.split(/[(]{1}|[)]{1}/gi);
	console.log(titleArr);
	if(operating==="sub") {          //删除任务
		if(titleArr.length>=3){
			if((parseInt(titleArr[titleArr.length-2])-1)===0){
				fileTitleName=titleName.replace('<span>(1)</span>','');
			}else {
				 console.log("sub num");
				fileTitleName=titleName.replace((parseInt(titleArr[titleArr.length-2]))+'',(parseInt(titleArr[titleArr.length-2])-1)+'');
				console.log(fileTitleName);
			}
		}
	} else {                         //添加任务
		 console.log("add num");
		if(titleArr.length>=3)
			fileTitleName = titleName.replace((parseInt(titleArr[titleArr.length-2]))+'',(parseInt(titleArr[titleArr.length-2])+1)+'');
		else
			fileTitleName = titleName +"<span>("+1+")</span>";
		console.log(titleArr);
	}
	return fileTitleName;

}

/*--------------------------------------------------popup----------------------------------------------------------------------*/
/*-----------------------------------------------------------------------------------------------------------------------------*/

                    
function SuperPopup(o){
	this.btnName = o.btnName;
    this.idName = o.idName;
    this.className = o.className;
    this.headerName = o.headerName;
    this.confirmBtn = o.confirmBtn;
    this.textContent = o.textContent;
    if(o.h1Name!==undefined)
    	this.h1Name = o.h1Name;

}

SuperPopup.prototype.init = function(o){
	var div = document.createElement("div");
	div.setAttribute("id",o.idName);
	div.setAttribute("className",o.className);
	var div2 = document.createElement("div");
	div2.setAttribute("class","popup-board");
	var header = document.createElement("header");
	var h1 = document.createElement("h1");
	if(o.h1Name!==undefined) {
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

	if(o.idName !== "popup-task-more") {
		footer.appendChild(btn1);
		footer.appendChild(btn2);
		
	}
	div2.appendChild(footer);
	div.appendChild(div2);
	document.getElementsByTagName("body")[0].appendChild(div);
	o.AddListener.initClose(o);
};
function clearPopup() {
	_.$("text").value = todayDate;
	_.$("task-input-title").value = "";
	_.$("fast-task-input-title").value = "";
	_.$("task-input-content").value = "";
	_.$("calendar1").style.display = "none";
}
SuperPopup.prototype.AddListener = {
	initClose:function(popup) {
		_.$(popup.idName).addEventListener('click',function(e) {
			var hasClassName = /popup-close/gi; 
			if((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
				_.$(popup.idName).style.display = "none";
			}
		},false);
		_.$(popup.idName).addEventListener('click',function(e) {
			if(e.target.id ===popup.idName) {
				_.$(popup.idName).style.display = "none";
			}
		},false);
	}
};


/*=========================================================calender==========================================================*/

var todayDate;																//记录今日日期，用于刷新浮出层上显示的日期
var weekDay = ["日","一","二","三","四","五","六"];
function calendar() {

}
calendar.prototype = {
	init:function() {
		var today = new Date();
		today = this.getYMD(today);
		console.log(today.year,today.month+1,today.day,weekDay[today.weekday]);
		_.$("calendar-year").innerHTML = today.year;
		_.$("calendar-month").innerHTML = today.month+1;
		this.setCldYear(today.year);
		this.setCldMonth(today.month);	
		this.setCldDay(today.day);	
		today.month++;
		if(today.month<10) today.month="0"+today.month;
		if(today.year <10) today.year ="0"+today.year;
		if(today.day  <10) today.day  ="0"+today.day;
		todayDate =  today.year+"-"+today.month+"-"+today.day;				//记录今日日期，用于刷新浮出层上显示的日期

		this.selectDay(this);
		this.selectYear(this);
		this.selectMonth(this);
		this.showCld();
	},
	renderCalendar:function() {
		//渲染日历选择框--年、月

		var calendar = document.createElement("div");
		var selectBox= document.createElement("div");
		var span1    = document.createElement("span");
		var span2   = document.createElement("span");

		var yearBox  = document.createElement("div");
		var yearBoxbtn=document.createElement("div");
		var yearText = document.createElement("span");
		var yearSelectbtn=document.createElement("span");
		var yearSelect= document.createElement("div");
		var yearSelectUl=document.createElement("ul");

		var monthBox= document.createElement("div");
		var monthBoxbtn=document.createElement("div");
		var monthText = document.createElement("span");
		var monthSelectbtn=document.createElement("span");
		var monthSelect= document.createElement("div");
		var monthSelectUl=document.createElement("ul");

		calendar.setAttribute("class","calendar");
		calendar.setAttribute("id","calendar1");
		selectBox.setAttribute("class","calendar-select-box");
		span1.setAttribute("class","change-btn");
		span2.setAttribute("class","change-btn");

		yearBox.setAttribute("class","calendar-year-box");
		yearBoxbtn.setAttribute("class","calendar-year-btn  click-year-box");
		yearText.setAttribute("id","calendar-year");
		yearText.setAttribute("class","click-year-box");
		yearSelectbtn.setAttribute("class","select-btn click-year-box");
		yearSelect.setAttribute("class","calendar-year-select");
		yearSelectUl.setAttribute("id","calendar-year-select-ul");
		for(var i=0;i<20;i++) {
			var li = document.createElement("li");
			yearSelectUl.appendChild(li);
		}
		yearSelect.appendChild(yearSelectUl);
		yearBoxbtn.appendChild(yearText);
		yearBoxbtn.appendChild(yearSelectbtn);
		yearBox.appendChild(yearBoxbtn);
		yearBox.appendChild(yearSelect);

		monthBox.setAttribute("class","calendar-month-box");
		monthBoxbtn.setAttribute("class","calendar-month-btn click-month-box");
		monthText.setAttribute("id","calendar-month");
		monthText.setAttribute("class"," click-month-box");
		monthSelectbtn.setAttribute("class","select-btn  click-month-box");
		monthSelect.setAttribute("class","calendar-month-select");
		monthSelectUl.setAttribute("id","calendar-month-select-ul");
		for(var j=0;j<12;j++) {
			var li2 = document.createElement("li");
			monthSelectUl.appendChild(li2);
		}
		monthSelect.appendChild(monthSelectUl);
		monthBoxbtn.appendChild(monthText);
		monthBoxbtn.appendChild(monthSelectbtn);
		monthBox.appendChild(monthBoxbtn);
		monthBox.appendChild(monthSelect);

		selectBox.appendChild(span1);
		selectBox.appendChild(yearBox);
		selectBox.appendChild(monthBox);
		selectBox.appendChild(span2);

		// calendar.appendChild(input);
		calendar.appendChild(selectBox);
		_.$("cal-pos").appendChild(calendar);
		//渲染日历表头--星期
		var div       = document.createElement("div");
		var tableHead = document.createElement("table");
		var thead     = document.createElement("thead");
		var tr        = document.createElement("tr");
		for(var k=0;k<7;k++) {
			var th = document.createElement("th");
			th.innerHTML = weekDay[k];
			tr.appendChild(th);
		}
		div.setAttribute("id","calendar-cells");
		tableHead.setAttribute("class","tableHead");
		thead.appendChild(tr);
		tableHead.appendChild(thead);
		div.appendChild(tableHead);
		_.$("calendar1").appendChild(div);
	},
	setText:function(day) {
		var year = parseInt(_.$("calendar-year").innerHTML);
		var month = parseInt(_.$("calendar-month").innerHTML);
		    day   = parseInt(day);
		if(month<10) month="0"+month;
		if(year <10) year ="0"+year;
		if(day  <10) day  ="0"+day;
		_.$("text").value = year+"-"+month+"-"+day;
		if(_.$$("calendar")[0].style.display === "none") {
	 		_.$$("calendar")[0].style.display ="block";
	 	} else {
	 		_.$$("calendar")[0].style.display ="none";
	 	}
	},
	getYMD:function(today) {													//得到一个标准Date的本地时间的年月日
		var YMD = {};
		YMD.year  = today.getFullYear();
		YMD.month = today.getMonth();
		YMD.day   = today.getDate();
		YMD.weekday = today.getDay();
		return YMD;
	},
	setCldYear:function(year) {
		year = parseInt(year);
		_.$("calendar-year").innerHTML = year;
		var selectYearBox = _.$("calendar-year").parentNode.parentNode.getElementsByClassName('calendar-year-select')[0];
		var li = selectYearBox.getElementsByTagName("li");
		for(var i=0;i<li.length;i++) {
			li[i].style.backgroundColor = "#fff";
			li[i].innerHTML = year+i-9;
		}
		li[9].style.backgroundColor = "lightgreen";
		this.setCldDate();
	},
	setCldMonth:function(month) {
		month = parseInt(month);
		var year;
		if(month<0) {
			month=11;
			year = parseInt(_.$("calendar-year").innerHTML);
			this.setCldYear(year-1);
		}
		if(month>11) {
			month=0;
			year = parseInt(_.$("calendar-year").innerHTML);
			this.setCldYear(year+1);
		}
		_.$("calendar-month").innerHTML = month+1;
		var selectmonthBox = _.$("calendar-month").parentNode.parentNode.getElementsByClassName('calendar-month-select')[0];
		var li = selectmonthBox.getElementsByTagName("li");
		for(var i=0;i<li.length;i++) {
			li[i].style.backgroundColor = "#fff";
			li[i].innerHTML = i+1;
		}
		li[month].style.backgroundColor = "lightgreen";
		this.setCldDate();
	},
	setCldDay:function(day) {
		var td = document.getElementsByTagName("td");
		for(var i=0;i<td.length;i++) {
			if(td[i].innerHTML === day+"") {
				td[i].style.backgroundColor = "lightgreen";
				this.setText(day);
			}
		}
	},
	setCldDate:function() {
		var year = _.$("calendar-year").innerHTML;
		var month = _.$("calendar-month").innerHTML;
		console.log(year,month);
		var firstday = new Date(year,month-1,1);									//本月第一天
		var lastday  = new Date(year,month,0);  									//本月最后一天
		var first = this.getYMD(firstday);  
		var last  = this.getYMD(lastday);
		var daysInMonth = last.day;
		if(_.$("tableBody")){
			_.$("calendar-cells").removeChild(_.$("tableBody"));
		}
		function renderDate() {
			var table = document.createElement("table");
			var tbody = document.createElement("tbody");

			table.setAttribute("id","tableBody");      								 //用id
			var num = ( first.weekday + last.day )%7;
			var cells,rows,jsq=0;
			if(num === 0) {cells = first.weekday + last.day;}
			         else {cells = first.weekday + last.day + 7 - num;}
			                rows = cells/7;

			for(var i=0;i<rows;i++) {
				var tr = document.createElement("tr");
				for(var j=0;j<7;j++) {
					var td = document.createElement("td");
					if(jsq<first.weekday||jsq>=last.day+first.weekday) {
						td.innerHTML = "";
					} else {
						td.innerHTML = jsq-first.weekday+1;						
					}
					jsq++;
					tr.appendChild(td);
				}
				tbody.appendChild(tr);
			}	
			
			table.appendChild(tbody);
			_.$("calendar-cells").appendChild(table);
		}
		renderDate();
	},
	selectBoxDisplay:function(selectBox) {
		if(selectBox.style.display === "block") {
			selectBox.style.display = "none";
		}else {
			selectBox.style.display = "block";
		}
	},
	selectYear:function(calendar) {
		window.addEventListener("click",function(e) {
			var hasClassName = /click-year-box/gi;
			if((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase()) ) {
				var selectYearBox = _.$("calendar1").getElementsByClassName('calendar-year-select')[0];
				calendar.selectBoxDisplay(selectYearBox);
			}
		},false);
		_.$("calendar-year-select-ul").addEventListener("click",function(e) {
			if((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="li") {
				calendar.setCldYear(e.target.innerHTML);
				var selectYearBox = e.target.parentNode.parentNode;
				calendar.selectBoxDisplay(selectYearBox);
			}
		},false);
	},
	selectMonth:function(calendar) {
		window.addEventListener("click",function(e) {
			var className = /click-month-box/gi;
			if((e.target||e.srcElement)&&className.test(e.target.className.toLowerCase()) ) {
				var selectMonthBox = _.$("calendar1").getElementsByClassName('calendar-month-select')[0];
				calendar.selectBoxDisplay(selectMonthBox);
			}
		},false);
		window.addEventListener("click",function(e) {
			if((e.target||e.srcElement)&&e.target.className.toLowerCase()==="change-btn") {
				var changeMonth = document.getElementsByClassName('change-btn');
				var month;
				if(changeMonth[0]===e.target) {
					month = _.$("calendar-month").innerHTML;
					console.log("heihei",month);
					calendar.setCldMonth(parseInt(month)-2);
				}else {
					month = _.$("calendar-month").innerHTML;
					calendar.setCldMonth(parseInt(month));
				}
			}
		},false);
		_.$("calendar-month-select-ul").addEventListener("click",function(e) {
			if((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="li") {
				var month = e.target.innerHTML;
				calendar.setCldMonth(parseInt(month)-1);
				var selectMonthBox = e.target.parentNode.parentNode;
				calendar.selectBoxDisplay(selectMonthBox);
			}
		},false);
	},
	selectDay:function(calendar) {
		window.addEventListener("click",function(e) {
			if((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="td"){
				var td = document.getElementsByTagName("td");
				if(e.target.innerHTML !== "") {
					for(var i=0;i<td.length;i++) {
						td[i].style.backgroundColor = "";
					}
					e.target.style.backgroundColor = "lightgreen";
					calendar.setText(e.target.innerHTML);
				}
				
	
			}
		},false);
		window.addEventListener("mouseover",function(e) {								//空白hover不变色
			if((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="td"){
			 	if(e.target.innerHTML === "") {
			 		e.target.style.backgroundColor = "#fff";
			 	}
			}
		},false);
	},
	showCld:function() {
		window.addEventListener("click",function(e) {									//空白hover不变色
			if((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="input"){
			 	if(_.$$("calendar")[0].style.display === "none") {
			 		_.$$("calendar")[0].style.display ="block";
			 	} else {
			 		_.$$("calendar")[0].style.display ="none";
			 	}
			}
		},false);
	}
};

/*=======================================================================task-list==================================================*/


var tasklistArr = [];																	//储存添加到右侧的任务条 创建的Tasklist
function Tasklist(task) {
	this.fatherId=task.fatherId;
	this.title = task.title;
	this.cnode = task.cnode;															//记录左侧任务本身节点
	this.pnode = task.pnode;															//记录左侧任务的父亲节点
	this.content = task.content;
	this.endTime = task.endTime;
	this.type = task.type;
	this.li = null;																		//存储添加到右侧的任务条

}
Tasklist.prototype = {
	init:function(task) {
		this.li = this.renderTaskList(task);
	},
	renderTaskList:function(task) {
		var li = document.createElement("li");
		var dragsign = document.createElement("div");
		var notdone = document.createElement("div");
		var taskTitle = document.createElement("span");
		var i = document.createElement("i");
		var write = document.createElement("div");
		var i2 = document.createElement("i");
		var endTime = document.createElement("span");

		li.setAttribute("class","task-list");
		li.setAttribute("draggable","true");
		dragsign.setAttribute("class","task-list-dragsign");
		notdone.setAttribute("class","task-list-notdone");
		taskTitle.setAttribute("class","task-list-title");
		write.setAttribute("class","task-list-write");
		
		if(task.type === "normal") {
			i.setAttribute("class","fa fa-chevron-right");
			i.setAttribute("aria-hidden","true");
			i2.setAttribute("class","fa fa-pencil-square-o fa-lg");
			endTime.setAttribute("class","task-list-endtime");
			endTime.innerHTML = task.endTime;
		}
		else
			i2.setAttribute("class","fa fa-pencil-square-o fa-lg fast-change-list");
		i2.setAttribute("aria-hidden","true");
		taskTitle.innerHTML = task.title;
		taskTitle.appendChild(i);
		write.appendChild(i2);
		li.appendChild(dragsign);
		li.appendChild(notdone);
		li.appendChild(taskTitle);
		li.appendChild(endTime);
		li.appendChild(write);
		if(task.type === "normal")
			_.$("task-ul-one").appendChild(li);
		else
			_.$("task-ul-fast").appendChild(li);

		return li;
	}

};
var Tasklist = (function(mod){
	console.log("run Tasklist");
	mod.taskDoneHandle = function(e) {
		console.log("taskDoneHandle"); 
		if(e.target.className === "task-list-notdone") {
			e.target.className = "task-list-done";
			e.target.parentNode.className = "task-list task-list-del";

			setTimeout(function() {
				e.target.parentNode.parentNode.removeChild(e.target.parentNode );		//删除右侧任务条
				for(var i=0;i<tasklistArr.length;i++) {
					if(e.target.parentNode === tasklistArr[i].li) {
						tasklistArr[i].pnode.removeChild(tasklistArr[i].cnode);			//删除左侧任务条

																						//文件夹内部删除任务，文件夹后面的数字-1
					var fileTitleName = tasklistArr[i].pnode.getElementsByClassName("tree-title")[0].innerHTML;
					tasklistArr[i].pnode.getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"sub");

					tasklistArr.splice(i,1);											//留在这里
					Storage.TaskChange();
					}
				}
								
			},800);
		}
	};
	mod.taskMoreHandle = function(e) {
		
		if(e.target.className === "task-list-title") {
			console.log("lalalala");
			for(var i=0;i<tasklistArr.length;i++) {
					if(e.target.parentNode === tasklistArr[i].li) {
						console.log(tasklistArr[i].endTime);
						_.$("popup-task-more").getElementsByTagName("h1")[0].innerHTML = tasklistArr[i].title;
						_.$("popup-task-more").getElementsByTagName("section")[0].innerHTML = "<p>"+tasklistArr[i].content+"</p>";
						timeCountdown(tasklistArr[i].endTime);
					}
				}
		}
	};
	return mod;
})(Tasklist);
/*=====================================================================倒计时==================================================*/
var doCountdown;																		//在function timeCountdoen()外部声明。
function timeCountdown(endTime) {

																						//每次更新endTime日期后，清除上一次setInterval;
	if(doCountdown) window.clearInterval(doCountdown);
	var endTimeArr = endTime.split("-");
	var end = new Date(endTimeArr[0],endTimeArr[1]-1,endTimeArr[2],0,0,0);
	console.log(end);
	setCountdown();
	function setCountdown() {
		var start = new Date();
		var elapsed = Math.abs(end.getTime() - start.getTime());
		var days =  Math.floor(elapsed/ (24 * 3600 * 1000));							//1天 = 24小时*60分*60秒*1000毫秒
		var hours = Math.floor((elapsed%(24 * 3600 * 1000))/(3600*1000)); 				//1时 = 60分*60秒*1000毫秒
		var minutes  =Math.floor((elapsed%(24 * 3600 * 1000)%(3600*1000))/(60*1000));  	//1分 = 60秒*1000毫秒
		var seconds  =Math.floor((elapsed%(24 * 3600 * 1000)%(3600*1000)%(60*1000))/1000); //1秒 = 1000毫秒
		var returnText;
		if(elapsed<0) {
			 window.clearInterval(doCountdown);
		} else if(end.getTime()>start.getTime()) {
			_.$("popup-task-more").getElementsByTagName("footer")[0].innerHTML =  "截止日期"+endTimeArr[0]+"-"+endTimeArr[1]+"-"+endTimeArr[2]+
			"<br>还有"+days+"天"+hours+"小时"+minutes+"分"+seconds+"秒";
		} else {
			_.$("popup-task-more").getElementsByTagName("footer")[0].innerHTML  =  "截止日期"+endTimeArr[0]+"-"+endTimeArr[1]+"-"+endTimeArr[2]+
			"<br>已过去"+days+"天"+hours+"小时"+minutes+"分"+seconds+"秒";
		}
	}
	doCountdown = window.setInterval(setCountdown, 1000);

}

/*=======================================================================drag==================================================*/
function Drag() {
	var dragged;
}
Drag.prototype = {
	init:function() {
	//为每个任务列表组<div class="task-ul">添加有效放置的事件代理
	_.$.delegate(_.$$("right-section")[0],"ul", "dragover", this.draginHandle);
	_.$.delegate(_.$$("right-section")[0],"li", "dragover", this.draginHandle);
	//在创建元素的时候为所有的<li class="task-list task-list">设置为可拖动元素
	// _.$.delegate(_.$$("right-section")[0],"li", "focus", this.draggableHandle);
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
		if(hasClassName.test(e.target.className.toLowerCase())) {
			e.preventDefault();
		}
	},

	draggableHandle:function(e) {
		var hasClassName = /task-list/gi;
		if(hasClassName.test(e.target.className.toLowerCase())) {
			e.target.draggable = true;
		}
	},

	/*拖放某元素时，依次触发时间入下：dragstart drag dragend*/
	dragstartHandle:function(e) {//拖拽开始瞬间触发
		var hasClassName = /task-list/gi;
		if((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
			console.log("dragstart");
			console.log("dragstart:",e.clientX,e.clientY);
			dragged = e.target;//记录拖动原件
			e.target.style.opacity = "1";
			// e.target.style.backgroundColor = "red";
		}
	},

	dragHandle:function (e) {//拖拽的过程中实时触发
		var hasClassName = /task-list/gi;
		if((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
			console.log("drag");
			e.target.className = "dragging-section";//原件拖动时，在元容器中消失设为display ?????为什么没有效果
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

    /*元素被拖放到有效目标位置时，依次触发事件：dragenter dragover dragleave/drop*/
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
		var drapOn = e.target;//drapOn为可放置目标元素
		var hasClassName = /task-list/gi;
		if(hasClassName.test(e.target.className.toLowerCase())) {
			console.log("apreOrder");
			drapOn = e.target.parentNode;
		}

		// console.log(e.clientX,e.clientY,e.target.offsetLeft,e.target.offsetHeight,e.target.offsetTop,e.target.offsetParent,drapOn.offsetTop);
		//e.target.offsetParent是e.target元素上面最近的已定位的元素

		var top = e.clientY - drapOn.offsetTop;  									//可拖放元素距离可放置目标元素最顶的距离
		var num = Math.floor(top/45);            									//num为鼠标停止上方的小方块个数
		var allnum =  drapOn.getElementsByClassName("task-list");//
		if(num>allnum.length+1)
			num = allnum.length;

		drapOn.style.background = "";
	    dragged.parentNode.removeChild( dragged );
		drapOn.insertBefore(dragged,allnum[num]);

	   																				// e.preventDefault();阻止默认动作（如打开一些元素的链接）
	}
};


/*========================================================== Inputprompt ==================================================*/
var treeSearch;
var Inputprompt = {
    addnoteText: function(id,innerText,color) {
		var alertText = _.$(id);
		alertText.innerHTML = innerText;
		alertText.style.color = color;
	},
	noteText:function(id,innerText,color) {                               			 //直接使用
		var alertText = _.$(id);
		console.log(alertText);
		alertText.style.display = "inline-block";
		alertText.innerHTML = innerText;
		alertText.style.color = color;
		if(treeSearch) {
			window.clearTimeout(treeSearch);
			console.log("clean");
		}
		// treeSearch = window.setTimeout(this.HideAlertText,2000);          		//为什么一加参数就自动执行了
		treeSearch = window.setTimeout(function() {							 		//用匿名函数 不会立即执行
			console.log(id);
			var alertText = _.$(id);
			alertText.style.display = "none";
		},2000);
		console.log("delay");
		
	},
	trim: function(e) {
		console.log(e);
		var trimReg = /^\s+|\s+_.$/g;
		return e.value.replace(trimReg,"");
	},
	checkInputText: function(id,e) {                                         
		var value = this.trim(e);                                            		//原始输入去除首尾空格
		if(value===null||value==="") {
			this.noteText(id,"查询不能为空","#EC9B69");
		} 
		return value;
	},
    addcheckInputText: function(id,e) {                                       		
		var value = this.trim(e);        
		if(value===null||value==="") {
			this.addnoteText(id,"输入任务标题不能为空","#EC9B69");
		} else {
			this.addnoteText(id,"","#376337");
		}
		return value;
	}
};
/*========================================================== localStorage ==================================================*/
var Storage = (function(mod) {
	mod.TaskChange = function() {													//删除、添加、编辑快速任务和普通任务公用一个
		allTasks.list = [];
		for(var i=0;i<tasklistArr.length;i++) {
			allTasks.list.push(tasklistArr[i]);
		}
		localStorage.setItem('allTasks', JSON.stringify(allTasks));
	};
	mod.treeNodeIdChange = function(jsq) {
		treeClassifyIdArr.list = [];							                 	//将id数组中的元素添加到对象中
		for(var j=0;j<d.fatherIdArr.length;j++) {
			treeClassifyIdArr.list.push(d.fatherIdArr[j]);
		}
		localStorage.setItem('treeClassify', JSON.stringify(treeClassifyIdArr));  	//将更新的treeClassifyIdArr存入设置的值treeClassify中
		localStorage.setItem('d.fatherIdjsq', d.fatherIdjsq);                       //将更新的d.fatherIdjsq存入设置的值d.fatherIdjsq中

	};


	mod.addClassifySto = function(choseDiv,value) {
		console.log("addClassifySto");
		var jsq = 0;
		preOrderAdd(d.treedata);
		function preOrderAdd(treeframe) {
			for(var key in treeframe) {
				if(jsq===d.fatherIdArr.indexOf(choseDiv.id)) {  					//找到被选中的结点
					d.fatherIdArr.push("fatherId"+d.fatherIdjsq); 					//先在数组中添加新的id，使新的结点渲染到页面上
					treeframe[key][value] = {};               						//更新树状结构，添加结点(为记录树的结构的对象添加属性)
					preOrder2(treeframe[key]);
					break;
				}
				jsq++;
				if(typeof treeframe[key] === "object") {
					preOrderAdd(treeframe[key]);
				}
			}
		}
		function preOrder2(treeframe) {          									//jsq记录被选中结点的的最后一个子节点
			for(var key in treeframe) {
				jsq++;
				if(typeof treeframe[key] === "object") {
					preOrder2(treeframe[key]);
				}
			}
		}
		localStorage.setItem('treeframe', JSON.stringify(d.treedata));				//将更新的treedata存入设置的值treeframe中
		return jsq;
	};

	mod.delClassifySto = function(choseDiv) {
		// tree
		console.log("delClassifySto");
		var jsq = 0;
		preOrderDel(d.treedata);
		function preOrderDel(treeframe) {
			for(var key in treeframe) {
				if(jsq===d.fatherIdArr.indexOf(choseDiv.id)) {
					delete treeframe[key];
					var pos = treeClassifyIdArr.list.indexOf(choseDiv.id);
					treeClassifyIdArr.list.splice(pos,1);
					d.fatherIdArr.splice(jsq, 1);
					break;
				}
				jsq++;
				if(typeof treeframe[key] === "object") {
					preOrderDel(treeframe[key]);
				}
			}
		}

		localStorage.setItem('treeframe', JSON.stringify(d.treedata));
		return jsq;

	};
	return mod;

})(Storage||{});
function renderData() {
																					//设定的初始普通任务
	var value1 = ["普通任务列表","添加任务","添加新分类","点击对勾完成任务"];
	var content1 = ["可以设定任务的名称、任务描述、任务截止时间","通过左侧自定义分类的加号图标添加任务","通过左侧自定义分类的文件夹图标添加新分类","点击对勾完成任务"];
	var endTime1 = ["2016-05-20","2016-06-20","2017-07-20","2018-08-20"];
	for(var i=0;i<value1.length;i++) {
		var value   = value1[i];
		var content = content1[i];
		var endTime = endTime1[i];
		var node = new Node(null,value,0,null,null);
		signNode.amount = 4;
		signNode.childNode.push(node);
		node.FatherNode = signNode;
		var childDiv =  renderTree(value,0);
		node.data = childDiv;
		var hahah = _.$("fatherId1");
		console.log(hahah);
		hahah.appendChild(childDiv);												//新节点加入到选中节点中
		var taskone = {
			"fatherId":"fatherId1",
			"title": value1[i],
			"pnode": hahah,
			"cnode": childDiv,
			"content": content,
			"endTime": endTime,
			"type" : "normal"
		};
		var newtask = new Tasklist(taskone);										//把任务添加到右侧任务列表中
		newtask.init(newtask);
		tasklistArr.push(newtask);
	}


	//设定的初始快速任务
	var value2 = ["快速任务列表","点击左下角的圆圈快速添加任务","可以用简短的一句话来描述任务"];

	for(var j=0;j<value2.length;j++) {
		var valuei = value2[j];
		var childDivi =  renderTree(valuei,0);
		_.$("fast-task-list").appendChild(childDivi);

		var tasktwo = {
			"fatherId":"fast-task-list",
			"title": valuei,
			"pnode": _.$("fast-task-list"),
			"cnode": childDivi,
			"type" : "fast"
		};
		var newtask2 = new Tasklist(tasktwo);										//把任务添加到右侧任务列表中
		newtask2.init(newtask2);
		tasklistArr.push(newtask2);
	}
	_.$("fatherId1").getElementsByClassName("tree-title")[0].innerHTML+="<span>(4)</span>";
	_.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML+="<span>(3)</span>";

}


var treeframe;
var allTasks = {
    'list' : []
};
var treeClassifyIdArr = {
	"list" : []
};
var  storagetree = function() {
	if(!localStorage.getItem('treeframe')) {
		console.log("!!!!!localStorage.getItem('treeframe')");					 	//之间没有加载过，正常加载
	  	initTree();
	} else {
	  	gettreeframeStorage();	 
	}
	function gettreeframeStorage() {
	 	var restoredtreeframe = JSON.parse(localStorage.getItem('treeframe'));
		console.log("=========================================storage===========================================================");
		console.log(restoredtreeframe);
		d.treedata = restoredtreeframe;

		if(localStorage.getItem('treeClassify')) {
			
			var restoredfather = JSON.parse(localStorage.getItem('treeClassify'));
			console.log(restoredfather.list);
			d.fatherIdArr = restoredfather.list;
		}
		
		d.fatherIdjsq = localStorage.getItem('d.fatherIdjsq');
		initTree();
	}
};




var  storage = function() {
	if(localStorage.getItem('treeClassify')) {
	  	getTreeClassifyStorage();
	}
	if(!localStorage.getItem('allTasks')) {
		console.log("!!!!!localStorage.getItem('allTasks')");						//之间没有加载过，正常加载
		renderData();
	  	
	} else {
		console.log(" localStorage.getItem('allTasks')");							//有加载过，加载储存的，然后添加listener
	  	getTaskStorage();
	 
	}
	if(localStorage.getItem('color')) {
		document.getElementsByTagName('body')[0].className = localStorage.getItem('color');
	}
	if(localStorage.getItem('font')) {
		document.getElementsByTagName('html')[0].className = localStorage.getItem('font');
	}
	
	
	
	function getTreeClassifyStorage() {
		var restoredfather = JSON.parse(localStorage.getItem('treeClassify'));
		console.log("========================================= storage treeClassify ======================================================");
		console.log(restoredfather.list);
		d.fatherIdArr = restoredfather.list;
	}
	
	function getTaskStorage() {
	  	// 然后是如何转换通过 JSON.stringify 生成的字符串，该字符串以 JSON 格式保存在 localStorage 里
		var restoredallTasks = JSON.parse(localStorage.getItem('allTasks'));
		console.log("========================================= storage Tasklist ===================================================");
		console.log(restoredallTasks);
		while(_.$("task-ul-fast").getElementsByTagName("li").length) {
			_.$("task-ul-fast").removeChild(nowTasklist[0]);
		}
		while(_.$("task-ul-one").getElementsByTagName("li").length) {
			_.$("task-ul-one").removeChild(nowTasklist[0]);
		}
		var childDiv;
		for(var i=0;i<restoredallTasks.list.length;i++) {
			console.log(restoredallTasks.list[i]);
			if(restoredallTasks.list[i].type === "fast") {
				childDiv =  renderTree(restoredallTasks.list[i].title,0);
				_.$(restoredallTasks.list[i].fatherId).appendChild(childDiv);
				restoredallTasks.list[i].pnode = _.$(restoredallTasks.list[i].fatherId);
				restoredallTasks.list[i].cnode = childDiv;
				var fileTitleName = _.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML;
				_.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");
			}
			else {
				var node = new Node(null,restoredallTasks.list[i].title,0,null,null);
				childDiv =  renderTree(restoredallTasks.list[i].title,0);
				_.$(restoredallTasks.list[i].fatherId).appendChild(childDiv);
				restoredallTasks.list[i].pnode = _.$(restoredallTasks.list[i].fatherId);
				restoredallTasks.list[i].cnode = childDiv;
				choseDiv = _.$(restoredallTasks.list[i].fatherId);
				Order(rt);															//遍历找到选中节点 
				
			}

			var newtask2 = new Tasklist(restoredallTasks.list[i]);					//把任务添加到右侧任务列表中
			newtask2.init(newtask2);
			tasklistArr.push(newtask2);
		}//for

		function Order(rt) {
			if(rt.data===choseDiv) {												//选中节点图标更新
				rt.childNode.push(node);
				node.FatherNode = rt;
				rt.data.firstChild.style.display = "inline-block";
				rt.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
				node.data = childDiv;
				console.log(rt.data.id);
																					//文件夹内部添加任务，文件夹后面的数字+1
				var fileTitleName = rt.data.getElementsByClassName("tree-title")[0].innerHTML;
				rt.data.getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");

				for(var i=0;i<rt.childNode.length;i++) {							//选中节点子节点展开
					rt.childNode[i].data.style.display = "block";
				}
				return;
			}
			if(rt!==null) {
				for(var j=0;j<rt.childNode.length;j++) {
					Order(rt.childNode[j]);
				}
			}
		}//Order
	}//setStyles

};

function initAll() {
	storagetree();																	//要在浮出层之前加载
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
	
	initAddListener();

	var calendarOne = new calendar();
	calendarOne.renderCalendar();
	calendarOne.init();

	var dragg= new Drag();
 	dragg.init();

	storage();
	

}
return {
    initAll: initAll
};
});