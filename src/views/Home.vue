<template>
  <div class="home">
    <div class="template">
      <div
        class="template__item"
        v-for="item in templateList"
        :key="item.id"
        @click="selectTemplate(item)"
      >
        <img :src="item.thumbnail" alt="">
        <p>{{ item.name }}</p>
        <p @click.stop="kill">结束进程</p>
      </div>
    </div>
    <div class="message">
      <div class="message__wrap">
        <p v-for="(item, i) in messageArr" :key="item + i">{{ item }}</p>
        <div class="message__end" ref="end"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'home',
  components: {
  },

  data () {
    return {
      templateList: null,
      messageArr: [],
      serverPid: 0
    }
  },

  watch: {
    messageArr() {
      if (this.$refs.end) {
        this.$refs.end.scrollIntoView(false)
      }
    }
  },

  sockets: {
    connect () {
      this.$socket.emit('chat', 'hello egg')
    },
    operatorLog (val) {
      this.messageArr.push(val)
      if (typeof val === 'object' && val.result) {
        switch (val.name) {
          case 'prepareTemplate': {
            this.serverPid = val.result.serverPid
          } break
          case 'killServer': {
            console.log('111')
          } break
        }
      }
    }
  },

  async created () {
    // 写cookie
    document.cookie = 'userId=1'
    await this.$http.get('initCookie', { userId: 1 })

    this.$http.get('getTemplate').then(res => {
      this.templateList = res.data
    })
  },

  mounted () {
  },

  methods: {
    socket (fnName, params) {
      this.$socket.emit('chat', [fnName, params])
    },

    kill () {
      this.socket('killServer', this.serverPid)
    },

    selectTemplate (item) {
      const dirName = prompt('输入项目名称，字母数字')
      if (!dirName) {
        return
      }
      if (/^[a-zA-Z0-9]+$/.test(dirName)) {
        this.socket('prepareTemplate', { templateId: item.id, projectName: dirName })
      } else {
        alert('只能输入字母数字')
      }
    }
  }
}
</script>

<style lang="stylus">
  .template
    display flex
    &__item
      border 1px #eee solid

  .message
    width 1000px
    height 400px
    overflow: auto
    margin 10px auto
    padding 0 15px
    border 1px #eee solid
    &__end
      height 30px
</style>
