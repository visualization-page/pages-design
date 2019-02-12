import Vue from 'vue'

export default {
  data () {
    return {
      showResource: false
    }
  },

  created () {
    Vue.prototype.$showResource = params => {
      if (params instanceof Function) {
        Vue.prototype.$showResourceCb = params
        this.showResource = true
      } else {
        if (typeof params === 'string' && Vue.prototype.$showResourceCb) {
          Vue.prototype.$showResourceCb(params)
        }
        Vue.prototype.$showResourceCb = null
        this.showResource = false
      }
    }
  }
}
