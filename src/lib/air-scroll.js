export default class {
    /**
     * 享元模式的list
     * @param options
     * @param options.selector
     * @param options.itemHeight
     * @param options.viewHeight
     */
    constructor(options) {
        this.selector   = options.selector
        this.itemHeight = options.itemHeight
        this.viewHeight = options.viewHeight
    }

    init(items) {
        this.sourceItems = items
        this.items       = items.slice(0, this.viewLen)
        this.destroy()

        this.$topPh    = angular.element('<li class="top-ph" style="margin: 0;padding: 0;"></li>')
        this.$bottomPh = angular.element('<li class="bottom-ph" style="margin: 0;padding: 0;"></li>')
        this.$elem
            .prepend(this.$topPh)
            .append(this.$bottomPh)
            .on('scroll', this.update.bind(this))
    }

    get $elem() {
        return angular.element(this.selector)
    }

    get viewLen() {
        return Math.ceil(this.viewHeight / this.itemHeight)
    }

    destroy() {
        this.$elem.find('.top-ph').remove()
        this.$elem.find('.bottom-ph').remove()
        this.$elem.off('scroll', this.update.bind(this))
    }

    update() {

    }

    initItems(sourceItems) {
        this.items       = []
        this.sourceItems = sourceItems
        this.init()
        this.updateItems()
    }

    setItems(start) {
        let {showLength, $rootScope, $timeout, bufferLength, itemHeight} = this.options
        let sourceItems                                                  = this.sourceItems
        let allHeight                                                    = sourceItems.length * itemHeight
        let topHeight                                                    = start * itemHeight
        let currentItemHeight                                            = this.$handle.height()
        let bottomHeight                                                 = allHeight - topHeight - currentItemHeight

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
        let $handle                              = angular.element(selector)
        let currentScrollHeight                  = $handle.scrollTop()

        if (currentScrollHeight > bufferLength * itemHeight) {
            this.setItems(currentScrollHeight / itemHeight)
        } else {
            this.setItems(0)
        }
    }
}