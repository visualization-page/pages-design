<template>
  <div class="schema-item schema-input-number">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-input-number
      size="mini"
      controls-position="right"
      :value="value"
      :placeholder="placeholder"
      :min="0"
      :max="10000"
      @change="val => $emit('input', val)"
    />
  </div>
</template>

<script>
export default {
  name: 'schema-input',

  props: {
    label: String,
    placeholder: String,
    value: [String, Number]
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
</style>
