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
     * 发送信息
     * @param options
     */
    sendMsg(options) {
        let services = this.services
        let data     = Object.assign({
            Msg  : services.chatFactory.createMessage(options),
            Scene: 0
        }, services.accountFactory.getBaseRequest())

        data.Msg.Content = data.Msg.MMSendContent
        data.Msg.Type    = data.Msg.MsgType

        /* let q = this.services.$q.defer()

         window.q = q
         this.services.$timeout(() => {
         q.reject()
         }, 0)

         return q.promise*/

        return services.$http({
            url   : '/cgi-bin/mmwebwx-bin/webwxsendmsg',
            method: 'POST',
            data
        })
    }

    /**
     * 获得用户信息
     */
    getAccount() {
        let $scope = angular.element('.main_inner .header').scope()

        return $scope.account
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
            }, 1500)
        })
    }

}