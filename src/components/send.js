import html from './send.html'

class Ctrl {
    constructor(services) {
        this.services = services
        this.active   = false
    }
}

export default {
    Ctrl,
    html: html
}