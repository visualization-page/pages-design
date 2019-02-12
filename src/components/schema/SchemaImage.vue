<template>
  <div class="schema-item schema-image">
    <span class="schema-item__label" v-if="label">{{ label }}：</span>
    <div class="schema-image__img" @click="handle">
      <img v-if="value" :src="value">
      <div class="schema-image__img--mask">点击{{ value ? '修改' : '添加' }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'schema-image',

  data () {
    return {
    }
  },

  props: {
    label: String,
    placeholder: String,
    value: String
  },

  methods: {
    handle () {
      this.$showResource(src => {
        this.$emit('input', src)
      })
    }
  }
}
</script>

<style lang="stylus">
  .schema-image
    align-items flex-start !important
    &__img
      position relative
      width 84px
      height 84px
      background-color #fff
      border 1px #dcdfe6 solid
      border-radius 4px
      overflow hidden
      color #999
      cursor pointer
      img
        max-width 100%
        max-height 100%
        transform: translate(-50%, -50%)
        margin: 50% 0 0 50%
      &--mask
        position absolute
        bottom 0
        width 100%
        background-color rgba(0, 0, 0, .5)
        text-align center
        color #fff
        padding 5px 0
</style>
