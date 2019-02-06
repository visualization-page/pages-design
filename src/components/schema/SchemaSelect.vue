<template>
  <div class="schema-item schema-select">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-select
      :value="value"
      @change="val => $emit('input', val)"
      placeholder="请选择"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
export default {
  name: 'schema-select',

  data () {
    return {
      // value: ''
    }
  },

  props: {
    options: Array,
    label: String,
    // defaultValue: [String, Number]
    value: [String, Number]
  },

  created () {
    // this.value = this.defaultValue
  }
}
</script>

<style lang="stylus">
  .schema-select
    // display flex
    // align-items center
</style>
