<template>
  <div
    class="schema-item schema-input"
    :class="{
      'schema-input-textarea': isTextarea
    }"
  >
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-input
      size="mini"
      :value="splitValue[linkIndex]"
      :placeholder="placeholder"
      :type="isTextarea ? 'textarea' : undefined"
      :autosize="{ minRows: 3, maxRows: 6}"
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
    value: String,
    isTextarea: Boolean
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
  .schema-input-textarea.schema-item
    align-items flex-start
</style>
