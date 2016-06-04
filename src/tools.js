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
        return this.getScope('[contact-list-directive]').allContacts.filter((item) => item.type !== 'header')
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
                        clearInterval(interval)
                    }
                } catch (err) {
                    //
                }
            }, 300)
        })
    }

}