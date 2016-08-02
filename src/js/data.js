define(['util'], function(_) {
var fatherIdnum = 0;
var fatherIdjsq = 8;
var fatherIdArr = ["fatherId0","fatherId1","fatherId2","fatherId3","fatherId4","fatherId5","fatherId6","fatherId7"];


//初始树形菜单结构
var treedata = {
	"任务列表": {
		"使用说明": {},
		"今日任务":{},
		"短期任务":{
			"7月":{},
			"8月":{},
			"9月":{}
		},
		"长期任务":{}
	}
};

//浮出层的设置
var popupFastAdd ={
	"btnName": "fast-add-task-btn", 		    //浮出层触发的btn名称
	"className": "popup-fast-task-board",
	"idName"  : "popup-add-fast-task",			//浮出层名称
	"headerName": "添加快速任务",     			//浮出层标题
	"confirmBtn": "add-fast-task",
	"textContent": "<textarea id='fast-task-input-title' type='text' spellcheck='true' maxlength='200' placeholder='输入快速任务' style='overflow: hidden;'></textarea><span id='alertText4'></span>",
	"h1Name":"fastH1Name"
};
var popupTaskMore = {
	"btnName": "task-list-title", 				//浮出层触发的btn名称
	"className": "popup-more-board",
	"idName"  : "popup-task-more",				//浮出层名称
	"headerName": "任务详情",    				//浮出层标题
	"confirmBtn": "",
	"textContent": ""		
};  
var popupAddClassify = {
	"btnName": "fa fa-folder-o tree-add", 		//浮出层触发的btn名称
	"className": "popup-add-class-board",
	"idName"  : "popup-add-classify",			//浮出层名称
	"headerName": "新增分类",     				//浮出层标题
	"confirmBtn": "addbtn",
	"textContent": "<div id='floatDiv' class='add-classify'><input type='text' id='addinputText'></input><span id='alertText2'>请输入节点名称</span></div>"		
};
var popupAddTask = {
	"btnName": "fa fa-plus-circle task-add", 	//浮出层触发的btn名称
	"className": "popup-big-board",
	"idName"  : "popup-add-task",				//浮出层名称
	"headerName": "新增任务",     				//浮出层标题
	"confirmBtn": "add-task-btn",
	"textContent": "",
	"h1Name":"h1Name"
};
var popupDelClassify = {
	"btnName": "fa fa-trash-o tree-delet", 		//浮出层触发的btn名称
	"className": "popup-del-task-board",
	"idName"  : "popup-del-classify",			//浮出层名称
	"headerName": "删除分类",     				//浮出层标题
	"confirmBtn": "del-classify-btn",
	"textContent": "确定删除分类及分类中的全部任务"		
}; 


return {
	treedata: treedata,
	popupFastAdd: popupFastAdd,
	popupTaskMore: popupTaskMore,
	popupAddClassify: popupAddClassify,
	popupAddTask: popupAddTask,
	popupDelClassify: popupDelClassify,
	fatherIdnum: fatherIdnum,
	fatherIdjsq: fatherIdjsq,
	fatherIdArr:fatherIdArr




};
});
/*
【allTasks：任务列表的存储】

{"list":[
	{
		"title":"普通任务列表",
		"cnode":{"value":"普通任务列表"},
		"pnode":{"value":"使用说明"},
		"content":"可以设定任务的名称、任务描述、任务截止时间",
		"endTime":"2016-05-20",
		"type":"normal",
	},
	{
		"title":"添加新分类",
		"cnode":{"value":"添加新分类"},
		"pnode":{"value":"使用说明"},
		"content":"通过左侧自定义分类的文件夹图标添加新分类",
		"endTime":"2017-07-20",
		"type":"normal",
	}
]};
*/

/*
【treeframe：树形菜单的存储】

{
	"任务列表":{
		"使用说明":[
			{
				"title":"普通任务列表",
				"content":"可以设定任务的名称、任务描述、任务截止时间",
				"endTime":"2016-05-20",
				"type":"normal",
			},
			{
				"title":"添加新分类",
				"content":"通过左侧自定义分类的文件夹图标添加新分类",
				"endTime":"2017-07-20",
				"type":"normal",
			}
		],
		"今日任务":{},
		"短期任务":{
			"7月":{},
			"8月":{},
			"9月":{}
		},
		"长期任务":{}
	 }
}
*/