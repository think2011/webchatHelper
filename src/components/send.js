import html from './send.html'
import AirScroll from '../lib/air-scroll'
import Checker from '../lib/Checker'

class Ctrl {
    constructor(services) {
        this.services   = services
        this.show       = false
        this.step       = 2
        this.contactTab = 1

        this._init()
    }

    _init() {
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

        this._initEvent()
    }

    _initEvent() {
        this.services.$rootScope.$on('helper:send:show', (event, listData, msg) => {
            this.model = {}
            this.show  = true
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

            if (listData && listData.length) {
                this.model.msg = msg
                this.toNext(2)
                listData.forEach((item) => {
                    if (item.isContact()) {
                        this.contactsChecker.check(item, true)
                        this.contactsChecker.update()
                    } else {
                        this.chatroomsChecker.check(item, true)
                        this.chatroomsChecker.update()
                    }
                })
            }
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
        let model = Object.assign({}, this.model)

        model.msg  = 'test'
        model.list = [].concat(this.contactsChecker.checkedItems).concat(this.chatroomsChecker.checkedItems)
        /*
         model.list = [
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
         "MMDigestTime"       : "",
         isContact            : function () {
         return true
         }
         }
         ]
         */

        this.show = false
        this.services.$rootScope.$emit('helper:main:send', model)
    }
}

export default {
    Ctrl,
    html: html
}