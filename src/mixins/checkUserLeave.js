export default {
  data () {
    return {
      count: 0
    }
  },

  mounted () {
    this.$_countFn()
  },

  methods: {
    $_countFn () {
      setTimeout(() => {
        this.count += 1
        if (this.count === 60) {
          this.$_notice()
        } else {
          this.$_countFn()
        }
      }, 1000)
    },

    $_notice () {
      this.$alert('您已处于离开状态，请确认操作').then(() => {
        location.reload()
      }).catch(() => {
        location.reload()
      })
    }
  }
}
