<template>
  <div class="home">
    <div class="template">
      <div v-if="templateList" class="template__wrap">
        <p>模版列表</p>
        <div
          class="template__item"
          v-for="item in templateList"
          :key="item.id"
          @click="selectTemplate(item)"
        >
          <img :src="item.thumbnail" width="100px">
          <p>{{ item.name }}</p>
        </div>
      </div>
    </div>
    <div v-if="componentList" class="component__wrap">
      <p>组件列表</p>
      <div
        v-for="(item, i) in componentList"
        :key="i"
        class="component__item"
        @click="putComponent(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <iframe
      class="template__preview"
      v-if="serverUrl"
      :src="serverUrl"
      frameborder="0"
    />
    <p><a href="javascript:" @click.stop="kill">结束server进程</a></p>
    <p><a href="javascript:" @click="lookProcess">查看当前存活进程</a></p>
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
      componentList: null,
      serverPid: 0,
      serverUrl: null,
      projectName: null
    }
  },

  sockets: {
    connect () {
      this.$socket.emit('chat', 'hello egg')
    },
    operatorLog (val) {
      this.$parent.messageArr.push(val)
      if (typeof val === 'object' && val.result) {
        switch (val.name) {
          case 'prepareTemplate': {
            this.serverPid = val.result.serverPid
            this.serverUrl = val.result.url
            // server 启动后 拉取组件列表
            this.$http.get('getComponents', { projectName: this.projectName }).then(res => {
              this.componentList = res.data
            })
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

    lookProcess () {
      this.socket('lookProcess', this.projectName)
    },

    selectTemplate (item) {
      const dirName = prompt('输入项目名称，字母数字')
      if (!dirName) {
        return
      }
      if (/^[a-zA-Z0-9]+$/.test(dirName)) {
        this.projectName = dirName
        this.socket('prepareTemplate', {
          templateId: item.id,
          projectName: dirName,
          pid: this.serverPid
        })
      } else {
        alert('只能输入字母数字')
      }
    },

    putComponent (item) {
      this.socket('putComponent', item)
    }
  }
}
</script>

<style lang="stylus">
  .home
    width 65%
    height 100%
    text-align center
  .template
    display flex
    justify-content center
    &__wrap
      display flex
      margin 0 auto
      flex-direction column
    &__item
      border 1px #eee solid
    &__preview
      display block
      width 320px
      height 480px
      margin 0 auto
      border 1px #eee solid
</style>
