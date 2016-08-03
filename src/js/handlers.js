/**
 * @file calendar.js 任务菜单、任务列表的操作及储存
 * @author qucheng(qucheng_se@163.com)
 * 
 */
define(['util', 'data','calendar','popup','drag','countdown','inputprompt'], function(_, d,cal,pop,drag,countdown,inp) {

	/*-------------------------------------------------------------tree----------------------------------------------------------*/
	// 储存创建的node节点
	var traverse = [];
	// 储存遍历的div节点												
	var queue = [];
	// 储存搜索到div节点 用于清空样式 													
	var search = [];

	/**
	 * [Node 多叉树结点的构造函数]
	 * @param {Object} data       [当前结点的NamedNodeMap]
	 * @param {String} text       [当前结点标题名称]
	 * @param {Number} amount     [孩子结点个数]
	 * @param {Array.<Node>} childNode  [孩子结点]
	 * @param {Node}   FatherNode [父亲结点]
	 */
	function Node(data,text,amount,childNode,FatherNode) { 
		this.data = data; 		  					 
		this.text = text;		   					 
		this.amount= amount;       					 
		this.childNode =[];   	   					 
		this.FatherNode = FatherNode;
	}
	var rt;
	/**
	 * [initTree 生成树形菜单]
	 * @return {[null]} [description]
	 */
	function initTree() {
		rt = createTree(d.treedata);
		order(rt,_.$("root"));
		console.log(rt);
	}
	// 记录添加初始数据的结点
	var signNode;

	/**
	 * [createTree 读取treedata并创建多叉树]
	 * @param  {Object} treedata [树的结构]
	 * @return {Node}            [树的根节点]
	 */
	function createTree(treedata) {										
		var root;
		console.log(treedata.length);
		createNode(treedata);
		function createNode(treedata) {
			for(var key in treedata) {
				var num = NumOfAttributes(treedata[key]);
				console.log(num,key,treedata[key]);
				var node= new Node(null,key,num,null,null);
				if (key === "任务列表") root = node;
				if (key === "使用说明")
				signNode =node;
				traverse.push(node);

				if (typeof treedata[key] === "object") {
					createNode(treedata[key]);
				}
			}
			
		}
		function addTree() {
			if (traverse.length!==0) {
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

	/**
	 * [NumOfAttributes 当前结点属性的个数]
	 * @param  {Object} data [当前结点]
	 * @return {Number}      [属性的个数]
	 */
	function NumOfAttributes(data) {
		num=0;
		for(var key in data) {
			if (data.hasOwnProperty(key)) {
				num++;
			}
		}
		return num;
	}

	/**
	 * [renderTree 渲染多叉树]
	 * @param  {String} value     [当前结点标题名称]
	 * @param  {[type]} childType [结点的类型：任务分类/任务]
	 * @return {Object}           [渲染后的结点div]
	 */
	function renderTree(value,childType) {
			var childDiv = document.createElement("div");
			var span  = document.createElement("span");
			var div  = document.createElement("div");
			var div2 = document.createElement("div");
			var i = document.createElement("i");
			var deletSign       = document.createElement("i");
			var addClassifySign = document.createElement("i");
			var addTaskSign     = document.createElement("i");

			// 添加新任务
			if (childType===0){
				i.setAttribute("class","fa fa-file-text-o tree-title-sign");
				i.style.display = "inline-block";
				span.innerHTML = value;
				span.setAttribute("class","tree-title tree-title-task");
				deletSign.setAttribute("class","fa fa-trash-o tree-delet");
				childDiv.setAttribute("class","child");
				childDiv.style.display = "block";
				childDiv.value = value;
				div.setAttribute("class","i-collect");
				childDiv.appendChild(i);
				div2.setAttribute("class","tree-title-box");
				div2.appendChild(span);
				div2.appendChild(div);
				childDiv.appendChild(div2);

			}
			// 添加新分类
			else {   												
				i.setAttribute("class","fa fa-folder-open-o tree-title-sign");
				i.style.display = "inline-block";
				span.innerHTML = value;
				span.setAttribute("class","tree-title tree-title-classify");
				addTaskSign.setAttribute("class","fa fa-plus-circle task-add");
				addClassifySign.setAttribute("class","fa fa-folder-o tree-add");
				deletSign.setAttribute("class","fa fa-trash-o tree-delet");
				childDiv.setAttribute("class","child");
				childDiv.style.display = "block";
				childDiv.value = value;	
				childDiv.setAttribute("id",d.fatherIdArr[d.fatherIdnum++]);
				div.setAttribute("class","i-collect");
				if (value == "任务列表")
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

	/**
	 * [order 先序遍历树：生成页面]
	 * @param  {Node} rt        [当前结点]
	 * @param  {Node} parentDiv [当前结点的父结点]
	 * @return {[null]}           [description]
	 */
	function order(rt,parentDiv) {
		if (rt!==null) {
			value = rt.text;
			var childDiv = renderTree(value);
			rt.data = childDiv;
			parentDiv.appendChild(childDiv);
		}
		if (rt.childNode.length>=0) {
			rt.data.firstChild.style.display = "inline-block";
		}
		for(var i=0;i<rt.childNode.length;i++) {
			order(rt.childNode[i],childDiv);
		}
	}

	/**
	 * [clearAll 停止遍历、搜索]
	 * @return {[null]} [description]
	 */
	function clearAll() {
		// 已搜索到的元素恢复为原样式
		function cleanShow(search) {
			while(search.length>0) {
				search.shift().firstChild.nextSibling.id ="";
			}
		}
	 	queue = [];
	 	cleanShow(search);
	}

	/**
	 * [show 遍历过程中展示满足搜索的元素]
	 * @param  {[type]} queue [description]
	 * @param  {[type]} value [description]
	 * @param  {[type]} rt    [description]
	 * @return {[type]}       [description]
	 */
	function show(queue,value,rt) {
		var count = 0;
		var findoutDiv = [];
		console.log(typeof(value));
		while(queue.length>0) {
			var div = queue.shift();
			search.push(div);
			if (findoutDiv.length>0) {
				for(var i=0;i<findoutDiv.length;i++) {
					var findDiv = findoutDiv[i];
					Order(rt);
				}
			}// if (findoutDiv.length>0)
			var valueMatch = new RegExp(value, 'gi');
			// 搜索到元素
			if (value!==null&&valueMatch.test(div.value.toString())) {
				div.firstChild.nextSibling.className = "tree-title-box highlight";
				findoutDiv.push(div);
				count++;
			}
		}// while
		
		if (value!==null) {
			if (count===0) inp.Inputprompt.noteText("alertText","没有查询到元素","green");
	    	else inp.Inputprompt.noteText("alertText","查询到"+count+"个元素","green");
		}
		function Order(rt) {
			if (rt.data===findDiv){        
				if (!rt.FatherNode) return;
				rt.FatherNode.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
				for(var j=0;j<rt.FatherNode.childNode.length;j++) {
			       	rt.FatherNode.childNode[j].data.style.display = "block";
				}
				var grandeNode = rt.FatherNode;
				//有父节点，父节点展开
				while(grandeNode.FatherNode!==null) {
					grandeNode.FatherNode.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
					for(j=0;j<grandeNode.FatherNode.childNode.length;j++) {
				       	grandeNode.FatherNode.childNode[j].data.style.display = "block";
					}
					grandeNode = grandeNode.FatherNode;
				}
				return;
			}
			if (rt!==null) {
				for(var k=0;k<rt.childNode.length;k++) {
					Order(rt.childNode[k]);
				}
			}
		}// Order(rt)

	}

	/**
	 * [preOrder 先序遍历]
	 * @param  {Node} rt [当前结点]
	 * @return {Array.<Node>}    [按先序遍历的结点存储的结点数组]
	 */
	function preOrder(rt) {
		if (rt!==null) {
			queue.push(rt.data);
			for(var i=0;i<rt.childNode.length;i++) {
				preOrder(rt.childNode[i]);
			}
		}
		return queue;
	}
	// 当前选择的div结点
	var choseDiv;
	// 搜索框成为焦点
	var inputTextFocus;
	// 当前选择的右侧任务条
	var nowChangeli;

	/**
	 * [initAddListener 添加监听事件]
	 * @return {[null]} [description]
	 */
	function initAddListener() {

		_.$.delegate(_.$("tree"),"i", "click", clickHandle);
		_.$.delegate(_.$("task-ul-one"),"span", "click", clickHandle);
		_.addEvent(_.$("fast-add-task-btn"), "click", clickHandle);
		_.addEvent(_.$("fast-task-list"), "click", showOrClose);
		_.$.delegate(_.$$("right-section")[0],"i", "click", clickHandle);
		_.$.delegate(_.$("task-ul-one"),"span", "click", Tasklist.taskMoreHandle);
		_.$.delegate(_.$$("right-section")[0],"div", "click", Tasklist.taskDoneHandle);

		_.addEvent(_.$$("theme-color")[0],"click",function(e) {
			if (e.target.nodeName.toLowerCase() === "button") {
				console.log(e.target.className);
				document.getElementsByTagName('body')[0].className = "theme-" + e.target.className;
				_.$$("settings")[0].style.display = "none";
				localStorage.setItem('color',"theme-" + e.target.className );
			}
		});
		_.addEvent(_.$$("font-size")[0],"click",function(e) {
			if (e.target.nodeName.toLowerCase() === "button") {
				console.log(e.target.className);
				document.getElementsByTagName('html')[0].className = "theme-" + e.target.className;
				_.$$("settings")[0].style.display = "none";
				localStorage.setItem('font',"theme-" + e.target.className );
			}
		});
		_.addEvent(_.$$("fa fa-cog fa-2x")[0],"click",function(e) {
			if (e.target.nodeName.toLowerCase() === "i") {
				console.log("focus");
				if (_.$$("settings")[0].style.display === "block")
					_.$$("settings")[0].style.display = "none";
				else
					_.$$("settings")[0].style.display = "block";
			}
		});

		function showOrClose(e) {
			if (e.target.className ==="fa fa-bolt tree-title-sign") {
				console.log("preOrderHHA");
				var childs = e.target.parentNode.getElementsByClassName("child");
				console.log(childs.length);
				for(var i=0;i<childs.length;i++) {
					if (childs[i].style.display==="block")
						childs[i].style.display = "none";
					else
						childs[i].style.display = "block";
				}
			}
		}
		
		/**
		 * [clickHandle 选择点击的图标所对应的浮出层]
		 * @param  {[type]} e [description]
		 * @return {[type]}   [description]
		 */
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

			if (arrMatch[e.target.className.toLowerCase()]) {
				var popupId = arrMatch[e.target.className.toLowerCase()];
				console.log(e.target);
				console.log(popupId);
				pop.clearPopup();
				_.$(popupId).style.display = "flex";
				
			}

			if (e.target.className.toLowerCase() === "fa fa-pencil-square-o fa-lg") {
				
				for(var i=0;i<tasklistArr.length;i++) {
					if (e.target.parentNode.parentNode===tasklistArr[i].li) {
						nowChangeli = tasklistArr[i];
						_.$("text").value = tasklistArr[i].endTime;
						_.$("task-input-title").value = tasklistArr[i].title;
						_.$("task-input-content").value = tasklistArr[i].content;
						_.$("popup-add-task").getElementsByTagName("h1")[0].innerHTML = "编辑任务";
						
					}
				}

			}
			else if (e.target.className.toLowerCase() === "fa fa-pencil-square-o fa-lg fast-change-list") {
				for(var k=0;k<tasklistArr.length;k++) {
					if (e.target.parentNode.parentNode===tasklistArr[k].li) {
						nowChangeli = tasklistArr[k];
						
						_.$("fast-task-input-title").value = tasklistArr[k].title;
			
						_.$("popup-add-fast-task").getElementsByTagName("h1")[0].innerHTML = "编辑快速任务";	
					}
				}
			}

				// 添加任务时的浮出层内容界面
				var content = _.$("popup-add-task-content");
				content.parentNode.removeChild(content);
				_.$("popup-add-task").getElementsByTagName("section")[0].appendChild(content);
				content.style.display = "block";
		
			}

		_.$("tree").addEventListener('click',function(e){
	       if ((e.target||e.srcElement)&&(e.target.className==="fa fa-folder-open-o tree-title-sign"||e.target.className==="fa fa-folder-open tree-title-sign")) {
		       	var treeSign= e.target;
		       	var len;
		       	Order(rt);
		       	console.log(len);
		       	if (len) {
		       		if (treeSign.className==="tree-title-box") {
			       		treeSign =treeSign.previousSibling;
			       	}
			       	if (treeSign.className==="fa fa-folder-open-o tree-title-sign") {
			       		treeSign.className = "fa fa-folder-open tree-title-sign";
			   		}else if (treeSign.className === "fa fa-folder-open tree-title-sign") {
			   			treeSign.className = "fa fa-folder-open-o tree-title-sign";
			   		}	
		       	}
		      
		    }
		    else if ((e.target||e.srcElement)&&(e.target.className==="tree-title tree-title-classify")) {
		    	console.log("title click");
		    	var focusNode = e.target.parentNode.parentNode;
		    	if (e.target.innerHTML ==="任务列表")
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
		     		// 找到选中节点 更改子元素display
					if (rt.data===treeSign.parentNode){
						len = rt.childNode.length;
						for(var i=0;i<rt.childNode.length;i++) {
							if (rt.childNode[i].data.style.display === "block")
					       	   rt.childNode[i].data.style.display = "none";
					       	else rt.childNode[i].data.style.display = "block";
						}
					}
					if (rt!==null) {
						for(var k=0;k<rt.childNode.length;k++) {
							Order(rt.childNode[k]);
						}
					}
				}
				function showLi(node) {
		    		console.log(node);
					var childs = node.getElementsByClassName("child");
					if (childs.length > 0) {
						for(var j=0;j<childs.length;j++) {
							showLi(childs[j]);
						}
					}else {
						for(var i=0;i<tasklistArr.length;i++) {
							if (node === tasklistArr[i].cnode) {
								_.$("task-ul-one").appendChild(tasklistArr[i].li);
								break;
							}
						}
					}
						
				}
		},false);



		_.$("tree").addEventListener('click',function(e){
			if ((e.target||e.srcElement)&&e.target.className==="fa fa-trash-o tree-delet") {
				choseDiv = e.target.parentNode.parentNode.parentNode;
				if (choseDiv.getElementsByClassName("tree-title-task").length>0) {
					console.log("文件夹里还有任务未完成");
					_.$("popup-del-classify").getElementsByTagName("section")[0].innerHTML = "此分类里还有任务未完成<br>请先完成任务后再删除";
					_.$("popup-del-classify").getElementsByTagName("footer")[0].style.display  = "none";			
				} else {

					_.$("popup-del-classify").getElementsByTagName("section")[0].innerHTML = "确定删除分类及分类中的全部任务";
					_.$("popup-del-classify").getElementsByTagName("footer")[0].style.display  = "block";
				_.$("del-classify-btn").addEventListener('click',function(){

				console.log("delet");
				clearAll();
				Order(rt);
				// 从存储树的结构中删除节点，遍历多叉树找到节点位置
				function Order(rt) {
					if (rt.data===choseDiv){          
						console.log(rt.text);
						var num = rt.FatherNode.childNode.indexOf(rt);
						console.log(num);
						rt.FatherNode.childNode.splice(num, 1);

						var jsq = Storage.delClassifySto(choseDiv);
						Storage.treeNodeIdChange();

						return;
					}
					if (rt!==null) {
						for(var i=0;i<rt.childNode.length;i++) {
							Order(rt.childNode[i]);
						}
					}
				}
				// 从它的父元素中删除子元素,从dom中删除
				if (choseDiv.parentNode) {
					choseDiv.parentNode.removeChild(choseDiv);
				}
				_.$("popup-del-classify").style.display = "none";
			},false);

			}}
		},false);

		_.$("tree").addEventListener('click',function(e){
			var hasClassName =/tree-add|task-add/gi;
			if ((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase())) {
				console.log("add");
				choseDiv = e.target.parentNode.parentNode.parentNode;
				clearAll();
			}

		},false);

		// 添加新分类
		_.$("addbtn").addEventListener('click',function() {
			var value;
			value = inp.Inputprompt.addcheckInputText("alertText2",_.$("addinputText"));
			if (value!==null&&value!=="") { 
				_.$("popup-add-classify").style.display = "none"; 
				console.log(value);
				var jsq = Storage.addClassifySto(choseDiv,value);
				var node = new Node(null,value,0,null,null);
				var childDiv =  renderTree(value);
	            
	            // 新的结点渲染到页面上后删除该结点的id
				d.fatherIdArr.pop(); 
				// 更新该结点id在id数组中的位置
				d.fatherIdArr.splice(jsq, 0, "fatherId"+d.fatherIdjsq++);
				Storage.treeNodeIdChange(jsq);
				// 新节点加入到选中节点中
				choseDiv.appendChild(childDiv);
				// 遍历找到选中节点
				Order(rt);
				function Order(rt) {
					// 选中节点图标更新
					if (rt.data===choseDiv) {
						rt.childNode.push(node);
						node.FatherNode = rt;
						rt.data.firstChild.style.display = "inline-block";
						rt.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
						node.data = childDiv;
						// 选中节点子节点展开					
						for(var i=0;i<rt.childNode.length;i++) {
							rt.childNode[i].data.style.display = "block";
						}
						return;
					}
					if (rt!==null) {
						for(var k=0;k<rt.childNode.length;k++) {
							Order(rt.childNode[k]);
						}
					}
				}
			}
		} ,false);

		// 编辑、添加新任务
		_.$("add-task-btn").addEventListener('click',function() {
			var value   = inp.Inputprompt.addcheckInputText("alertText3",_.$("task-input-title"));
			// var content = inp.Inputprompt.addcheckInputText("alertText3",_.$("task-input-content"));
			var content = _.$("task-input-content").value.trim();
			var endTime = _.$("text").value;
			// 编辑任务
			if (_.$("h1Name").innerHTML === "编辑任务") {
				console.log("编辑任务");
				if (value!==null&&value!=="") { 
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
			}
			// 添加任务 
			else {                                                                          
				if (value!==null&&value!=="") { 
					_.$("popup-add-task").style.display = "none"; 
					console.log(value,content);
					var node = new Node(null,value,0,null,null);
					var childDiv =  renderTree(value,0);
					choseDiv.appendChild(childDiv);

					Order(rt);
					function Order(rt) {
						if (rt.data===choseDiv) {
							rt.childNode.push(node);
							node.FatherNode = rt;
							rt.data.firstChild.style.display = "inline-block";
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
							// 把任务添加到右侧任务列表中
							var newtask = new Tasklist(taskone);
							newtask.init(newtask);
							tasklistArr.push(newtask);
							// 文件夹内部添加任务，文件夹后面的数字+1
							var fileTitleName = rt.data.getElementsByClassName("tree-title")[0].innerHTML;
							rt.data.getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");
							// 选中节点子节点展开
							for(var j=0;j<rt.childNode.length;j++) {
								rt.childNode[j].data.style.display = "block";
							}
							return;
						}
						if (rt!==null) {
							for(var k=0;k<rt.childNode.length;k++) {
								Order(rt.childNode[k]);
							}
						}
					}
				}

			}
			Storage.TaskChange();
			// pop.clearPopup();
		} ,false);

		// 编辑、添加快速任务
		_.$("add-fast-task").addEventListener('click',function() {
			// 编辑快速任务
			if (_.$("fastH1Name").innerHTML === "编辑快速任务") {
				console.log("编辑快速任务");

				var pos = tasklistArr.indexOf(nowChangeli);
				nowChangeli.title = _.$("fast-task-input-title").value;
				// 更改左侧树结点的标题
				nowChangeli.li.getElementsByClassName("task-list-title")[0].innerHTML = _.$("fast-task-input-title").value;
				nowChangeli.cnode.getElementsByClassName("tree-title")[0].innerHTML = _.$("fast-task-input-title").value;
				_.$("popup-add-fast-task").style.display = "none";
				_.$("fastH1Name").innerHTML = "添加快速任务";

			}
			// 添加快速任务
			else {
				var value = inp.Inputprompt.addcheckInputText("alertText4",_.$("fast-task-input-title"));
				// 把任务添加到左侧任务列表中
				if (value!==null&&value!=="")  {
					var childDiv =  renderTree(value,0);
					_.$("fast-task-list").appendChild(childDiv);

					var taskone = {
						"fatherId": "fast-task-list",
						"title": value,
						"pnode": _.$("fast-task-list"),
						"cnode": childDiv,
						"type" : "fast"
					};
					// 把任务添加到右侧任务列表中
					var newtask = new Tasklist(taskone);
					newtask.init(newtask);
					tasklistArr.push(newtask);

					_.$("popup-add-fast-task").style.display = "none";

					var fileTitleName = _.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML;
					_.$("fast-task-list").getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");
				}
			}
			Storage.TaskChange();
			// pop.clearPopup();
		},false);
			

		_.$("preSearch").addEventListener('click',function(){
			console.log("click!!!!");
			var value = inp.Inputprompt.checkInputText("alertText",_.$("inputText"));
			if (value!==null&&value!=="") {
				clearAll();
				show(preOrder(rt),value,rt);
			}
			else inp.Inputprompt.noteText("alertText","查询不能为空","#EC9B69");
		},false);
		

		
		_.$("inputText").addEventListener('focus', function(){
			console.log("focus");
	         inp.Inputprompt.noteText("alertText","请输入查询元素","#313F5F");
	         inputTextFocus = true;
	    }, true);
	    _.$("inputText").addEventListener('blur',function(e){
	    	inp.Inputprompt.checkInputText("alertText",_.$("inputText"));
	    	inputTextFocus = false;
	    }, true);

	    _.addEvent(_.$("endtime-sort"),"click",function() {
			
			console.log("endtime sort");
			var copyTasklistArr = [];
			var nowTasklist = _.$("task-ul-one").getElementsByTagName("li");
			for (var l=0;l<nowTasklist.length;l++) {
				for(var k=0;k< tasklistArr.length;k++) {
					if (nowTasklist[l] === tasklistArr[k].li) {
						copyTasklistArr.push(tasklistArr[k]);
						break;
					}
				}
			}

			if (_.$("endtime-sort").className === "ascending") {
				// 降序 
				copyTasklistArr.sort(function(a, b) { 
			    	if (a.endTime >= b.endTime ) return 1;
			    	else return -1;
			    });
				_.$("endtime-sort").className = "descending";
			}
			//升序return b.endTime - a.endTime; 比较字符串形式不能用'-'
			else {
				copyTasklistArr.sort(function(a, b) { 
				    	if (a.endTime <= b.endTime ) return 1;
				    	else return -1;
			    });
				_.$("endtime-sort").className = "ascending";
			}
			while (nowTasklist.length) {
				_.$("task-ul-one").removeChild(nowTasklist[0]);
			}
			for (var j=0;j<copyTasklistArr.length;j++) {
				console.log(copyTasklistArr[j].endTime);
				_.$("task-ul-one").appendChild(copyTasklistArr[j].li);
			}
		});
	}

	/**
	 * [numOfTasks 在任务分类的后面添加本分类中任务的个数]
	 * @param  {String} fileTitleName [任务分类的名称]
	 * @param  {String} operating     [对本分类中任务的操作：添加/删除]
	 * @return {String}               [返回更改后的任务分类名称]
	 */
	function numOfTasks(fileTitleName,operating) {
		var titleName = fileTitleName;
		var titleArr = titleName.split(/[(]{1}|[)]{1}/gi);
		console.log(titleArr);
	    // 删除任务
		if (operating==="sub") {
			if (titleArr.length>=3){
				if ((parseInt(titleArr[titleArr.length-2],10)-1)===0){
					fileTitleName=titleName.replace('<span>(1)</span>','');
				}
				else {
					 console.log("sub num");
					fileTitleName=titleName.replace((parseInt(titleArr[titleArr.length-2],10))+'',(parseInt(titleArr[titleArr.length-2],10)-1)+'');
					console.log(fileTitleName);
				}
			}
		} 
		// 添加任务
		else {                        
			 console.log("add num");
			if (titleArr.length>=3)
				fileTitleName = titleName.replace((parseInt(titleArr[titleArr.length-2],10))+'',(parseInt(titleArr[titleArr.length-2],10)+1)+'');
			else
				fileTitleName = titleName +"<span>("+1+")</span>";
			console.log(titleArr);
		}
		return fileTitleName;

	}


	/*=======================================================================task-list==================================================*/

	// 储存添加到右侧的任务条 创建的Tasklist
	var tasklistArr = [];
	function Tasklist(task) {
		this.fatherId=task.fatherId;
		this.title = task.title;
		// 记录左侧任务本身节点
		this.cnode = task.cnode;
		// 记录左侧任务的父亲节点
		this.pnode = task.pnode;
		this.content = task.content;
		this.endTime = task.endTime;
		this.type = task.type;
		// 存储添加到右侧的任务条
		this.li = null;

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
			
			if (task.type === "normal") {
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
			if (task.type === "normal")
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
			if (e.target.className === "task-list-notdone") {
				e.target.className = "task-list-done";
				e.target.parentNode.className = "task-list task-list-del";

				setTimeout(function() {
					// 删除右侧任务条
					e.target.parentNode.parentNode.removeChild(e.target.parentNode );
					for(var i=0;i<tasklistArr.length;i++) {
						// 删除左侧任务条
						if (e.target.parentNode === tasklistArr[i].li) {
							tasklistArr[i].pnode.removeChild(tasklistArr[i].cnode);

						// 文件夹内部删除任务，文件夹后面的数字-1
						var fileTitleName = tasklistArr[i].pnode.getElementsByClassName("tree-title")[0].innerHTML;
						tasklistArr[i].pnode.getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"sub");
						// 留在这里
						tasklistArr.splice(i,1);
						Storage.TaskChange();
						}
					}
									
				},800);
			}
		};
		mod.taskMoreHandle = function(e) {
			
			if (e.target.className === "task-list-title") {
				console.log("lalalala");
				for(var i=0;i<tasklistArr.length;i++) {
						if (e.target.parentNode === tasklistArr[i].li) {
							console.log(tasklistArr[i].endTime);
							_.$("popup-task-more").getElementsByTagName("h1")[0].innerHTML = tasklistArr[i].title;
							_.$("popup-task-more").getElementsByTagName("section")[0].innerHTML = "<p>"+tasklistArr[i].content+"</p>";
							countdown.timeCountdown(tasklistArr[i].endTime);
						}
					}
			}
		};
		return mod;
	})(Tasklist);

	/*========================================================== localStorage ==================================================*/
	var Storage = (function(mod) {
		// 删除、添加、编辑快速任务和普通任务公用一个
		mod.TaskChange = function() {
			allTasks.list = [];
			for(var i=0;i<tasklistArr.length;i++) {
				allTasks.list.push(tasklistArr[i]);
			}
			localStorage.setItem('allTasks', JSON.stringify(allTasks));
		};
		mod.treeNodeIdChange = function(jsq) {
			// 将id数组中的元素添加到对象中
			treeClassifyIdArr.list = [];
			for(var j=0;j<d.fatherIdArr.length;j++) {
				treeClassifyIdArr.list.push(d.fatherIdArr[j]);
			}
		  	// 将更新的treeClassifyIdArr存入设置的值treeClassify中
			localStorage.setItem('treeClassify', JSON.stringify(treeClassifyIdArr));
			// 将更新的d.fatherIdjsq存入设置的值d.fatherIdjsq中
			localStorage.setItem('d.fatherIdjsq', d.fatherIdjsq);
		};


		mod.addClassifySto = function(choseDiv,value) {
			console.log("addClassifySto");
			var jsq = 0;
			preOrderAdd(d.treedata);
			function preOrderAdd(treeframe) {
				for(var key in treeframe) {
	  					// 找到被选中的结点
	  					if (jsq===d.fatherIdArr.indexOf(choseDiv.id)) {
	  					// 先在数组中添加新的id，使新的结点渲染到页面上
						d.fatherIdArr.push("fatherId"+d.fatherIdjsq); 
						// 更新树状结构，添加结点(为记录树的结构的对象添加属性)
						treeframe[key][value] = {};
						preOrder2(treeframe[key]);
						break;
					}
					jsq++;
					if (typeof treeframe[key] === "object") {
						preOrderAdd(treeframe[key]);
					}
				}
			}
			// jsq记录被选中结点的的最后一个子节点
			function preOrder2(treeframe) {
				for(var key in treeframe) {
					jsq++;
					if (typeof treeframe[key] === "object") {
						preOrder2(treeframe[key]);
					}
				}
			}
			// 将更新的treedata存入设置的值treeframe中
			localStorage.setItem('treeframe', JSON.stringify(d.treedata));
			return jsq;
		};

		mod.delClassifySto = function(choseDiv) {
			// tree
			console.log("delClassifySto");
			var jsq = 0;
			preOrderDel(d.treedata);
			function preOrderDel(treeframe) {
				for(var key in treeframe) {
					if (jsq===d.fatherIdArr.indexOf(choseDiv.id)) {
						delete treeframe[key];
						var pos = treeClassifyIdArr.list.indexOf(choseDiv.id);
						treeClassifyIdArr.list.splice(pos,1);
						d.fatherIdArr.splice(jsq, 1);
						break;
					}
					jsq++;
					if (typeof treeframe[key] === "object") {
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
		// 设定的初始普通任务
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
			//新节点加入到选中节点中
			hahah.appendChild(childDiv);
			var taskone = {
				"fatherId":"fatherId1",
				"title": value1[i],
				"pnode": hahah,
				"cnode": childDiv,
				"content": content,
				"endTime": endTime,
				"type" : "normal"
			};
			// 把任务添加到右侧任务列表中
			var newtask = new Tasklist(taskone);										
			newtask.init(newtask);
			tasklistArr.push(newtask);
		}


		// 设定的初始快速任务
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
			var newtask2 = new Tasklist(tasktwo);
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
		if (!localStorage.getItem('treeframe')) {
			// 之间没有加载过，正常加载
			console.log("!!!!!localStorage.getItem('treeframe')");
		  	initTree();
		} else {
		  	gettreeframeStorage();	 
		}

		/**
		 * [gettreeframeStorage 获取本地存储的树的结构]
		 * @return {[type]} [description]
		 */
		function gettreeframeStorage() {
		 	var restoredtreeframe = JSON.parse(localStorage.getItem('treeframe'));
			console.log("==================storage=====================");
			console.log(restoredtreeframe);
			d.treedata = restoredtreeframe;

			if (localStorage.getItem('treeClassify')) {
				
				var restoredfather = JSON.parse(localStorage.getItem('treeClassify'));
				console.log(restoredfather.list);
				d.fatherIdArr = restoredfather.list;
			}
			
			d.fatherIdjsq = localStorage.getItem('d.fatherIdjsq');
			initTree();
		}
	};




	var  storage = function() {
		if (localStorage.getItem('treeClassify')) {
		  	getTreeClassifyStorage();
		}
		if (!localStorage.getItem('allTasks')) {
			// 之间没有加载过，正常加载
			console.log("!!!!!localStorage.getItem('allTasks')");
			renderData();
		  	
		} else {
			// 有加载过，加载储存的，然后添加listener
			console.log(" localStorage.getItem('allTasks')");
		  	getTaskStorage();
		 
		}
		if (localStorage.getItem('color')) {
			document.getElementsByTagName('body')[0].className = localStorage.getItem('color');
		}
		if (localStorage.getItem('font')) {
			document.getElementsByTagName('html')[0].className = localStorage.getItem('font');
		}
		
		/**
		 * [getTreeClassifyStorage 获取本地存储的全部任务分类id的数据]
		 * @return {[type]} [description]
		 */
		function getTreeClassifyStorage() {
			var restoredfather = JSON.parse(localStorage.getItem('treeClassify'));
			console.log("================ storage treeClassify =========================");
			console.log(restoredfather.list);
			d.fatherIdArr = restoredfather.list;
		}
		
		/**
		 * [getTaskStorage 获取本地存储的全部任务的数据]
		 * @return {[type]} [description]
		 */
		function getTaskStorage() {
		  	// 然后是如何转换通过 JSON.stringify 生成的字符串，该字符串以 JSON 格式保存在 localStorage 里
			var restoredallTasks = JSON.parse(localStorage.getItem('allTasks'));
			console.log("================== storage Tasklist =====================");
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
				if (restoredallTasks.list[i].type === "fast") {
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
					// 遍历找到选中节点 
					Order(rt);
					
				}
				// 把任务添加到右侧任务列表中
				var newtask2 = new Tasklist(restoredallTasks.list[i]);
				newtask2.init(newtask2);
				tasklistArr.push(newtask2);
			}//for

			function Order(rt) {
				// 选中节点图标更新
				if (rt.data===choseDiv) {
					rt.childNode.push(node);
					node.FatherNode = rt;
					rt.data.firstChild.style.display = "inline-block";
					rt.data.firstChild.className = "fa fa-folder-open-o tree-title-sign";
					node.data = childDiv;
					console.log(rt.data.id);
					// 文件夹内部添加任务，文件夹后面的数字+1
					var fileTitleName = rt.data.getElementsByClassName("tree-title")[0].innerHTML;
					rt.data.getElementsByClassName("tree-title")[0].innerHTML = numOfTasks(fileTitleName,"add");
					// 选中节点子节点展开
					for(var i=0;i<rt.childNode.length;i++) {
						rt.childNode[i].data.style.display = "block";
					}
					return;
				}
				if (rt!==null) {
					for(var j=0;j<rt.childNode.length;j++) {
						Order(rt.childNode[j]);
					}
				}
			}//Order
		}//setStyles

	};

	function initAll() {
		//要在浮出层之前加载
		storagetree();

		pop.popupCreat();
		// var addClassify = new SuperPopup(d.popupAddClassify);
		// addClassify.init(addClassify);
		// var addTask = new SuperPopup(d.popupAddTask);
		// addTask.init(addTask);
		// var delClassify = new SuperPopup(d.popupDelClassify);
		// delClassify.init(delClassify);
		// var taskMore = new SuperPopup(d.popupTaskMore);
		// taskMore.init(taskMore);
		// var addFastTask = new SuperPopup(d.popupFastAdd);
		// addFastTask.init(addFastTask);
		
		initAddListener();


		cal.calendarCreate();
		// var calendarOne = new calendar();
		// calendarOne.renderCalendar();
		// calendarOne.init();

		drag.dragCreate();
		// var dragg= new Drag();
	 	// dragg.init();

		storage();
	}
	return {
	    initAll: initAll
	};
});