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
        let {$timeout, selector, wrapItems, itemsField} = options

        this.options = options

        $timeout(() => {
            let $handle     = angular.element(selector)
            let scrollEvent = $handle.data('airScroll')

            $handle
                .prepend('<div class="top-placeholder"></div>')
                .append('<div class="bottom-placeholder"></div>')

            this.$topPlaceholder    = $handle.find('.top-placeholder')
            this.$bottomPlaceholder = $handle.find('.bottom-placeholder')
            this.initItems()

            if (scrollEvent) return

            let scrollFunc = () => {
                this.updateItems()
            }

            $handle
                .data('airScroll', scrollFunc)
                .on('scroll', scrollFunc)
        }, 1000)
    }

    initItems() {
        let {wrapItems, itemsField, bufferLength, showLength} = this.options

        this.sourceItems     = wrapItems[itemsField]
        this.viewItemsLength = showLength + bufferLength
        this.setItems(0)
    }

    setItems(start) {
        start                   = Math.floor(start)
        let {wrapItems, itemsField, showLength, $rootScope, itemHeight} = this.options
        let $handle             = angular.element(this.options.selector)
        let currentScrollHeight = $handle.scrollTop()
        let sourceItems         = this.sourceItems

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
        let handleHeight        = $handle.height()
        let bufferHeight        = this.options.itemHeight * this.options.bufferLength
        let currentScrollHeight = $handle.scrollTop()
        let scrollHeight        = $handle[0].scrollHeight - handleHeight

        if (currentScrollHeight > bufferLength * itemHeight) {
            this.setItems(currentScrollHeight / itemHeight)
        } else {
            this.setItems(0)
        }
    }
}