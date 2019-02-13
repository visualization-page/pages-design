export default {
  props: {
    isLink: Boolean
  },

  computed: {
    splitValue () {
      if (this.isLink && this.value) {
        const arr = this.value.split('_')
        return [arr[0], arr.length > 2 ? arr.slice(1, arr.length).join('_') : arr[1]]
      }
      return [this.value, this.value]
    }
  },

  methods: {
    handleChange (val, type) {
      let value = val
      if (this.isLink) {
        value = type === 1
          ? `${val}_${this.splitValue[type]}`
          : `${this.splitValue[type]}_${val}`
      }
      // console.log(value)
      this.$emit('input', value)
    }
  }
}
