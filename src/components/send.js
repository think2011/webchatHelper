import html from './send.html'

class Ctrl {
    constructor(services) {
        this.services = services
        this.show     = false
        this.step     = 2
        this.contactTab = 1

        this.init()
    }

    init() {
        this.services.$rootScope.$on('helper:send:show', () => {
            this.show     = true
            this.list = this.getContacts()
        })
    }

    changeContactTab(index) {
        this.contactTab = index
    }

    getContacts() {
        return {
            contacts: this.services.contactFactory.pickContacts(["friend"], {
                friend: {
                    noHeader      : true,
                    isWithoutBrand: true
                },
            }, true).result,

            chatrooms: this.services.contactFactory.pickContacts(["chatroom"], {
                chatroom: {
                    noHeader      : true,
                    isWithoutBrand: true
                },
            }, true).result
        }
    }

    toNext(index) {
        this.step = index
    }
}

export default {
    Ctrl,
    html: html
}