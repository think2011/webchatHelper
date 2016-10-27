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
        this.airScrollContacts  = new AirScroll({
            selector    : '.transfer .item.contacts',
            itemHeight  : 45,
            bufferLength: 5,
            $scope      : this.services.$scope,
            $rootScope  : this.services.$rootScope,
            $timeout    : this.services.$timeout
        })
        this.airScrollChatrooms = new AirScroll({
            selector    : '.transfer .item.chatrooms',
            itemHeight  : 45,
            bufferLength: 5,
            $scope      : this.services.$scope,
            $rootScope  : this.services.$rootScope,
            $timeout    : this.services.$timeout
        })

        this.services.$rootScope.$on('helper:send:show', () => {
            this.show = true
            this.list = this.getContacts()
            this.airScrollContacts.initItems(this.list.contacts)
            this.airScrollChatrooms.initItems(this.list.chatrooms)
        })
    }

    filterList(key, airList, sourceList) {
        this[airList].initItems(this.services.$filter('filter')(this.list[sourceList], key))
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