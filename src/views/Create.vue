<template>
  <div
    class="project"
    v-loading.fullscreen.lock="fullscreenLoading"
    :element-loading-text="$parent.loadingText"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      <el-button plain size="mini" icon="el-icon-arrow-left" @click="$router.push('/')">返回</el-button>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">项目信息</el-breadcrumb-item>
        <el-breadcrumb-item>编辑项目</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="project__content">
      <div class="project__basic">
        <div class="project__info project__block--title">
          <div style="margin-bottom: 20px">页面设置</div>
          <el-form label-width="75px" :model="pageConfigForm" :rules="pageConfigRules" ref="pageConfigForm">
            <el-form-item prop="title" label="页面标题" required>
              <el-input v-model="pageConfigForm.title" size="mini" />
            </el-form-item>
            <el-form-item label="背景颜色" prop="bgColor" required>
              <el-color-picker color-format="hex" v-model="pageConfigForm.bgColor" size="mini"/>
              <span class="label-desc">{{ pageConfigForm.bgColor }}</span>
            </el-form-item>
          </el-form>
          <div class="project__block--btn">
            <el-button type="primary" size="mini" @click="savePageConfig">保存配置</el-button>
          </div>
        </div>
        <div class="project__components project__block--title">
          <div>组件库列表</div>
          <div v-if="componentList" class="project__components--wrap">
            <div
              v-for="(item, i) in componentList"
              :key="i"
              class="project__components--item"
              @click="putComponent(item)"
            >
              {{ item.nameText }}
            </div>
          </div>
        </div>
      </div>
      <div class="project__preview">
        <div class="project__preview--mobile">
          <div class="project__preview--mobile-bar">
            <span>{{ pageConfigForm.title }}</span>
          </div>
          <iframe
            v-if="serverUrl"
            ref="iframe"
            :src="`${serverUrl}`"
            frameborder="0"
          />
        </div>
        <div
          class="project__preview--components project__block--title"
        >
          <div>已使用组件</div>
          <draggable
            class="project__preview--components-item"
            :value="templateComponents"
            @input="dragEnd"
          >
            <el-tag
              v-for="item in templateComponents"
              :key="item.id"
              :type="selectedComponent && selectedComponent.id === item.id ? '' : 'info'"
              closable
              @click.native.stop="showSchema(item)"
              @close="delComponent(item)"
            >
              <i class="el-icon-rank"></i>
              {{ item.nameText }}
            </el-tag>
          </draggable>
        </div>
      </div>
      <div class="project__form project__block--title">
        <div>编辑组件属性</div>
        <schema
          v-if="selectedComponent"
          ref="schema"
          :schema="selectedComponent.schema"
          :get-async-data="getSchemaAsyncData"
        />
        <!--<div ref="editor" id="editor__holder"></div>-->
        <div class="project__block--btn">
          <el-button
            v-if="selectedComponent"
            size="mini"
            type="primary"
            @click="saveEditor"
          >
            保存配置
          </el-button>
        </div>
      </div>
    </div>
    <div class="project__btn">
      <el-button size="mini" v-show="!$parent.showMessage" type="primary" @click="publish">构建发布</el-button>
      <el-button size="mini" v-show="!$parent.showMessage" @click="lookProcess">查看当前存活进程</el-button>
      <el-button size="mini" @click="$parent.toggleMessage">{{ $parent.showMessage ? '关闭' : '显示' }}日志面板</el-button>
    </div>
  </div>
</template>

<script>
// import JSONEditor from '@json-editor/json-editor'
import draggable from 'vuedraggable'
import { SOCKET } from '../constant'
import socket from '../mixins/socket'
import Schema from '../components/schema/Index'
import checkUserLeave from '../mixins/checkUserLeave'

