<template>
  <div id="app">
    <div class="nav">
      <h1>PAGE <span>项目可视化组件搭建工具</span></h1>
    </div>
    <div class="wrapper">
      <router-view/>
    </div>
    <div
      class="message"
      :class="{
        'message__show': showMessage
      }"
    >
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
  name: 'app',

  data () {
    return {
      messageArr: [],
      showMessage: false,
      loadingText: ''
    }
  },

  watch: {
    messageArr (val) {
      this.loadingText = val.length ? val[val.length - 1] : ''
      if (typeof this.loadingText === 'object') {
        this.loadingText = JSON.stringify(this.loadingText)
      }
      if (this.loadingText.length > 200) {
        this.loadingText = this.loadingText.substr(0, 200)
      }
      if (this.$refs.end) {
        this.$refs.end.scrollIntoView(false)
      }
    }
  },

  methods: {
    clearMessage () {
      this.messageArr = []
    },

    toggleMessage () {
      this.showMessage = !this.showMessage
    }
  }
}
</script>

<style lang="stylus">
html, body, #app
  height 100%

body
  margin 0
  font-size 14px
  background-color #f2f2f2

div
  box-sizing border-box

#app
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  color #262A30

.nav
  display flex
  align-items center
  height 50px
  background-color #4F5159
  h1
    margin 0
    padding 0 10px
    font-size 24px
    color: #409EFF
    font-weight: 400
    span
      font-size 12px
      color #aaa
.wrapper
  height calc(100% - 70px)
  margin 10px
  background-color #fff
  box-shadow 0 0 7px rgba(0, 0, 0, .1)
.title
  height 50px
  line-height 50px
  box-shadow: inset 0 -1px 0 0 #E9ECF0
  padding-left 20px

.el-table__header-wrapper
  th
    background-color #F7F8F9 !important
    box-shadow: inset 0 1px 0 0 #E9ECF0
.el-table td, .el-table th.is-leaf
  border-bottom none !important
.el-dialog__header
  border-bottom 1px #eee solid
  font-size: 14px
  color: #000
  .el-dialog__title
    font-size 14px
    line-height normal
    font-weight bold
.el-dialog__body
  padding 20px !important
.el-dialog__footer
  padding 0 20px 20px !important

.message
  position fixed
  width 900px
  height 600px
  top 50%
  left 50%
  transform translate3d(-50%, -200%, 0)
  overflow: auto
  padding 10px 15px
  border-radius 5px
  background-color rgba(0,0,0,.8)
  color #fff
  transition transform .5s ease-out
  z-index 3000
  &__show
    transform translate3d(-50%, -50%, 0)
  &__end
    margin-top 40px
    height 30px
</style>
