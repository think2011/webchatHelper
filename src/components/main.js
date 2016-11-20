import html from './main.html'
import tools from '../tools'

class Ctrl {
    constructor(services) {
        this.services  = services
        this.active    = false
        this.scene     = 1
        this.sendTimer = null

        window.showSend = this.showSend.bind(this)
        this._initEvent()
    }

    _initEvent() {
        this.services.$rootScope.$on('helper:main:send', (event, data) => {
            this.active = true
            this.toScene(2)
            this.send(data)
        })
    }

    send(data) {
        let {list, msg, interval} = this.sendData = data
        let sendData = this.sendData

        interval          = interval || 100
        sendData.allLen   = list.length
        sendData.sendLen  = 0
        sendData.progress = 0
        sendData.failList = []

        ;
        (function loop() {
            sendData.curAccount = list[0]

            let options = {
                MsgType   : 1,
                Content   : msg,
                ToUserName: sendData.curAccount.UserName
            }

            tools.sendMsg(options)
                .then(({data}) => {
                    if (!data.MsgID) return Promise.reject()
                })
                .catch((err) => {
                    sendData.failList.push(sendData.curAccount)
                })
                .finally(() => {
                    list.shift()
                    sendData.sendLen++
                    sendData.progress = (sendData.sendLen / sendData.allLen * 100).toFixed(2)
                    if (list.length) {
                        this.sendTimer = this.services.$timeout(loop.bind(this), interval)
                    } else {
                        this.toScene(3)
                    }
                })
        }.bind(this))()
    }

    cancelSend() {
        this.services.$timeout.cancel(this.sendTimer)
        this.sendData.failList = this.sendData.failList.concat(this.sendData.list)
        this.sendData.list     = []
        this.toScene(3)
    }

    toScene(index) {
        this.scene = index
    }

    showSend(listData, msg) {
        this.services.$rootScope.$emit('helper:send:show', listData, msg)
        this.active = false
        this.toScene(1)
    }
}

export default {
    Ctrl,
    html: html
}