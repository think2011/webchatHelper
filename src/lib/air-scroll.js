export default class {
    /**
     * 享元模式的list
     * @param options
     * @param options.selector  元素选择器
     * @param options.itemHeight
     * @param options.bufferLength
     * @param options.$scope
     * @param options.$timeout
     */
    constructor(options) {
        let {selector} = options

        this.options = options
    }

    init() {
        let $handle = this.$handle = angular.element(this.options.selector)

        $handle.find('.top-placeholder').remove()
        $handle.find('.bottom-placeholder').remove()

        $handle.prepend('<li class="top-placeholder" style="margin: 0;padding: 0;"></li>')
        $handle.append('<li class="bottom-placeholder" style="margin: 0;padding: 0;"></li>')

        this.$topPlaceholder    = $handle.find('.top-placeholder')
        this.$bottomPlaceholder = $handle.find('.bottom-placeholder')
        this.$handle.off().on('scroll', this.updateItems.bind(this))
    }

    initItems(sourceItems) {
        this.items       = []
        this.sourceItems = sourceItems
        this.init()
        this.updateItems()
    }

    setItems(start) {
        let {showLength, $rootScope, $timeout, bufferLength, itemHeight} = this.options
        let sourceItems       = this.sourceItems
        let allHeight         = sourceItems.length * itemHeight
        let topHeight         = start * itemHeight
        let currentItemHeight = this.$handle.height()
        let bottomHeight      = allHeight - topHeight - currentItemHeight

        this.$topPlaceholder.css({height: topHeight})
        this.$bottomPlaceholder.css({height: bottomHeight})

        $timeout(() => {
            let end = Math.ceil(start + currentItemHeight / itemHeight + bufferLength)
            if (end <= bufferLength) end = 20

            if (bottomHeight < itemHeight && this.sourceItems.length >= 20) {
                return this.$bottomPlaceholder.css({height: 0})
            }
            this.items = sourceItems.slice(start, end)
        })
    }

    updateItems() {
        let {itemHeight, bufferLength, selector} = this.options
        let $handle             = angular.element(selector)
        let currentScrollHeight = $handle.scrollTop()

        if (currentScrollHeight > bufferLength * itemHeight) {
            this.setItems(currentScrollHeight / itemHeight)
        } else {
            this.setItems(0)
        }
    }
}