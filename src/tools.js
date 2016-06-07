export default new class {
    constructor() {
    }

    init() {
        return this._waitForInit().then(() => angular)
    }

    /**
     * 获取联系人名单
     * @returns {Array.<T>|*}
     */
    fetchAllContacts() {
        let documentScope = this.getScope('[contact-list-directive]')

        if(documentScope.allContacts || this.getScope('[contact-list-directive]').allContacts)

        return this.getScope('[contact-list-directive]').allContacts.filter((item) => item.type !== 'header' && item.UserName !== 'filehelper')
    }

    /**
     * 发送信息
     * @param userName
     * @param msg
     */
    sendMsg(userName, msg) {
        let time = Math.floor(Math.random() * (1000 - 300)) + 300

        return new Promise((resolve, reject) => {
            this.showChat(userName).then(() => {
                let $scope = this.getScope('[ng-controller="chatSenderController"]')

                $scope.editAreaCtn = msg
                $scope.sendTextMessage()
                $scope.editAreaCtn = ''
                $scope.$apply()
            })

            setTimeout(() => {
                resolve()
            }, time)
        })
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
        <div id="mmpop_chatroom_members" class="wechatHelper-tag mmpop members_wrp slide-down" tabindex="-1" style="">
    <div class=" members">
        <div class="scroll-wrapper scrollbar-dynamic members_inner ng-scope" style="position: relative;">
            <div class="scrollbar-dynamic members_inner ng-scope scroll-content"
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
            <div class="scroll-element scroll-x">
                <div class="scroll-element_corner"></div>
                <div class="scroll-arrow scroll-arrow_less"></div>
                <div class="scroll-arrow scroll-arrow_more"></div>
                <div class="scroll-element_outer">
                    <div class="scroll-element_size"></div>
                    <div class="scroll-element_inner-wrapper">
                        <div class="scroll-element_inner scroll-element_track">
                            <div class="scroll-element_inner-bottom"></div>
                        </div>
                    </div>
                    <div class="scroll-bar" style="width: 96px;">
                        <div class="scroll-bar_body">
                            <div class="scroll-bar_body-inner"></div>
                        </div>
                        <div class="scroll-bar_bottom"></div>
                        <div class="scroll-bar_center"></div>
                    </div>
                </div>
            </div>
            <div class="scroll-element scroll-y">
                <div class="scroll-element_corner"></div>
                <div class="scroll-arrow scroll-arrow_less"></div>
                <div class="scroll-arrow scroll-arrow_more"></div>
                <div class="scroll-element_outer">
                    <div class="scroll-element_size"></div>
                    <div class="scroll-element_inner-wrapper">
                        <div class="scroll-element_inner scroll-element_track">
                            <div class="scroll-element_inner-bottom"></div>
                        </div>
                    </div>
                    <div class="scroll-bar" style="height: 96px;">
                        <div class="scroll-bar_body">
                            <div class="scroll-bar_body-inner"></div>
                        </div>
                        <div class="scroll-bar_bottom"></div>
                        <div class="scroll-bar_center"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        `

        let sendHtml = `
        <a class="btn btn_send wechatHelper-tag" href="javascript:;" ng-click="weChatHelper.send(weChatHelper.sendItems)">开始群发</a>
        `

        this.showChat('filehelper').then(() => {
            $('.title_name').text('群发信息')

            let weChatHelper = $rootScope.weChatHelper

            weChatHelper.sendItems = items

            angular.element('.box_hd').append($compile(listHtml)($rootScope))

            angular.element('[ng-click="sendTextMessage()"]').hide()
            angular.element('[mm-repeat="message in chatContent"]').hide()
            angular.element('.action').append($compile(sendHtml)($rootScope))

            let interval = setInterval(() => {
                if ($('.title_name').text() !== '群发信息') {
                    clearInterval(interval)
                    $('.wechatHelper-tag').remove()
                    angular.element('[ng-click="sendTextMessage()"]').show()
                    angular.element('[mm-repeat="message in chatContent"]').show()
                }
            }, 1000)

            $rootScope.$apply()
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
            }, 300)
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
                    if (typeof angular && angular.element('[contact-list-directive]').length) {
                        resolve(angular)
                        throw new Error(11)
                        clearInterval(interval)
                    }
                } catch (err) {
                    //
                }
            }, 300)
        })
    }

}