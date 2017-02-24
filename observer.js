function Observer (data) {
  this.data = data
  this.deepTraverse(data)
}

Observer.prototype.deepTraverse = function (obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop].constructor === Object) {
        new Observer(obj[prop])
      } else {
        this.handle(prop, obj[prop])
      }
    }
  }
}

Observer.prototype.handle = function (key, val) {
  Object.defineProperty(this.data, key, {
    get: function () {
      console.log(`你访问了${key}`)
      return val
    },
    set: function (newVal) {
      console.log(`你设置了${key},新的值为${newVal}`)
      val = newVal
    }
  })
}
