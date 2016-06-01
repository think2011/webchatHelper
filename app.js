'use strict'

class App {
    constructor() {
        this._waitForInit().then(() => {
            this.init()
        })
    }

    init() {
        angular.element('body').append('<button id="test">test</button>')

        angular.element('#test').on('click', () => {
        })
    }

    /**
     * 获取联系人名单
     * @returns {Array.<T>|*}
     */
    fetchAllContacts() {
        return this.getScope('[nav-contact-directive]').allContacts.filter((item) => item.type !== 'header')
    }

    /**
     * 发送信息
     * @param userName
     * @param msg
     */
    sendMsg(userName, msg) {
        this.showChat(userName).then(() => {
            let $scope = this.getScope('[ng-controller="chatSenderController"]')

            $scope.editAreaCtn = msg
            $scope.$apply()
            $scope.sendTextMessage()
        })
    }

    /**
     * 显示聊天框
     * @param userName
     */
    showChat(userName) {
        let $scope = this.getScope('html')

        $scope.$state.go('chat', {userName: userName})

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 300)
        })
    }

    /**
     * 获得scope
     * @param selector
     * @returns {*}
     */
    getScope(selector) {
        return angular.element(selector).scope()
    }

    _waitForInit() {
        let interval = null

        return new Promise((resolve, reject) => {
            interval = setInterval(() => {
                try {
                    if (typeof angular && angular.element('[ui-sref="contact"]').length) {
                        resolve(angular)
                        clearInterval(interval)
                    }
                } catch (err) {
                    //
                }
            }, 300)
        })
    }
}

new App()