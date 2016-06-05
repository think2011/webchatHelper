import tools from '../tools'
import './ng-transfer.scss'

class Ctrl {
    constructor($scope) {
        $scope.ctrl = this

        this.initList()
        this.groups = this.fetchGroups()
        this.tab    = 1
    }

    initList() {
        this.from = {
            items: angular.copy(tools.fetchAllContacts())
        }
        this.to   = {
            items: []
        }
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
        return items.some((item) => item.checked)
    }

    saveGroups() {
        let name = prompt('给分组取个名字：')

        if (!name) return

        this.groups.unshift({
            name,
            items: this.to.items
        })

        this.writeGroups()

        alert('保存完毕')
    }

    selectGroup(group) {
        this.initList()

        this.from.items.forEach((item) => {
            item.checked = group.some((groupItem) => groupItem.UserName === item.UserName)
        })

        this.transfer(this.from.items, this.to.items)
        this.tab = 0
    }

    delGroup(group) {
        window.event.stopPropagation()
        window.event.preventDefault()

        this.groups = this.groups.filter((item) => item.name !== group.name)

        this.writeGroups()
    }


    fetchGroups() {
        return JSON.parse(localStorage.wechatHelperGroups || '[]')
    }

    writeGroups() {
        let groups = this.groups

        return localStorage.wechatHelperGroups = JSON.stringify(groups)
    }
}

export default Ctrl