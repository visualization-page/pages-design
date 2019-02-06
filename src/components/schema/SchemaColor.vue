<template>
  <div class="schema-color schema-item">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <el-color-picker :value="value" @change="val => $emit('input', val)"></el-color-picker>
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
