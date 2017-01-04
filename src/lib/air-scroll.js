export default class AirScroll {
    constructor(options, updateCb) {
        this.container       = options.container
        this.itemHeight      = options.itemHeight
        this.containerHeight = options.containerHeight
        this.sourceItems     = options.items
        this.items           = []
        this.updateCb        = updateCb

        this.init()
    }

    get viewHeight() {
        return this.containerHeight || this.container.offsetHeight
    }

    get viewLen() {
        return Math.ceil(this.viewHeight / this.itemHeight)
    }

    get viewScrollTop() {
        return this.container.scrollTop
    }

    get fromSlice() {
        return Math.max(Math.floor(this.viewScrollTop / this.itemHeight) - this.viewLen, 0)
    }

    get toSlice() {
        return Math.min(this.fromSlice + this.viewLen * 3, this.sourceItems.length)
    }

    init() {
        this.elemBufferTop    = this.createBufferElem('buffer-top')
        this.elemBufferBottom = this.createBufferElem('buffer-bottom')

        this.bufferUpdate = this.update.bind(this)
        this.container.prepend(this.elemBufferTop)
        this.container.appendChild(this.elemBufferBottom)
        this.container.addEventListener('scroll', this.bufferUpdate)
        this.update()
    }

    destroy() {
        this.items = []
        this.elemBufferTop.remove()
        this.elemBufferBottom.remove()
        this.container.removeEventListener('scroll', this.bufferUpdate)
    }

    update() {
        this.items = this.sourceItems.slice(this.fromSlice, this.toSlice)
        this.updateCb && this.updateCb(this.items, this.fromSlice, this.toSlice)
        this.elemBufferTop.style.height    = `${this.fromSlice * this.itemHeight}px`
        this.elemBufferBottom.style.height = `${(this.sourceItems.length - this.toSlice) * this.itemHeight}px`
    }

    createBufferElem(className) {
        let elem = document.createElement('li')

        elem.style.margin  = 0
        elem.style.padding = 0
        elem.style.height  = 0
        elem.classList.add(className)

        return elem
    }
}