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