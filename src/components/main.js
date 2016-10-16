import html from './main.html'

class Ctrl {
    constructor(services) {
        this.services = services
        this.active   = false
        this.scene    = 1
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