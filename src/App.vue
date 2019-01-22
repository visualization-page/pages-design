<template>
  <div id="app">
    <router-view/>
    <div class="message">
      <div class="message__wrap">
        <p
          v-for="(item, i) in messageArr.filter(x => x)"
          :key="item + i"
          v-html="typeof item === 'string' ? item.replace(/(\n)+/g, '<br>') : item"
        />
        <div class="message__end" ref="end"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      messageArr: []
    }
  },

  watch: {
    messageArr () {
      if (this.$refs.end) {
        this.$refs.end.scrollIntoView(false)
      }
    }
  }
}
</script>

<style lang="stylus">
html, body, #app
  height 100%

body
  margin: 0
  font-size 14px

div
  box-sizing border-box

#app
  display flex
  justify-content space-between
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #2c3e50

.message
  width 30%
  // flex-basis 400px
  overflow: auto
  padding 10px
  background-color #333
  color #fff
  height 100%
  &__end
    margin-top 40px
    height 30px
</style>
