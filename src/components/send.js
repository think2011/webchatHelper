import html from './send.html'

class Ctrl {
    constructor(services) {
        this.services = services
        this.show     = false
        this.step     = 2

        this.init()
    }

    init() {
        this.services.$rootScope.$on('helper:send:show', () => {
            this.show = true
        })
    }

    toNext(index) {
        this.step = index
    }
}

export default {
    Ctrl,
    html: html
}