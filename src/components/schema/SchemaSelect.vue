<template>
  <div class="schema-item schema-select">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-select
      :value="splitValue[linkIndex]"
      @change="val => handleChange(val, 1)"
      placeholder="请选择"
      size="mini"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <slot />
  </div>
</template>

<script>
import link from './mixin/link'

export default {
  name: 'schema-select',

  data () {
    return {
      linkIndex: 0
    }
  },

  mixins: [link],

  props: {
    options: Array,
    label: String,
    value: [String, Number]
  },

  created () {
  }
}
</script>

<style lang="stylus">
  .schema-select
    // display flex
    // align-items center
    .el-select
      margin-right 10px
</style>
