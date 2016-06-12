'use strict'

// TODO ZH 16/6/6 联系人多卡顿

import tools from './tools'
import NgTransfer from './ng-transfer/ng-transfer'


tools.init().then(() => {
    let $injector = angular.element(document).injector()

    $injector.invoke([
        '$rootScope', '$sce', '$timeout', 'ngDialog', '$compile',
        function ($rootScope, $sce, $timeout, ngDialog, $compile) {
            let weChatHelper = $rootScope.weChatHelper = {
                allContacts: []
            }

            weChatHelper.send = function (items) {
                if (!confirm(`确定群发给${items.length}个好友吗?`) || !items.length) return

                tools.send(items, tools.getMsg())
            }

            $rootScope.trustAsHtml = function (str) {
                return $sce.trustAsHtml(str);
            };

            $rootScope.massSms = function () {
                let dialog = ngDialog.open({
                    className : "default transfer create_chatroom_dlg",
                    controller: NgTransfer,
                    template  : require('./ng-transfer/ng-transfer.html'),
                    plain     : true
                })

                dialog.closePromise.then(function (data) {
                    $rootScope.$emit('massSms:close')

                    if (!angular.isArray(data.value)) return

                    tools.showEditor($compile, $rootScope, data.value)
                    $timeout(() => {
                        tools.disabledOldSend()
                    }, 500)
                });
            }

            $rootScope.safeApply = function safeApply(operation) {
                var phase = this.$root.$$phase;
                if (phase !== '$apply' && phase !== '$digest') {
                    this.$apply(operation);
                    return;
                }

                if (operation && typeof operation === 'function')
                    operation();
            };

            let html = `
<div ng-click="massSms()">
    <div class="contact_item">
        <div class="avatar">
            <img class="img" src="/cgi-bin/mmwebwx-bin/webwxgeticon?seq=620171266&username=filehelper&skey=@crypt_cf81dc07_22177f600f33e55781afe8a7e7a6cfda" alt="">
        </div>
        <div class="info">
            <h4 class="nickname">群发信息助手</h4>
        </div>
    </div>
</div>
        `

            tools.initAllContacts()
            $('[contact-list-directive]').prepend($compile(html)($rootScope))
            $rootScope.massSms()
        }]);
})