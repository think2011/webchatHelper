try {
    // 防止jquery冲突
    var $Q = jQuery.noConflict();

    // 微信内置函数
    var WebMM = WebMM;
    // 放入样式和绑定angular
    var style = '<style>.chatItem.me.sender{text-align:left!important;margin:10px 0 0 0;padding:0 0 3px 0;position:relative;left:-10px;border-bottom:1px dotted #ddd}.chatItem.me.sender:first-child{margin:0}.chatItem.me > span{display:inline-block;margin:0 0 0 15px}.chatItem.me .sender_span1{width:40px;height:40px;margin:0 0 0 35px;}.chatItem.me .sender_span2{position:relative;top:-15px}.chatItem.me .sender_span3{float:right}.chatItem.me .sender_img{width:40px;border-radius:50px}.chatItem.me .chatroom{background:rgba(255,0,0,0.50);color:#fff;padding:2px 5px;border-radius:5px;font-size:12px;position: absolute!important;left: 58px;top: 22px!important;}.chatItem.me .sender_input{width:20px;height:20px;margin:14px 25px 0 0}</style>';
    $Q('body').prepend(style).attr('ng-controller', 'appCtrl');


    var timer = setInterval(function () {
        if(angular) {


            var app = angular.module('app', []);
            app.controller('appCtrl', function ($scope, $compile, $sce, $timeout) {
                // 编译html的scope
                $scope.toHtml = function(html) {
                    return $sce.trustAsHtml(html);
                };
                
                var sender = {};
                /**
                 * 初始化
                 */
                sender.init = function () {
                    var _this = this;

                    // 设定触发区域
                    var timer = setInterval(function () {
                        var $trigger = $Q('[click="popupModifyAvatarWin"]');
                        if($trigger.length) {
                            $trigger.removeAttr('click'); // 移除原生事件
                            $trigger.on('click', function () {
                                _this.show(_this.get());
                            });
                            clearInterval(timer);
                        }
                    },500);

                    // 绑定发送按钮
                    $Q('[click="sendMsg@.inputArea"]').on('click', function () {
                        _this.postMsg();
                    });
                };

                /**
                 * 显示列表
                 * @param data
                 */
                sender.show = function (data) {
                    // 展示列表页
                    WebMM.chooseConversation($Q('#conv_filehelper')[0]);

                    // 置入dom
                    $timeout(function () {
                        // 删除之前的
                        $Q('.chatItem.me').remove();

                        // 改变标题
                        $Q('#messagePanelTitle').text('群发信息');
                        // 修改描述
                        $Q('.systemTip >span').html('勾选要发送的好友 或者 组，然后编辑内容发送。<br />顺便说一下，截图 和 文件发不鸟 ╮(╯﹏╰）╭');

                        $scope.$apply(function () {
                            var d =  (new Date()).valueOf(),
                                items = 'items' + d;
                            $scope.temp = {};
                            $scope.temp[items] = data;
                            var html = '<div class="chatItem me">' +
                                '<input type="text" ng-model="keyword" placeholder="搜索姓名、公众号" />' +
                                '<select ng-model="type"><option value="">所有</option><option value="chatroom">组</option><option value="private">好友</option><option value="public">公众号</option></select>' +
                                '</div>' +
                                '<div ng-repeat="item in temp.'+ items +' | orderBy:\'type\' | filter:keyword | filter:{ type: type }" class="chatItem me sender" type="{{ item.type }}">' +
                                '<span class="sender_span1"><span style="width:20px;text-align:center;position: absolute;left: 5px;top: 10px;color: #ccc;">{{ $index+1 }}</span><img class="sender_img" ng-src="{{ item.avatar }}" />' +
                                '<span class="chatroom" ng-show="item.type === \'chatroom\'">组</span>' +
                                '<span class="chatroom" style="background:rgba(255, 140, 0, 0.5);" ng-show="item.type === \'public\'">众</span>' +
                                '</span>' +
                                '<span class="sender_span2" ng-bind-html="toHtml(item.nickname)"></span>' +
                                '<span class="sender_span3"><input class="sender_input" type="checkbox" username="{{item.username}}" /></span>' +
                                '</div>';

                            var $html = $compile(html)($scope);
                            $Q('.chatItem.you').before($html);
                        });
                    },100);

                };

                /**
                 * 获取数据
                 * @returns {arr}
                 */
                sender.get = function () {
                    $Q('.addrButton ').trigger('click'); //通过触发所有分组按钮来获取完整列表

                    var $items = $Q('[username]'),
                        items = [];
                    // 生成微信列表
                    $Q.each($items, function (k, v) {
                        var $Qv = $Q(v);
                        var item = {
                            username: $Qv.attr('username'),
                            nickname: $Qv.find('.nickName').find('.name').html(),
                            avatar: $Qv.find('img').attr('src'),
                            type: 'private'
                        };
                        // 筛分群组
                        var isChatroom = /@chatroom/g.test(item.username);
                        if(isChatroom) {item.type = 'chatroom'}

                        // 过滤空数据
                        var isUndefined = item.nickname === undefined;
                        if(isUndefined) {return}

                        items.push(item);
                    });

                    // 过滤公众号
                    var $items_public = $Q('.pointer').next().find('[username]');
                    $Q.each($items_public, function (k, v) {
                        var $v = $Q(v);
                        items.forEach(function (v1, k1) {
                            var isMatch = $v.attr('username') === v1.username;
                            if(isMatch) {
                                v1.type = 'public';
                                return false;
                            }
                        });
                    });

                    // 返回去重后的数组
                    return items.unique('nickname');
                };

                /**
                 * 发送信息
                 */
                sender.postMsg = function () {
                    // 如果不在群发状态，退出
                    var isWorking = $Q('input.sender_input').length;
                    if(!isWorking) {
                        return;
                    }

                    // 获取发送内容
                    var $checked = $Q('input.sender_input:checked'),
                        $input = $Q('#textInput'),
                        msg = $input.val();

                    // 没有内容和勾选，退出
                    if(msg === '' || !$checked.length) {
                        return;
                    }

                    if(!window.isProcess) {
                        // 进入发送状态
                        window.isProcess = true;
                        $Q('#mask').html('<span style="color:#fff;font-size: 15px;position: relative;top: 30%;">正在启动..</span>').fadeIn();

                        // 创建队列
                        var queue = new QueueEnginer(700);

                        // 循环建立发送队列
                        $Q.each($checked, function (k, v) {
                            queue.add(function () {
                                // 展开模态窗口提示
                                var currentNum = ++k,
                                    remainNum = $checked.length - currentNum;
                                $Q('#mask').html('<span style="color:#fff;font-size: 15px;position: relative;top: 30%;">正在发送第'+ currentNum +'人，剩余'+ remainNum +'人..</span>');

                                // 开始发送
                                WebMM.chooseConversation(v);
                                $input.val(msg);
                                $Q('[click="sendMsg@.inputArea"]').click();
                            });
                        });

                        // 发送完毕
                        var time =new Date().format('yyyy年MM月dd日 h:m:s'),
                            report = msg + ' 【--发送给了'+ $checked.length +'人】' + time;
                        queue.end(function () {
                            console.log(report);
                            WebMM.chooseConversation($Q('#conv_filehelper')[0]);
                            window.isProcess = false;
                            $Q('#mask').html('').fadeOut();
                        });
                        queue.start();
                        $input.val(report);
                    }
                }

                // 启动
                sender.init();
            });

            angular.bootstrap(document, ['app']);

            clearInterval(timer);
        }
    },300);

} catch (e) {console.error(e)}

