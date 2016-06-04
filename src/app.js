'use strict'

import tools from './tools'
import NgTransfer from './ng-transfer/ng-transfer'


tools.init().then(() => {
    let $injector = angular.element(document).injector()

    $injector.invoke(function ($rootScope, $sce, $timeout, ngDialog, $compile) {
        $rootScope.trustAsHtml = function (str) {
            return $sce.trustAsHtml(str);
        };

        $rootScope.massSms = function () {
            ngDialog.open({
                className : "default transfer",
                controller: NgTransfer,
                template  : require('./ng-transfer/ng-transfer.html'),
                plain     : true
            });
        }

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

        $('[contact-list-directive]').prepend($compile(html)($rootScope))
    });
})
