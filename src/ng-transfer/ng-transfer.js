var moduleName = 'transfer'

class Ctrl {
    constructor() {
        this.from = {
            items: angular.copy(this.cfgItems)
        }
        this.to   = {
            items: []
        }

        this.modelItems = this.to.items
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

angular.module(moduleName, [])
    .directive('transfer', () => {
        return {
            bindToController: {
                cfgItems  : '=',
                modelItems: '='
            },
            scope           : {},
            restrict        : 'AE',
            controller      : Ctrl,
            controllerAs    : 'ctrl',
            templateUrl     : './ng-transfer.html'
        }
    })

export default moduleName