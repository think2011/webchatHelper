const pinyin = require("pinyin")

export default class {
    constructor(user) {
        this.user   = user
        this.groups = this._fetch()
    }

    save(items) {
        let name = prompt('给分组取个名字：')

        if (!name) return

        if (this.groups[name]) {
            if (!confirm(`已有【${name}】分组，要覆盖掉吗？`)) return
        }

        this.groups[name] = items.map((item) => {
            return {
                NickName  : item.NickName,
                RemarkName: item.RemarkName
            }
        })
        this._write()
    }

    del(name) {
        if (!confirm(`真的要删除【${name}】分组吗？`)) return

        delete this.groups[name]
        this._write()
    }

    _fetch() {
        return JSON.parse(localStorage[`groups_${this.user}`] || '{}')
    }

    _write() {
        return localStorage[`groups_${this.user}`] = JSON.stringify(this.groups)
    }
}

export class DynamicGroup {
    constructor(user) {
        this.user     = user
        this.emojiMap = {}

        for (let i = 0; i <= 9; i++) {
            this.emojiMap[`@${i}`] = {
                src: `<img class="emoji emoji3${i}20e3" text="_web" src="/zh_CN/htmledition/v2/images/spacer.gif" />`,
                reg: `spanclassemojiemoji3${i}20e3span\\??`
            }
        }

        this.groups = this._fetch()
    }

    _processName(name) {
        let obj = {
            name,
            showName: name,
            reg     : pinyin(name, {style: pinyin.STYLE_NORMAL}).join('')
        }

        // 转换emoji数字
        if (/@\d/.test(name)) {
            obj.showName = obj.showName.replace(/(@\d)/g, (matchStr) => this.emojiMap[matchStr].src)
            obj.reg      = obj.reg.replace(/(@\d)/g, (matchStr) => this.emojiMap[matchStr].reg)
        }

        // 替换繁体的"内"的相应拼音
        if (/内@/.test(name)) {
            obj.reg = obj.reg.replace(/neispan/g, (matchStr) => 'neispan|naspan')
        }

        obj.reg = new RegExp(obj.reg.replace(/[\@\#\$\%\^\&\*\{\}\:\"\<\>\(\)\_\-\']/g, ''))

        return obj
    }

    save() {
        let name = prompt('创建【备注名】中包含有以下【关键字】的分组\n输入【关键字】：')

        if (!name) return

        let processName = this._processName(name)

        if (this.groups.find((item) => item.name === processName.name)) {
            if (!confirm(`已有【${name}】分组，要覆盖掉吗？`)) return
        }

        this.groups.unshift(processName)
        this._write()
    }

    del(item) {
        if (!confirm(`真的要删除【${item.name}】分组吗？`)) return

        this.groups.splice(this.groups.indexOf(item), 1)
        this._write()
    }

    _fetch() {
        let items = JSON.parse(localStorage[`dynamic_groups_${this.user}`] || '[]')

        // 这里添加内置分组
        for (let i = 0; i <= 30; i++) {
            let index = `${i}`.split('').map((item) => `@${item}`).join('')

            items.push(
                `港${index}`
            )
        }

        for (let i = 0; i <= 30; i++) {
            let index = `${i}`.split('').map((item) => `@${item}`).join('')

            items.push(
                `内${index}`
            )
        }

        return items.map((item) => this._processName(item))
    }

    _write() {
        let items = this.groups
            .filter((item) => !(/内@|港@/g.test(item.name)))
            .map((item) => item.name)

        return localStorage[`dynamic_groups_${this.user}`] = JSON.stringify(items)
    }
}