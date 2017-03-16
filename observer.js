;(function () {
  function Observer (data, watchers, parent, parentKey) {
    this.data = data
    this.watchers = watchers || {}
    this.parent = parent || {} // pointer
    this.parentKey = parentKey || ''
    this.deepTraverse(data, this.watchers)
  }

  Observer.prototype.deepTraverse = function (obj, watchers) {
    for (let prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        if (obj[prop].constructor === Object) {
          new Observer(obj[prop], watchers, this, prop)
        } else {
          this.handle(prop, obj[prop], watchers)
        }
      }
    }
  }

  Observer.prototype.handle = function (key, val, watchers) {
    let that = this
    Object.defineProperty(this.data, key, {
      get: function () {
        console.log(`你访问了${key}`)
        return val
      },
      set: function (newVal) {
        console.log(`你设置了${key}新的值为${newVal}`)
        if (val !== newVal) {
          val = newVal
          let parent = that.parent
          let parentKey = that.parentKey
          while (parent) {
            that.$emit(parentKey, newVal) // bubble
            parentKey = parent.parentKey
            parent = parent.parent
          }
          that.$emit(key, newVal)
        }
        if (newVal.constructor === Object) {
          return new Observer(newVal, watchers, this, key)
        }
      }
    })
  }

  Observer.prototype.$watch = function (key, fn) {
    if (!this.watchers[key]) {
      this.watchers[key] = []
    }
    this.watchers[key].push(fn)
  }

  Observer.prototype.$emit = function () {
    const key = [].shift.call(arguments)
    const data = [].slice.call(arguments)
    const fns = this.watchers[key]
    if (!fns || !fns.length) return false
    fns.forEach(function (fn) {
      fn(data || {})
    })
  }

  if (typeof module === 'object') {
    module.exports = Observer
  } else {
    window.Observer = Observer
  }

})()