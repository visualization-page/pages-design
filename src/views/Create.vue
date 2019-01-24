<template>
  <div class="create">
    <div class="create__column">
      <div v-if="componentList" class="component__wrap">
        <p>组件库列表</p>
        <div class="component__com">
          <div
            v-for="(item, i) in componentList"
            :key="i"
            class="component__item"
            @click="putComponent(item)"
          >
            {{ item.nameText }}
          </div>
        </div>

        <p><a href="javascript:" @click.stop="kill">结束server进程</a></p>
        <p><a href="javascript:" @click="lookProcess">查看当前存活进程</a></p>
        <button @click="publish">打包发布</button>
      </div>
      <div class="template__preview">
        <iframe
          class="template__mobile"
          v-if="serverUrl"
          ref="iframe"
          :src="`${serverUrl}?t=${Date.now()}`"
          frameborder="0"
        />
      </div>
      <div class="template__components">
        <p>已使用组件列表</p>
        <div
          v-for="(item, i) in templateComponents"
          :key="i"
          class="template__components--wrap"
        >
          <div
            class="template__components--item"
            :class="{
              'template__components--active': selectedComponent && selectedComponent.id === item.id
            }"
            @click="showSchema(item)"
          >
            {{ item.nameText }}
          </div>
          <a href="javascript:" @click="delComponent(item)">删除</a>
        </div>
      </div>
      <div class="editor">
        <div ref="editor" id="editor__holder"></div>
        <button v-if="editorInstance" @click="saveEditor">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import JSONEditor from '@json-editor/json-editor'

export default {
  name: 'create',

  data () {
    return {
      componentList: null,
      serverPid: 0,
      serverUrl: null,
      templateComponents: null,
      selectedComponent: null,
      editorInstance: null
    }
  },

  computed: {
    isCreate () {
      return this.$route.params.type === 'template' // record
    }
  },

  watch: {
    selectedComponent (val) {
      if (this.editorInstance) {
        this.editorInstance.destroy()
      }
      if (val) {
        this.editorInstance = new JSONEditor(this.$refs.editor, {
          schema: val.schema
        })
      }
    }
  },

  sockets: {
    connect () {
      this.$socket.emit('chat', 'hello egg')
    },
    operatorLog (val) {
      this.$parent.messageArr.push(val)
      if (this.$parent.messageArr.length > 500) {
        this.$parent.messageArr.splice(500, this.$parent.messageArr.length)
      }
      if (typeof val === 'object' && val.result) {
        switch (val.name) {
          case 'prepareTemplate':
            this.afterMakeTemplate(val.result)
            break
          case 'projectInfo':
            this.handleProjectInfo(val.result)
            break
          case 'killServer':
            console.log('111')
            break
          case 'putComponent':
            this.afterPutComponent(val.result)
            break
          case 'delComponents':
            this.afterDelComponents(val.result)
            break
          case 'updateComponents':
            this.afterUpdateComponents(val.result)
            break
        }
      }
    }
  },

  created () {
    if (this.isCreate) {
      this.makeTemplate()
    } else {
      this.socket('projectInfo', this.$route.params.dirName)
    }
  },

  mounted () {
  },

  methods: {
    publish () {
      this.socket('publish', this.$route.params.dirName)
    },

    socket (fnName, params) {
      this.$socket.emit('chat', [fnName, params])
    },

    kill () {
      this.socket('killServer', { pid: this.serverPid, dirName: this.$route.params.dirName })
    },

    lookProcess () {
      this.socket('lookProcess', this.$route.params.dirName)
    },

    makeTemplate () {
      const { id, dirName } = this.$route.params
      this.socket('prepareTemplate', {
        [this.isCreate ? 'templateId' : 'recordId']: id,
        projectName: dirName
      })
    },

    afterMakeTemplate ({ pid, url, recordId }) {
      this.serverPid = pid
      this.serverUrl = url
      if (this.isCreate) {
        const { dirName } = this.$route.params
        this.$router.replace(`/create/record/${recordId}/${dirName}`)
      }
      this.getComponents()
    },

    getComponents () {
      const { dirName } = this.$route.params
      this.$http.get('getComponents', { dirName }).then(res => {
        this.componentList = res.data
      })
    },

    handleProjectInfo (data) {
      if (data.pid) {
        this.serverPid = data.pid
        this.serverUrl = data.url
        this.getComponents()
      } else {
        this.makeTemplate()
      }

      this.templateComponents = data.components
    },

    showSchema (item) {
      // item.schema.properties
      Object.keys(item.props).forEach(key => {
        item.schema.properties[key].default = item.props[key]
      })
      this.selectedComponent = item
    },

    refreshIframe () {
      this.$refs.iframe.contentWindow.location.reload()
    },

    putComponent (item) {
      this.socket('putComponent', { item, dirName: this.$route.params.dirName })
    },

    afterPutComponent () {
      this.socket('projectInfo', this.$route.params.dirName)
      this.refreshIframe()
    },

    saveEditor () {
      const value = this.editorInstance.getValue()
      const { dirName } = this.$route.params

      this.socket('updateComponents', { dirName, props: value, componentId: this.selectedComponent.id })
    },

    afterUpdateComponents () {
      this.refreshIframe()
    },

    delComponent (item) {
      const { dirName } = this.$route.params
      this.socket('delComponents', { dirName, componentId: item.id })
    },

    afterDelComponents (id) {
      const index = this.templateComponents.find(x => x.id === id)
      this.templateComponents.splice(index, 1)
      if (this.selectedComponent && id === this.selectedComponent.id) {
        this.selectedComponent = null
      }
    }
  }
}
</script>

<style lang="stylus">
.create
  &__column
    display flex
    height 100%
.component
  &__wrap
    width 250px
  &__com
    display flex
  &__item
    display flex
    align-items center
    justify-content center
    width 60px
    height 60px
    border 1px #eee solid
.template
  &__preview
    position relative
    min-width 500px
    height 100%
    background-color #333
  &__mobile
    position absolute
    left 50%
    top 50%
    transform translate(-50%, -50%)
    width 320px
    height 480px
    border 1px #eee solid
    background-color #fff
  &__components
    display flex
    align-items center
    flex-direction column
    width 200px
    border-right 1px #eee solid
    &--wrap
      display flex
      align-items center
    &--item
      width 100px
      height 40px
      border 1px #eee solid
      display flex
      align-items center
      justify-content center
      margin-bottom 10px
    &--active
      background-color azure

.editor
  padding-left 15px
</style>
