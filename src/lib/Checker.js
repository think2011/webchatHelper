export default class {
    /**
     * 生成一个 checker
     * @param context 是一个object，跟itemKey配合得到items
     * @param itemKey context中的items的key
     * @param idKey 用于匹配的值
     */
    constructor({context, itemKey, idKey}) {
        this.context          = context
        this.itemKey          = itemKey
        this.idKey            = idKey
        this.isAllChecked     = false
        this.checkedItemsTemp = {}
        this.checkedItems     = []
    }

    _getMapItems() {
        return this.context[this.itemKey] || []
    }

    check(item, state) {
        this._check(item, state)
        this.updateChecked()
    }

    _check(item, state) {
        if (window.event.target.tagName === 'INPUT') {
            state = !state
        }

        if (state) {
            this.checkedItemsTemp[item[this.idKey]] = item
        } else {
            let index = this._getMapItems().findIndex((mItem) => {
                return mItem[this.idKey] === item[this.idKey]
            })

            if (index !== -1) this._getMapItems()[index]._checked = state
            delete this.checkedItemsTemp[item[this.idKey]]
        }

        item._checked = state
    }

    allCheck() {
        let items = this._getMapItems()

        if (this.isAllChecked) {
            items.forEach((item) => {
                this._check(item, false)
            })
        } else {
            items.forEach((item) => {
                this._check(item, true)
            })
        }

        this.updateChecked()
    }

    updateChecked() {
        this.checkedItems = []
        for (var p in this.checkedItemsTemp) {
            if (!this.checkedItemsTemp.hasOwnProperty(p)) continue;

            this.checkedItems.push(this.checkedItemsTemp[p])
        }

        this.isAllChecked = this._getMapItems().every((item) => item._checked)
    }

    update() {
        this._getMapItems().forEach((mItem) => {
            mItem._checked = !!mItem._checked

            // 检查已选
            if (this.checkedItemsTemp[mItem[this.idKey]]) mItem._checked = true

            // 更新状态
            if (mItem._checked) {
                this.checkedItemsTemp[mItem[this.idKey]] = mItem
            } else {
                delete this.checkedItemsTemp[mItem[this.idKey]]
            }
        })

        this.updateChecked()
    }

    destroy() {
        this.checkedItemsTemp = {}
        this.checkedItems     = []
    }

}