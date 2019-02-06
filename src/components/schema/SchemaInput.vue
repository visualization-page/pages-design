<template>
  <div class="schema-item schema-input">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-input :value="value" @input="val => $emit('input', val)"/>
  </div>
</template>

<script>
export default {
  name: 'schema-input',

  props: {
    label: String,
    // defaultValue: [String, Number],
    value: String
  },

  data () {
    return {
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
