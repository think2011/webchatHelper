import html from './send.html'
import AirScroll from '../lib/air-scroll'
import Checker from '../lib/Checker'
import Groups, {
    DynamicGroup
} from '../lib/Groups'
import tools from '../tools'

class Ctrl {
    constructor(services) {
        this.services         = services
        this.show             = null
        this.step             = 1
        this.contactTab       = 1
        this.sendInterval     = 1500
        this.sendIntervalType = 'on'
        this.isWxFaceShowed   = false
        this.intervalTimer    = null
        this.groups           = new Groups(tools.getAccount().NickName)
        this.dynamicGroups    = new DynamicGroup(tools.getAccount().NickName)

        this._init()
    }

    _init() {
        this._initEvent()
    }

    _initEvent() {
        this.services.$rootScope.$watch(() => this.show, (newVal) => {
            if (newVal !== false) return
            this._restore()
        })

        this.services.$rootScope.$on('helper:send:show', (event, listData, msg) => {
            this.model = {}
            this.show  = true

            this.toNext(1)
            if (Object.keys(this.groups.groups).length) this.changeContactTab(3)

            // 处理输入框
            this._initEditor(msg)

            // 处理联系人名单
            this.list               = this.getContacts()
            this.airScrollContacts  = new AirScroll({
                container      : document.querySelector('.transfer .item.contacts'),
                itemHeight     : 45,
                containerHeight: 542,
                items          : this.list.contacts
            }, (items) => {
                this.services.$timeout(() => this.airScrollContacts.items = items)
            })
            this.airScrollChatrooms = new AirScroll({
                container      : document.querySelector('.transfer .item.chatrooms'),
                itemHeight     : 45,
                containerHeight: 542,
                items          : this.list.chatrooms
            }, (items) => {
                this.services.$timeout(() => this.airScrollChatrooms.items = items)
            })
            this.contactsChecker    = new Checker({
                context: this.list,
                itemKey: 'contacts',
                idKey  : 'UserName'
            })
            this.chatroomsChecker   = new Checker({
                context: this.list,
                itemKey: 'chatrooms',
                idKey  : 'UserName'
            })

            if (listData && listData.length) {
                this.toNext(2)
                listData.forEach((item) => {
                    if (item.isContact()) {
                        this.contactsChecker.check(item, true)
                    } else {
                        this.chatroomsChecker.check(item, true)
                    }
                })

                this.contactsChecker.update()
                this.chatroomsChecker.update()
            }
        })
    }

    _initEditor(msg) {
        this.services.$state.go('contact')
        this.services.$state.go('chat', {userName: 'filehelper'})

        this.services.$interval.cancel(this.intervalTimer)
        this.intervalTimer = this.services.$interval(() => {
            this.isWxFaceShowed = !!angular.element('.editor-container #mmpop_emoji_panel').length
        }, 300)
        this.services.$timeout(() => {
            let $editor     = angular.element('[ng-controller="chatSenderController"]')
            let editorScope = this.editorScope = angular.element('#editArea').scope()

            angular.element('.editor-container').append($editor)
            this.editorScope.editAreaCtn = msg
            editorScope.sendTextMessage  = () => true
            angular.element('#editArea').focus()
        })
    }

    updateMsg() {
        this.model.msg = this.editorScope.editAreaCtn
    }

    _restore() {
        angular.element('#editArea').scope().editAreaCtn = ''
        angular.element('.editor-container').empty()

        this.services.$timeout(() => {
            this.services.$state.go('contact')
            this.services.$state.go('chat', {userName: 'filehelper'})
        })
        this.contactKey   = ''
        this.chatroomsKey = ''
        this.checkedKey   = ''
        this.list         = {
            contacts : [],
            chatrooms: [],
        }
        this.airScrollContacts.destroy()
        this.airScrollChatrooms.destroy()
        this.contactsChecker.destroy()
        this.chatroomsChecker.destroy()
    }

    forecastTime() {
        if (!this.chatroomsChecker) return

        let interval = this.sendIntervalType === 'off' ? 100 : this.sendInterval
        let time     = (this.chatroomsChecker.checkedItems.length + this.contactsChecker.checkedItems.length) * interval
        let result   = null

        switch (true) {
            case time > 1000 * 60:
                result = `${(time / 60000).toFixed(2)}分钟`
                break;

            case time < 1000 * 60:
                result = `${(time / 1000).toFixed(2)}秒`
                break;

            default:
                result = '无法计算'
            //
        }

        return result
    }

    filterList(key, airList, sourceList) {
        this[airList].update(this.services.$filter('filter')(this.list[sourceList], key))
    }

    changeContactTab(index) {
        this.contactTab = index
    }

    selectGroup(key, groups, replace = false) {
        [this.contactsChecker, this.chatroomsChecker].forEach((checker) => {
            if (replace) {
                // 取消已选
                checker.checkedItems.forEach((item) => {
                    checker.check(item, false)
                })
            }

            // 载入items
            let items = checker.context[checker.itemKey]
            groups.forEach((groupItem) => {
                let matchItem = items.find((checkerItem) => {
                    if (groupItem.RemarkName) {
                        return groupItem.RemarkName === checkerItem.RemarkName
                    } else {
                        return groupItem.NickName === checkerItem.NickName
                    }
                })

                if (matchItem) checker.check(matchItem, true)
            })
            this.showMsgContent(`${replace ? '替换' : '叠加'}【${key}】分组到已选列表`)
        })
    }

    saveGroups() {
        this.groups.save(this.contactsChecker.checkedItems.concat(this.chatroomsChecker.checkedItems))
        this.changeContactTab(3)
    }

    showMsgContent(msg) {
        this.msgContent = msg

        this.services.$timeout.cancel(this.msgTimer)
        this.msgTimer = this.services.$timeout(() => {
            this.msgContent = null
        }, 2500)
    }

    selectDynamicGroup(groupItem, replace = false) {
        [this.contactsChecker].forEach((checker) => {
            if (replace) {
                // 取消已选
                checker.checkedItems.forEach((item) => {
                    checker.check(item, false)
                })
            }

            // 载入items
            this.getItemsByRemarkName(groupItem).forEach((item) => checker.check(item, true))
            this.showMsgContent(`${replace ? '替换' : '叠加'}【${groupItem.showName}】分组到已选列表`)
        })
    }

    getItemsByRemarkName(groupItem) {
        if (!this.contactsChecker) return
        let items = this.contactsChecker.context[this.contactsChecker.itemKey]

        return items.filter((item) => item.RemarkName.includes(groupItem.name) || groupItem.reg.test(item.RemarkPYQuanPin))
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

        model.interval = this.sendIntervalType === 'off' ? 0 : this.sendInterval
        model.list     = [].concat(this.contactsChecker.checkedItems).concat(this.chatroomsChecker.checkedItems)
        this.show      = false
        this.services.$rootScope.$emit('helper:main:send', model)
        this.toNext(1)
    }
}

export default {
    Ctrl,
    html: html
}