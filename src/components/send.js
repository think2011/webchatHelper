import html from './send.html'

class Ctrl {
    constructor(services) {
        this.services = services
        this.show     = true
        this.step     = 2
    }

    toNext(index) {
        this.step = index
    }
}

export default {
    Ctrl,
    html: html
}