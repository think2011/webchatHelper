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