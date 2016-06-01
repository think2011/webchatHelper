'use strict'

import tools from './tools'

class Ctrl {
    constructor() {
        angular.element('body').append('<button id="test">test</button>')

        angular.element('#test').on('click', () => {
            alert(11)
        })
    }
}

tools.init().then(() => {
    angular.module("Controllers").controller('_wechatHelper', Ctrl)

    angular.inject(($controller) => {
        throw new Error($controller)
    })
})
