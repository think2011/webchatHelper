export default class {
    /**
     * 享元模式的list
     * @param options
     * @param options.selector  元素选择器
     * @param options.itemHeight
     * @param options.showLength
     * @param options.bufferLength
     * @param options.wrapItems
     * @param options.itemsField
     * @param options.$scope
     * @param options.$timeout
     */
    constructor(options) {
        let {$timeout, $scope, selector, wrapItems, itemsField} = options

        this.options = options

        let $handle = angular.element(selector)

        $handle
            .prepend('<div class="top-placeholder"></div>')
            .append('<div class="bottom-placeholder"></div>')

        this.$topPlaceholder    = $handle.find('.top-placeholder')
        this.$bottomPlaceholder = $handle.find('.bottom-placeholder')

        $handle.on('scroll', this.updateItems.bind(this))
    }

    initItems() {
        let {wrapItems, itemsField, bufferLength, showLength} = this.options

        this.sourceItems     = wrapItems[itemsField]
        this.viewItemsLength = showLength + bufferLength
        this.setItems(0)
    }

    setItems(start) {
        start           = Math.floor(start)
        let {wrapItems, itemsField, showLength, $rootScope, itemHeight} = this.options
        let sourceItems = this.sourceItems

        let allHeight         = (sourceItems.length - showLength) * itemHeight
        let topHeight         = start * itemHeight
        let currentItemHeight = showLength * itemHeight
        let bottomHeight      = allHeight - topHeight - currentItemHeight

        this.$topPlaceholder.css({height: topHeight})
        this.$bottomPlaceholder.css({height: bottomHeight})

        $rootScope.safeApply(() => {
            wrapItems[itemsField] = sourceItems.slice(start, start + this.viewItemsLength)
        })
    }

    updateItems() {
        let {itemHeight, showLength, bufferLength} = this.options
        let $handle             = angular.element(this.options.selector)
        let currentScrollHeight = $handle.scrollTop()

        if (currentScrollHeight > bufferLength * itemHeight) {
            this.setItems(currentScrollHeight / itemHeight)
        } else {
            this.setItems(0)
        }
    }
}