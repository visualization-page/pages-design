<template>
  <div
    v-if="isInnerLink"
  >
    <schema-select
      v-if="innerOptions"
      :options="innerOptions"
      v-model="innerVal"
    />
    <span v-else>获取数据...</span>
  </div>
  <schema-input
    :is-link="fieldData.isLink"
    :value="value"
    @input="val => $emit('input', val)"
    v-else
  />
</template>

<script>
import SchemaInput from './SchemaInput'
import SchemaSelect from './SchemaSelect'

export default {
  name: 'SchemaSelectLink',

  components: {
    SchemaInput,
    SchemaSelect
  },

  props: {
    fieldData: Object,
    value: String
  },

  data () {
    return {
      innerVal: '',
      innerOptions: null
    }
  },

  computed: {
    isInnerLink () {
      return this.value && this.value.split('_')[0] === 'inner'
    }
  },

  watch: {
    innerVal (val) {
      this.broadcastInnerVal(val)
    },
    value (val) {
      // const res = val.split('_')[0]
      // if (res === 'link') {
      //   this.broadcastInnerVal('https://', 'link')
      // } else if (res === 'tel') {
      //   this.broadcastInnerVal('tel://', 'tel')
      // } else {
      //   this.broadcastInnerVal(this.innerOptions[0].value)
      // }
    }
  },

  created () {
    this.getAsyncData()
  },

  methods: {
    async getAsyncData () {
      this.innerOptions = await this.$parent.$parent.getAsyncData('innerPageLink')
      if (!this.value) {
        this.innerVal = this.innerOptions[0].value
        this.broadcastInnerVal()
      }
    },

    broadcastInnerVal (val, type = 'inner') {
      this.$emit('input', `${type}_${val || this.innerVal}`)
    }
  }
}
</script>

<style lang="stylus">

</style>
