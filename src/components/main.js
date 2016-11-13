import html from './main.html'
import tools from '../tools'

class Ctrl {
    constructor(services) {
        this.services = services
        this.active   = false
        this.scene    = 1

        this._init()
    }

    _init() {
        this.services.$rootScope.$on('helper:main:send', (event, data) => {
            this.active = true
            this.toScene(2)
            this.send(data)
        })
    }

    send(data) {
        let {list, msg} = this.sendData = data
        let sendData = this.sendData

        sendData.allLen   = list.length
        sendData.sendLen  = 0
        sendData.progress = 0
        sendData.failList = []

        ;
        (function loop() {
            sendData.curAccount = list.pop()

            let options = {
                MsgType   : 1,
                Content   : msg,
                ToUserName: sendData.curAccount.UserName
            }

            tools.sendMsg(options)
                .then(({data}) => {
                    if (!data.MsgID) return Promise.reject()

                    sendData.sendLen++
                    sendData.progress = (sendData.sendLen / sendData.allLen * 100).toFixed(2)
                })
                .catch((err) => {
                    sendData.failList.push(sendData.curAccount)
                })
                .finally(() => {
                    this.services.$timeout(() => {
                        if (list.length) {
                            loop()
                        } else {
                            this.toScene(3)
                        }
                    }, 1500)
                })

        }.bind(this))()
    }

    toScene(index) {
        this.scene = index
    }

    showSend() {
        this.services.$rootScope.$emit('helper:send:show')
        this.active = false
    }
}

export default {
    Ctrl,
    html: html
}