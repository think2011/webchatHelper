import tools from '../tools'
import './ng-transfer.scss'

class Ctrl {
    constructor($scope) {
        $scope.ctrl = this

        this.initList()
        this.account  = tools.getAccount()
        this.userName = this.account.UserName
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
            id   : Date.now(),
            items: this.to.items.map((item) => item.UserName)
        })

        this.writeGroups()

        alert('保存完毕')
    }

    selectGroup(group) {
        this.initList()

        this.from.items.forEach((item) => {
            item.checked = group.includes(item.UserName)
        })

        this.transfer(this.from.items, this.to.items)
        this.tab = 0
    }

    delGroup(group) {
        window.event.stopPropagation()
        window.event.preventDefault()

        this.groups = this.groups.filter((item) => item.id !== group.id)

        this.writeGroups()
    }


    fetchGroups() {
        return JSON.parse(localStorage[`groups_${this.userName}`] || '[]')
    }

    writeGroups() {
        return localStorage[`groups_${this.userName}`] = JSON.stringify(this.groups)
    }
}

export default Ctrl