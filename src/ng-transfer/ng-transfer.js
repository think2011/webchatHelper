import tools from '../tools'
import './ng-transfer.scss'

class Ctrl {
    constructor($scope) {
        $scope.ctrl = this

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
}

export default Ctrl