/**
 * 生成列表页
 * @array data
 */
/*function createItems(data) {
    // 移除之前的dom
    $Q('.chatItem.me').remove();
    // 改变标题
    $Q('#messagePanelTitle').text('群发信息');
    // 修改描述
    $Q('.systemTip >span').html('勾选要发送的好友 或者 组，然后编辑内容发送。<br />顺便说一下，截图 和 文件发不鸟 ╮(╯﹏╰）╭');

    var $tip = $Q('.chatItem.you'),
        $html = '';
    data.forEach(function (v) {
        var chatroom;
        v.type === 'chatroom' ? chatroom = '<span class="chatroom">组</span>' : chatroom = '';
        var html = '<div class="chatItem me sender" type="'+ v.type +'">' +
            '<span class="sender_span1"><img class="sender_img" src="'+ v.avatar +'" />'+ chatroom +'</span>' +
            '<span class="sender_span2">'+ v.nickname +'</span>' +
            '<span class="sender_span3"><input class="sender_input" type="checkbox" username="'+ v.username +'" /></span>' +
            '</div>';

        $html += html;
    });

    // 置入dom
    $tip.before($html).before($Q('[type="private"]'));
}*/

/**
 * 函数队列
 * @param processTime 间隔时间 default 1000
 * @example
 * var queue = new QueueEnginer(2000);
 * queue.add(function () {console.log(1);});
 * queue.add(function () {console.log(2);});
 * queue.end(function(){alert('执行完毕');});
 * queue.start();
 */
function QueueEnginer(processTime) {
    this.Queue = []; // 队列数组
    this.processTime = processTime || 1000;
}
QueueEnginer.prototype = {
    // 创建队列
    add: function (fn) {
        this.Queue.push({
            fn: fn
        });
    },
    // 处理队列
    process: function () {
        // 取出队列中的第一个
        // 并从this.Queue中删除这个事件
        var queue = this.Queue.shift();

        // 如果队列已空，执行end()
        // 并退出运行
        if(!queue) {
            if(typeof this.endFun === 'function') {
                this.endFun();
            }
            return;
        };

        // 执行事件
        queue.fn();

        // 清除当前queue
        queue = null;

        // 继续执行下一个队列
        this.start();
    },
    // 开始队列
    start: function () {
        var _this = this;
        // 执行当前queue
        setTimeout(function () {
            _this.process();
        }, _this.processTime);
    },
    endFun: null,
    // 队列结束回调
    end: function (fn) {
        if(typeof fn === 'function') {
            this.endFun = fn;
        }
    }
}

/**
 * 扩展日期函数
 * @param format
 * @returns {*}
 * @example var d =new Date().format('yyyy-MM-dd');
 */
Date.prototype.format =function(format)
{
    var o = {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(), //day
        "h+" : this.getHours(), //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), //second
        "q+" : Math.floor((this.getMonth()+3)/3), //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
        (this.getFullYear()+"").substr(4- RegExp.$1.length));
    for(var k in o)if(new RegExp("("+ k +")").test(format))
        format = format.replace(RegExp.$1,
            RegExp.$1.length==1? o[k] :
                ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}

/**
 * 数组去重
 * @param key
 * @returns arr
 * @example var newArr = arr.unique('nickname');
 */
Array.prototype.unique = function (key) {
	var key = key || null, temp;
	var hash = {};

	this.forEach(function (v) {
		// 根据传入的key判断哪个作为唯一
		key ? temp = v[key] : temp = v;

		// 用v作为hash的key，这样重复的key会被覆盖的
		hash[temp] = v;
	});

	// 恢复数组
	var arr = [];
	for(var i in hash) {
		arr.push(hash[i]);
	}

	return arr;
}