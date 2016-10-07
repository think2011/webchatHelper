export default new class {
    constructor() {
        this.services = {}
    }

    init() {
        return this._waitForInit().then(() => angular)
    }

    /**
     * 把一些service传进来使用
     * @param service
     */
    initService(service) {
        for (var p in service) {
            if (!service.hasOwnProperty(p)) continue;

            this.services[p] = service[p]
        }
    }

    /**
     * 初始化组件
     * @param component
     */
    initComponents(component) {
        let services = this.services
        let $scope   = services.$rootScope.$new()

        $scope.ctrl = new component.Ctrl(services)

        return services.$compile(component.html)($scope)
    }

    /**
     * 获取联系人名单
     * @returns {Array.<T>|*}
     */
    initAllContacts() {
        let documentScope = this.getScope(document)
        let contactScope  = this.getScope('[contact-list-directive]')
        let itemCache     = {}

        contactScope.$watch('allContacts', (newVal) => {
            if (!angular.isArray(newVal)) return

            newVal.forEach((item) => {
                if (!itemCache[item.UserName] && item.type !== 'header' && item.UserName !== 'filehelper') {
                    itemCache[item.UserName] = true
                    item.checked             = false
                    documentScope.weChatHelper.allContacts.push(item)
                }
            })
        })
    }

    /**
     * 发送信息
     * @param options
     */
    sendMsg(options) {
        let services = this.services
        let data     = Object.assign({
            Msg  : services.chatFactory.createMessage(options),
            Scene: 0
        }, services.accountFactory.getBaseRequest())

        data.Msg.Type = data.Msg.MsgType

        return services.$http({
            url   : '/cgi-bin/mmwebwx-bin/webwxsendmsg',
            method: 'POST',
            data
        })

        /* let time = Math.floor(Math.random() * (1000 - 300)) + 300

         return new Promise((resolve, reject) => {
         this.showChat(userName).then(() => {
         let $scope        = this.getScope('[ng-controller="chatSenderController"]')
         let documentScope = this.getScope(document)

         documentScope.safeApply(() => {
         $scope.editAreaCtn = msg
         $scope.sendTextMessage()
         $scope.editAreaCtn = ''
         })
         })

         setTimeout(() => {
         resolve()
         }, time)
         })*/
    }

    disabledOldSend() {
        let scope = this.getScope('#editArea')

        scope.sendTextMessage = scope.editAreaBlur = scope.editAreaClick = scope.editAreaKeydown = scope.editAreaKeyup = () => {
        }

        $('#editArea').on('keydown', function () {
            window.event.stopPropagation()
        })
    }

    enabledOldSend() {
        let $scope = this.getScope(document)

        $scope.$state.go('contact')
    }

    /**
     * 批量发送信息
     * @param items
     * @param msg
     */
    send(items, msg) {
        if (!msg) return

        let item = items.shift()

        if (items.length >= 10) {
            document.title = `${items.length}人, 约${parseInt((items.length * 500 / 1000))}秒, 正发给[${item.RemarkName || item.NickName}]`
        } else {
            document.title = '微信'
        }

        this.sendMsg(item.UserName, msg).then(() => {
            if (items.length) {
                this.send(items, msg)
            } else {
                this.enabledOldSend()
                this.sendMsg('filehelper', msg)
            }
        })
    }

    /**
     * 获得输入的信息
     */
    getMsg() {
        return this.getScope('#editArea').editAreaCtn
    }

    /**
     * 显示发送框
     * @param $compile
     * @param $rootScope
     * @param items
     */
    showEditor($compile, $rootScope, items) {
        let listHtml = `
        <div id="mmpop_chatroom_members" class="wechatHelper-tag mmpop members_wrp slide-down" tabindex="-1" style="background: #eee">
   <div class="scrollbar-dynamic members_inner  scroll-content"
                 style="margin-bottom: 0px; margin-right: 0px;">
                <div class="member" ng-repeat="item in weChatHelper.sendItems track by $index">
                    <img class="avatar"
                         ng-src="{{item.HeadImgUrl}}"
                         alt="">
                    <p class="nickname"
                       ng-bind-html="trustAsHtml(item.RemarkName || item.NickName)">
                    </p>
                </div>

            </div>
</div>
        `

        let sendHtml = `
        <a class="btn btn_send wechatHelper-tag" href="javascript:;" ng-click="weChatHelper.send(weChatHelper.sendItems)">开始群发</a>
        `

        return this.showChat('filehelper').then(() => {
            $rootScope.safeApply(() => {
                $('.title_name').text(`群发信息(${items.length}个联系人)`)

                let weChatHelper = $rootScope.weChatHelper

                weChatHelper.sendItems = items

                setTimeout(() => {
                    angular.element('.box_hd').append($compile(listHtml)($rootScope))
                }, 300)

                angular.element('[ng-click="sendTextMessage()"]').hide()
                angular.element('[mm-repeat="message in chatContent"]').hide()
                angular.element('.action').append($compile(sendHtml)($rootScope))

                let interval = setInterval(() => {
                    if (!$('.title_name').text().includes('群发信息')) {
                        clearInterval(interval)
                        $('.wechatHelper-tag').remove()
                        angular.element('[ng-click="sendTextMessage()"]').show()
                        angular.element('[mm-repeat="message in chatContent"]').show()
                    }
                }, 1000)
            })
        })
    }

    /**
     * 显示聊天框
     * @param userName
     */
    showChat(userName) {
        let $scope = this.getScope(document)

        $scope.$state.go('chat', {userName: userName})

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 150)
        })
    }


    /**
     * 获得用户信息
     */
    getAccount() {
        let $scope = this.getScope('.main_inner .header')

        return $scope.account
    }

    /**
     * 获得scope
     * @param selector
     * @returns {*}
     */
    getScope(selector) {
        return angular.element(selector).scope()
    }

    /**
     * 等微信初始化
     * @returns {Promise}
     * @private
     */
    _waitForInit() {
        let interval = null

        return new Promise((resolve, reject) => {
            interval = setInterval(() => {
                try {
                    if (typeof angular && this.getAccount().NickName) {
                        clearInterval(interval)
                        resolve(angular)
                    }
                } catch (err) {
                    //
                }
            }, 3000)
        })
    }

}