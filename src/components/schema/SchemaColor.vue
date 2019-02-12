<template>
  <div class="schema-color schema-item">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-color-picker
      :value="value"
      size="mini"
      @change="val => $emit('input', val)"
    />
  </div>
</template>

<script>
  export default {
    name: 'schema-input',

    props: {
      label: String,
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
