export default class {
    /**
     * 享元模式的list
     * @param options
     * @param options.selector
     * @param options.itemHeight
     * @param options.viewHeight
     * @param options.$scope
     */
    constructor(options) {
        this.selector   = options.selector
        this.itemHeight = options.itemHeight
        this.viewHeight = options.viewHeight
        this.$scope     = options.$scope
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
        this.update()
    }

    get $elem() {
        return angular.element(this.selector)
    }

    get viewLen() {
        return Math.ceil(this.viewHeight / this.itemHeight)
    }

    get allHeight() {
        return this.sourceItems.length * this.itemHeight
    }

    destroy() {
        this.$elem.find('.top-ph').remove()
        this.$elem.find('.bottom-ph').remove()
        this.$elem.off('scroll', this.update.bind(this))
    }

    update() {
        let cusScroll = this.$elem.scrollTop()
        let start     = Math.floor(cusScroll / this.itemHeight)
        start         = start < 0 ? 0 : start

        if (cusScroll > this.itemHeight) {
            this.render(start)
        } else {
            this.render(0)
        }
    }

    render(start) {
        this.$scope.safeApply(() => {
            let end    = start + this.viewLen
            this.items = this.sourceItems.slice(start, end)

            let topH     = start * this.itemHeight
            let contentH = this.items.length * this.itemHeight
            this.$topPh.height(topH)
            this.$bottomPh.height(this.allHeight - topH - contentH)
        })
    }

    initItems(sourceItems) {
        this.items       = []
        this.sourceItems = sourceItems
        this.init()
    }
}


