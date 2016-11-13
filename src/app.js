'use strict'

import tools from './tools'
import mainComponent from './components/main'
import sendComponent from './components/send'
// import NgTransfer from './ng-transfer/ng-transfer'

import './styles/common.scss'

tools.init().then(() => {
    let $injector = angular.element(document).injector()

    $injector.invoke([
        '$rootScope', '$sce', '$timeout', 'ngDialog', '$compile', 'chatFactory', 'accountFactory', '$http', 'contactFactory', 'reportService', '$filter',
        function ($rootScope, $sce, $timeout, ngDialog, $compile, chatFactory, accountFactory, $http, contactFactory, reportService, $filter) {
            let services = {
                $rootScope,
                $timeout,
                $compile,
                $http,
                reportService,
                chatFactory,
                accountFactory,
                contactFactory,
                $filter
            }

            $rootScope.trustAsHtml = function (str) {
                return $sce.trustAsHtml(str)
            }

            $rootScope.safeApply = function(fn) {
                var phase = this.$root.$$phase;
                if(phase == '$apply' || phase == '$digest') {
                    if(fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            }

            tools.initService(services)

            let interval = setInterval(() => {
                let contacts = contactFactory.pickContacts(["friend"], {
                    friend: {
                        noHeader      : true,
                        isWithoutBrand: true
                    }
                }, true)

                if (contacts.result.length > 30) {
                    clearInterval(interval)
                    angular.element('body').append(tools.initComponents(mainComponent))
                    angular.element('body').append(tools.initComponents(sendComponent))
                    $rootScope.$emit('helper:send:show')
                }
            }, 1000)

            /*     let mainComponent = tools.injectComponent(Main)

             angular.element('body').append(mainComponent)*/

            /*            tools.sendMsg({
             MsgType   : 1,
             Content   : '111',
             ToUserName: 'filehelper'
             })*/
            /*
             let weChatHelper = $rootScope.weChatHelper = {
             allContacts: []
             }
             let msg = chatFactory.createMessage({
             MsgType   : 1,
             Content   : '111',
             ToUserName: 'filehelper'
             })

             let baseRequest = accountFactory.getBaseRequest()

             console.log(msg)*/

            // chatFactory.sendMessage(msg)

            /*
             weChatHelper.send = function (items) {
             if (!confirm(`确定群发给${items.length}个好友吗?`) || !items.length) return

             tools.send(items, tools.getMsg())
             }*/
            /*            $rootScope.massSms = function () {
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
             $('[contact-list-directive]').prepend($compile(html)($rootScope))*/
        }])
})