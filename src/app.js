'use strict'

import tools from './tools'
import mainComponent from './components/main'
import sendComponent from './components/send'

import './styles/common.scss'

tools.init().then(() => {
    let $injector = angular.element(document).injector()

    $injector.invoke([
        '$rootScope', '$sce', '$timeout', 'ngDialog', '$compile', 'chatFactory', 'accountFactory', '$http', 'contactFactory', 'reportService', '$filter', '$q', '$state', '$interval',
        function ($rootScope, $sce, $timeout, ngDialog, $compile, chatFactory, accountFactory, $http, contactFactory, reportService, $filter, $q, $state, $interval) {
            let services = window.services = {
                $rootScope,
                $timeout,
                $compile,
                $http,
                reportService,
                $q,
                chatFactory,
                accountFactory,
                contactFactory,
                $filter,
                $state,
                $interval
            }

            $rootScope.trustAsHtml = function (str) {
                return $sce.trustAsHtml(str)
            }

            $rootScope.safeApply = function (fn) {
                var phase = this.$root.$$phase;
                if (phase == '$apply' || phase == '$digest') {
                    if (fn && (typeof(fn) === 'function')) {
                        fn();
                    }
                } else {
                    this.$apply(fn);
                }
            }

            // 注入services
            tools.initService(services)

            let interval = setInterval(() => {
                let contacts = contactFactory.pickContacts(["friend"], {
                    friend: {
                        noHeader      : true,
                        isWithoutBrand: true
                    }
                }, true)

                // 大于30，说明联系人初始化好了
                if (contacts.result.length > 30) {
                    clearInterval(interval)

                    // 生成组件
                    angular.element('body').append(tools.initComponents(mainComponent))
                    angular.element('body').append(tools.initComponents(sendComponent))

                    // test
                    $rootScope.$emit('helper:send:show')
                }
            }, 1000)
        }])
})