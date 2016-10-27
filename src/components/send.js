import html from './send.html'
import AirScroll from '../lib/air-scroll'

class Ctrl {
    constructor(services) {
        this.services   = services
        this.show       = false
        this.step       = 2
        this.contactTab = 1

        this.init()
    }

    init() {
        this.airScrollContact = new AirScroll({
            selector    : '.transfer .item.contact',
            itemHeight  : 45,
            bufferLength: 5,
            $scope      : this.services.$scope,
            $rootScope  : this.services.$rootScope,
            $timeout    : this.services.$timeout
        })

        this.services.$rootScope.$on('helper:send:show', () => {
            this.show = true
            this.list = this.getContacts()
            this.airScrollContact.initItems(this.list.contacts)
        })
    }

    filterList(key, airList, sourceList) {
        let newList = this.services.$filter('filter')(this.list[sourceList], key)

        this[airList].initItems(newList)
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