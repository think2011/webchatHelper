import tools from '../tools'
import './ng-transfer.scss'

class Ctrl {
    constructor($scope, $timeout) {
        this.$timeout = $timeout
        this.$scope   = $scope
        $scope.ctrl   = this

        this.initList()
        this.account  = tools.getAccount()
        this.NickName = this.account.NickName
        this.groups   = this.fetchGroups()
        this.tab      = this.groups.length ? 1 : 0
    }

    initList() {
        this.from = {
            items: angular.copy(tools.fetchAllContacts())
        }
        this.to   = {
            items: []
        }

        // TODO ZH 16/6/11 
        this.$timeout(() => {
            this.from.sourceItems = this.from.items
            this.from.items       = this.from.sourceItems.slice(0, 10)

            angular.element('.transfer-list:eq(0)').on('scroll', () => {
                this.from.items = this.from.sourceItems.slice(0, this.from.items.length + 1)
                this.$scope.$apply()
            })
        },1000)
    }

    transfer(fromItems, toItems) {
        for (var i = 0; i < fromItems.length; i++) {
            if (fromItems[i].checked) {
                fromItems[i].checked = false
                toItems.push(...fromItems.splice(i, 1))
                i--
            }
        }
    }

    hasSomeChecked(items) {
        return items && items.some((item) => item.checked)
    }

    filterFunc(expected) {
        return (item) => {
            if (!expected) return item

            let reg = new RegExp(expected, 'ig')
            return reg.test(item.RemarkName) || reg.test(item.NickName)
        }
    }

    saveGroups() {
        let name = prompt('给分组取个名字：')

        if (!name) return

        if (this.groups[name]) {
            if (!confirm(`已有【${name}】分组，要覆盖掉吗？`)) return
        }

        this.groups[name] = this.to.items.map((item) => {
            return {
                NickName  : item.NickName,
                RemarkName: item.RemarkName
            }
        })

        this.writeGroups()
    }

    selectGroup(groupItems) {
        this.initList()
        this.from.items.forEach((item) => {
            item.checked = groupItems.some((groupItem) => {
                if (item.RemarkName) {
                    return item.RemarkName === groupItem.RemarkName
                } else {
                    return item.NickName === groupItem.NickName
                }
            })
        })

        this.transfer(this.from.items, this.to.items)
        this.tab = 0
    }

    delGroup(id) {
        window.event.stopPropagation()
        window.event.preventDefault()

        delete this.groups[id]

        this.writeGroups()
    }


    fetchGroups() {
        return JSON.parse(localStorage[`groups_${this.NickName}`] || '{}')
    }

    writeGroups() {
        return localStorage[`groups_${this.NickName}`] = JSON.stringify(this.groups)
    }
}

Ctrl.$inject = ['$scope', '$timeout']


export default Ctrl