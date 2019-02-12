<template>
  <div class="schema-item schema-input">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-input
      size="mini"
      :value="splitValue[linkIndex]"
      :placeholder="placeholder"
      @input="val => handleChange(val, 0)"
    />
  </div>
</template>

<script>
import link from './mixin/link'

export default {
  name: 'schema-input',

  props: {
    label: String,
    placeholder: String,
    value: String
  },

  mixins: [link],

  data () {
    return {
      linkIndex: 1
    }
  },

  created () {
  }
}
</script>

<style lang="stylus">
  .schema-input
    // display flex
    // align-items center
</style>
