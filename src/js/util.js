define(function() {
    var $ = function(id) {
        return document.getElementById(id);
    };
    var $$ = function(className) {
        return document.getElementsByClassName(className);
    };
    //                元素     事件   事件函数
    var addEvent = function(element, event, listener) {
        if (element.addEventListener) {
            element.addEventListener(event, listener, false);
        } else if (element.attachEvent) { 
            element.attachEvent("on" + event, listener);
        } else { 
            element["on" + event] = listener;
        }
    };
    var delegateEvent = function(element, tag, eventName, listener) {
        addEvent(element, eventName, function(e){
            var target = e.target || e.srcElement;
            if(target.nodeName.toLowerCase() === tag.toLowerCase()) {
                listener.call(target, e);
            }
        });
    };

    $.delegate = delegateEvent;
    return {
         $: $,
        $$: $$,
        addEvent: addEvent

    };
});