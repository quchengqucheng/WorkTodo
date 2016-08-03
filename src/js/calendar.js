/**
 * @file calendar.js 日历组件
 * @author qucheng(qucheng_se@163.com)
 * 
 */
define(['util'], function(_) {
	
	var weekDay = ["日","一","二","三","四","五","六"];
	var Calendar = function() {

	};

	Calendar.prototype = {
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
			if (today.month<10) today.month="0"+today.month;
			if (today.year <10) today.year ="0"+today.year;
			if (today.day  <10) today.day  ="0"+today.day;
			var todayDate =  today.year+"-"+today.month+"-"+today.day;

			this.selectDay(this);
			this.selectYear(this);
			this.selectMonth(this);
			this.showCld();
			return todayDate;
		},
		//渲染日历选择框--年、月
		renderCalendar:function() {
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
			var year = parseInt(_.$("calendar-year").innerHTML,10);
			var month = parseInt(_.$("calendar-month").innerHTML,10);
			    day   = parseInt(day,10);
			if (month<10) month="0"+month;
			if (year <10) year ="0"+year;
			if (day  <10) day  ="0"+day;
			_.$("text").value = year+"-"+month+"-"+day;
			if (_.$$("calendar")[0].style.display === "none") {
		 		_.$$("calendar")[0].style.display ="block";
		 	} else {
		 		_.$$("calendar")[0].style.display ="none";
		 	}
		},
		// 得到一个标准Date的本地时间的年月日
		getYMD:function(today) {
			var YMD = {};
			YMD.year  = today.getFullYear();
			YMD.month = today.getMonth();
			YMD.day   = today.getDate();
			YMD.weekday = today.getDay();
			return YMD;
		},
		setCldYear:function(year) {
			year = parseInt(year,10);
			_.$("calendar-year").innerHTML = year;
			var selectYearBox = _.$("calendar-year").parentNode.parentNode.getElementsByClassName('calendar-year-select')[0];
			var li = selectYearBox.getElementsByTagName("li");
			for (var i=0;i<li.length;i++) {
				li[i].style.backgroundColor = "#fff";
				li[i].innerHTML = year+i-9;
			}
			li[9].style.backgroundColor = "lightgreen";
			this.setCldDate();
		},
		setCldMonth:function(month) {
			month = parseInt(month,10);
			var year;
			if (month<0) {
				month=11;
				year = parseInt(_.$("calendar-year").innerHTML,10);
				this.setCldYear(year-1);
			}
			if (month>11) {
				month=0;
				year = parseInt(_.$("calendar-year").innerHTML,10);
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
				if (td[i].innerHTML === day+"") {
					td[i].style.backgroundColor = "lightgreen";
					this.setText(day);
				}
			}
		},
		setCldDate:function() {
			var year = _.$("calendar-year").innerHTML;
			var month = _.$("calendar-month").innerHTML;
			console.log(year,month);
			// 本月第一天
			var firstday = new Date(year,month-1,1);
			// 本月最后一天
			var lastday  = new Date(year,month,0);
			var first = this.getYMD(firstday);  
			var last  = this.getYMD(lastday);
			var daysInMonth = last.day;
			if (_.$("tableBody")){
				_.$("calendar-cells").removeChild(_.$("tableBody"));
			}
			function renderDate() {
				var table = document.createElement("table");
				var tbody = document.createElement("tbody");

				table.setAttribute("id","tableBody");
				var num = ( first.weekday + last.day )%7;
				var cells,rows,jsq=0;
				if (num === 0) {cells = first.weekday + last.day;}
				         else {cells = first.weekday + last.day + 7 - num;}
				                rows = cells/7;

				for(var i=0;i<rows;i++) {
					var tr = document.createElement("tr");
					for(var j=0;j<7;j++) {
						var td = document.createElement("td");
						if (jsq<first.weekday||jsq>=last.day+first.weekday) {
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
			if (selectBox.style.display === "block") {
				selectBox.style.display = "none";
			}else {
				selectBox.style.display = "block";
			}
		},
		selectYear:function(calendar) {
			window.addEventListener("click",function(e) {
				var hasClassName = /click-year-box/gi;
				if ((e.target||e.srcElement)&&hasClassName.test(e.target.className.toLowerCase()) ) {
					var selectYearBox = _.$("calendar1").getElementsByClassName('calendar-year-select')[0];
					calendar.selectBoxDisplay(selectYearBox);
				}
			},false);
			_.$("calendar-year-select-ul").addEventListener("click",function(e) {
				if ((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="li") {
					calendar.setCldYear(e.target.innerHTML);
					var selectYearBox = e.target.parentNode.parentNode;
					calendar.selectBoxDisplay(selectYearBox);
				}
			},false);
		},
		selectMonth:function(calendar) {
			window.addEventListener("click",function(e) {
				var className = /click-month-box/gi;
				if ((e.target||e.srcElement)&&className.test(e.target.className.toLowerCase()) ) {
					var selectMonthBox = _.$("calendar1").getElementsByClassName('calendar-month-select')[0];
					calendar.selectBoxDisplay(selectMonthBox);
				}
			},false);
			window.addEventListener("click",function(e) {
				if ((e.target||e.srcElement)&&e.target.className.toLowerCase()==="change-btn") {
					var changeMonth = document.getElementsByClassName('change-btn');
					var month;
					if (changeMonth[0]===e.target) {
						month = _.$("calendar-month").innerHTML;
						console.log("heihei",month);
						calendar.setCldMonth(parseInt(month,10)-2);
					}else {
						month = _.$("calendar-month").innerHTML;
						calendar.setCldMonth(parseInt(month,10));
					}
				}
			},false);
			_.$("calendar-month-select-ul").addEventListener("click",function(e) {
				if ((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="li") {
					var month = e.target.innerHTML;
					calendar.setCldMonth(parseInt(month,10)-1);
					var selectMonthBox = e.target.parentNode.parentNode;
					calendar.selectBoxDisplay(selectMonthBox);
				}
			},false);
		},
		selectDay:function(calendar) {
			window.addEventListener("click",function(e) {
				if ((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="td"){
					var td = document.getElementsByTagName("td");
					if (e.target.innerHTML !== "") {
						for(var i=0;i<td.length;i++) {
							td[i].style.backgroundColor = "";
						}
						e.target.style.backgroundColor = "lightgreen";
						calendar.setText(e.target.innerHTML);
					}
					
		
				}
			},false);
			window.addEventListener("mouseover",function(e) {
				// 空白hover不变色
				if ((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="td"){
				 	if (e.target.innerHTML === "") {
				 		e.target.style.backgroundColor = "#fff";
				 	}
				}
			},false);
		},
		showCld:function() {
			window.addEventListener("click",function(e) {
				// 空白hover不变色
				if ((e.target||e.srcElement)&&e.target.nodeName.toLowerCase()==="input"){
				 	if (_.$$("calendar")[0].style.display === "none") {
				 		_.$$("calendar")[0].style.display ="block";
				 	} else {
				 		_.$$("calendar")[0].style.display ="none";
				 	}
				}
			},false);
		}
	};
	// var todayDate;
	var calendarCreate = function() {
		var calendarOne = new Calendar();
		calendarOne.renderCalendar();
		// todayDate属性记录今日日期，用于刷新浮出层上显示的日期
		calendarCreate.todayDate = calendarOne.init();
	};
	return {
		calendarCreate: calendarCreate
	};
});