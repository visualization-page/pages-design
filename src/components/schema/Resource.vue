<template>
  <div class="resource">
    <div class="resource__content">
      <div class="resource__title">
        <span>资源库</span>
      </div>
      <div class="resource__list">
        <div class="resource__list--container">
          <div
            v-for="(item, i) in local"
            :key="i"
            @click="choose(item)"
            class="resource__list--item"
          >
            <img :src="item">
          </div>
        </div>
      </div>
      <div class="resource__close" @click="$showResource(false)">关闭</div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      local: [
        'http://h.hiphotos.baidu.com/image/h%3D300/sign=07a6146a68380cd7f91ea4ed9146ad14/ca1349540923dd54e1964cb2dc09b3de9d824807.jpg',
        'http://a.hiphotos.baidu.com/image/h%3D300/sign=9528ef388ccb39dbdec06156e01409a7/2f738bd4b31c8701e96739342a7f9e2f0608ff0b.jpg',
        'http://b.hiphotos.baidu.com/image/h%3D300/sign=a8d02e1ccecec3fd943ea175e68ad4b6/1f178a82b9014a90e7c1956da4773912b21bee67.jpg'
      ]
    }
  },

  methods: {
    choose (item) {
      // this.$showResourceCb(item)
      this.$showResource(item)
    }
  }
}
</script>

<style lang="stylus">
  .resource
    position fixed
    width 100%
    top 0
    left 0
    bottom 0
    z-index 1000
    background-color rgba(0, 0, 0, .7)
    &__title
      line-height 40px
      border-bottom 1px #eee solid
      font-size 14px
      font-weight bold
      padding-left 15px
    &__content
      position relative
      width 600px
      height 400px
      margin-left calc(50vw - 300px)
      margin-top calc(50vh - 200px)
      background-color #fff
    &__list
      height calc(100% - 40px)
      overflow auto
      &--container
        display flex
        flex-flow wrap
      &--item
        width 130px
        height 150px
        margin 10px 5px 0 5px
        border 1px #eee solid
        & img
          max-width 100%
          max-height 100%
          transform: translate(-50%, -50%)
          margin: 50% 0 0 50%
    &__close
      display flex
      align-items center
      justify-content center
      position absolute
      width 40px
      height 40px
      right 0
      top 0
      // background-color #f2f2f2
      font-size 12px
      color #999
      cursor pointer
</style>