export default {
  name: 'project',

  components: {
    draggable,
    Schema
  },

  data () {
    return {
      componentList: null,
      serverUrl: null,
      templateComponents: null,
      selectedComponent: null,
      // editorInstance: null,
      fullscreenLoading: false,

      pageConfigForm: {
        title: '',
        bgColor: '#f7f8f9'
      },
      pageConfigRules: {
        title: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      },
      unloadPage: false
    }
  },

  mixins: [socket, checkUserLeave],

  computed: {
    isEdit () {
      return this.$route.params.type === 'edit'
    },

    dirName () {
      return this.$route.params.dirName
    },

    pageId () {
      return this.$route.query.pageId
    }
  },

  watch: {
    selectedComponent (val) {
      // console.log(val)
      // if (this.editorInstance) {
      //   this.editorInstance.destroy()
      //   this.editorInstance = null
      // }
      // if (val) {
      //   this.editorInstance = new JSONEditor(this.$refs.editor, {
      //     schema: val.schema
      //   })
      // }
    }
  },

  created () {
    if (this.isEdit) {
      this.setProjectStatus('edit')
      this.checkProjectTemplateAndComponentVersion()
      this.getComponents()
    }

    // window.onunload = () => {
    //   this.setProjectStatus()
    // }
    // window.addEventListener('popstate', () => {
    // })
  },

  beforeRouteLeave (to, from, next) {
    this.$confirm('确定要离开吗？').then(() => {
      this.setProjectStatus()
      next()
    }).catch(() => {
      next(false)
    })
  },

  destroyed () {
  },

  methods: {
    savePageConfig () {
      this.$refs.pageConfigForm.validate(valid => {
        if (valid) {
          this.fullscreenLoading = true
          this.socket(SOCKET.SAVE_PAGE_CONFIG, {
            ...this.pageConfigForm,
            dirName: this.dirName,
            pageId: this.pageId
          })
        } else {
          return false
        }
      })
    },

    afterSavePageConfig () {
      this.fullscreenLoading = false
    },

    publish () {
      this.fullscreenLoading = true
      this.socket(SOCKET.PUBLISH, this.dirName)
    },

    afterPublish () {
      this.fullscreenLoading = false
      this.$parent.clearMessage()
      this.$message.success('构建成功')
    },

    lookProcess () {
      this.$parent.clearMessage()
      this.$parent.toggleMessage()
      this.socket(SOCKET.LOOK_PROCESS, this.dirName)
    },

    getProjectInfo () {
      this.socket(SOCKET.PROJECT_INFO, { dirName: this.dirName, pageId: this.pageId })
    },

    afterProjectInfo ({ components, url, title, bgColor }) {
      this.templateComponents = components
      this.serverUrl = url
      this.pageConfigForm.title = title
      this.pageConfigForm.bgColor = bgColor
    },

    getComponents () {
      this.$http.get('getComponents', { dirName: this.dirName }).then(res => {
        this.componentList = res.data
      })
    },

    // 选中已使用组件
    showSchema (item) {
      Object.keys(item.props).forEach(key => {
        if (item.schema.properties[key]) {
          item.schema.properties[key].default = item.props[key]
        } else if (item.schema.subTypes) {
          const subItem = item.schema.subTypes.find(x => x.properties[key])
          subItem && (subItem.properties[key].default = item.props[key])
        }
      })
      this.selectedComponent = item
      this.iframeWindowMirrorFocus(item)
    },

    refreshIframe () {
      this.$refs.iframe.contentWindow.location.reload()
      if (this.selectedComponent) {
        setTimeout(() => {
          this.iframeWindowMirrorFocus(this.selectedComponent)
        }, 500)
      }
    },

    putComponent (item) {
      this.fullscreenLoading = true
      this.socket(SOCKET.PUT_COMPONENT, {
        item,
        dirName: this.dirName,
        pageId: this.pageId
      })
    },

    afterPutComponent (item) {
      this.fullscreenLoading = false
      this.templateComponents.push(item)
      this.refreshIframe()
    },

    saveEditor () {
      this.socket(SOCKET.UPDATE_COMPONENT, {
        dirName: this.dirName,
        pageId: this.pageId,
        props: this.$refs.schema.getValue(),
        componentId: this.selectedComponent.id
      })
    },

    afterUpdateSchema (templateComponents) {
      // 更新本地组件配置
      this.templateComponents = templateComponents
      this.refreshIframe()
    },

    delComponent (item) {
      this.socket(SOCKET.DEL_COMPONENT, {
        dirName: this.dirName,
        pageId: this.pageId,
        componentId: item.id
      })
    },

    afterDelComponents ({ componentId, components }) {
      this.templateComponents = components
      if (this.selectedComponent && componentId === this.selectedComponent.id) {
        this.selectedComponent = null
      }
      this.refreshIframe()
    },

    dragEnd (data) {
      this.templateComponents = data
      this.socket(SOCKET.UPDATE_COMPONENT_SORT, {
        pageId: this.pageId,
        data,
        dirName: this.dirName
      })
    },

    checkProjectTemplateAndComponentVersion () {
      this.fullscreenLoading = true
      this.socket(SOCKET.CHECK_UPDATE, { dirName: this.dirName })
    },

    afterCheckProjectTemplateAndComponentVersion () {
      this.fullscreenLoading = false
      this.getProjectInfo()
    },

    // 将当前选中组件滚动到视野内并focus
    iframeWindowMirrorFocus (item) {
      const { document } = this.$refs.iframe.contentWindow
      const componentsElem = document.querySelector('.components')
      const componentsSort = componentsElem.getAttribute('data-id-sort').split(',')
      const itemIndex = componentsSort.findIndex(x => x === item.id)
      componentsElem.childNodes[itemIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      componentsElem.childNodes.forEach(item => { item.style.boxShadow = '' })
      componentsElem.childNodes[itemIndex].style.boxShadow = '0 0 10px red'
    },

    getSchemaAsyncData (key) {
      if (key === 'innerPageLink') {
        const res = localStorage.getItem(`page_${this.pageId || 0}`)
        return Promise.resolve(JSON.parse(res).map(x => ({
          label: x.name || x.id,
          value: x.id === 0 ? '/' : `/${x.value}`
        })))
      }
    }
  }
}
</script>

<style lang="stylus">
.project
  position relative
  height 100%
  .title
    display flex
    align-items center
  .el-breadcrumb
    margin-left 10px
    .is-link
      color #409EFF
  &__content
    display flex
    justify-content space-between
    height calc(100% - 100px)
  &__basic
    width 300px
    height 100%
    &>div
      height 50%
    .el-form-item__label
      font-size 12px
    .el-form-item__content
      display flex
      align-items center
      .label-desc
        font-size 12px
        color #999
        margin-left 10px
    .el-form-item
      margin-bottom 10px
  &__info
    position relative
  &__components
    border-top 1px #eee solid
    &--wrap
      display flex
    &--item
      width 70px
      height 30px
      background-color #f2f2f2
      display flex
      align-items center
      justify-content center
      margin 10px 10px 0 0
      cursor pointer
  &__form
    position relative
    width 400px
    height 100%
    .schema
      position: absolute
      left: 15px
      right 15px
      bottom: 38px
      top: 50px
      background-color: #fff
      overflow: auto
  &__preview
    position relative
    width calc(100% - 700px)
    height 100%
    border-left 1px #eee solid
    border-right 1px #eee solid
    &--mobile
      position absolute
      width 320px
      left calc((100% - 320px - 115px) / 2)
      top 30px
      bottom 30px
      border: 1px solid #E9ECF0
      box-shadow: 0 4px 10px 0 rgba(0,0,0,0.10)
      &-bar
        height 57px
        background-image url('../assets/mobile-bar.jpg')
        background-size 100% auto
        background-repeat no-repeat
        display flex
        justify-content center
        align-items flex-end
        padding-bottom 12px
    iframe
      width 100%
      height calc(100% - 62px)
      margin-top 5px
    &--components
      position absolute
      right 0
      height 100%
      top 0
      background-color #fff
      border-left 1px #eee solid
      &-item
        display flex
        flex-direction column
        span
          margin-top 10px
  &__btn
    position absolute
    bottom 0
    width 100%
    height 50px
    display flex
    justify-content center
    align-items center
    border-top 1px #eee solid
  &__block--title
    padding 30px 15px 30px
  &__block--btn
    position absolute
    width 100%
    bottom 0
    left 0
    text-align center
    // padding-top 30px
    padding 5px 0
    background-color #fff
    // border-top 1px solid #E9ECF0
</style>
