import html from './send.html'
import AirScroll from '../lib/air-scroll'
import Checker from '../lib/Checker'

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
            selector  : '.transfer .item.contacts',
            itemHeight: 45,
            viewHeight: 387,
            $scope    : this.services.$rootScope
        })
        this.airScrollChatrooms = new AirScroll({
            selector  : '.transfer .item.chatrooms',
            itemHeight: 45,
            viewHeight: 387,
            $scope    : this.services.$rootScope
        })

        this.services.$rootScope.$on('helper:send:show', () => {
            this.show  = true
            this.model = {
                msg : 'test',
                list: [
                    {
                        "RemarkPYQuanPin"    : "",
                        "RemarkPYInitial"    : "",
                        "PYInitial"          : "WJCSZS",
                        "PYQuanPin"          : "wenjianchuanshuzhushou",
                        "Uin"                : 0,
                        "UserName"           : "filehelper",
                        "NickName"           : "File Transfer",
                        "HeadImgUrl"         : "/cgi-bin/mmwebwx-bin/webwxgeticon?seq=620171266&username=filehelper&skey=@crypt_cf81dc07_edb9981fcc3c20425769e717dfaa6881",
                        "ContactFlag"        : 3,
                        "MemberCount"        : 0,
                        "MemberList"         : [],
                        "RemarkName"         : "",
                        "HideInputBarFlag"   : 0,
                        "Sex"                : 0,
                        "Signature"          : "",
                        "VerifyFlag"         : 0,
                        "OwnerUin"           : 0,
                        "StarFriend"         : 0,
                        "AppAccountFlag"     : 0,
                        "Statues"            : 0,
                        "AttrStatus"         : 0,
                        "Province"           : "",
                        "City"               : "",
                        "Alias"              : "",
                        "SnsFlag"            : 0,
                        "UniFriend"          : 0,
                        "DisplayName"        : "",
                        "ChatRoomId"         : 0,
                        "KeyWord"            : "fil",
                        "EncryChatRoomId"    : "",
                        "MMOrderSymbol"      : "WENJIANCHUANSHUZHUSHOU",
                        "_index"             : 1,
                        "_h"                 : 64,
                        "_offsetTop"         : 64,
                        "MMCanCreateChatroom": false,
                        "MMDigest"           : "",
                        "NoticeCount"        : 0,
                        "MMTime"             : "",
                        "MMDigestTime"       : ""
                    }
                ]
            }
            this.list  = this.getContacts()
            this.airScrollContacts.init(this.list.contacts)
            this.airScrollChatrooms.init(this.list.chatrooms)
            this.contactsChecker  = new Checker({
                context: this.list,
                itemKey: 'contacts',
                idKey  : 'UserName'
            })
            this.chatroomsChecker = new Checker({
                context: this.list,
                itemKey: 'chatrooms',
                idKey  : 'UserName'
            })
        })
    }

    filterList(key, airList, sourceList) {
        this[airList].init(this.services.$filter('filter')(this.list[sourceList], key))
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

    toSend() {
        this.show = false
        this.services.$rootScope.$emit('helper:main:send', this.model)
    }
}

export default {
    Ctrl,
    html: html
}