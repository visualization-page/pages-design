<template>
  <div
    class="home"
    v-loading.fullscreen.lock="fullscreenLoading"
    element-loading-text="下载模版中，请耐心等待"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      <span>项目信息</span>
    </div>
    <div class="home__content">
      <el-button type="primary" size="medium" @click="newProject">新建项目</el-button>
      <div class="home__content--list">
        <el-table
          :data="recordsList"
          stripe
          style="width: 100%">
          <el-table-column
            prop="id"
            width="60px"
            label="编号"
          />
          <el-table-column
            prop="dir_name"
            label="项目名称"
          />
          <el-table-column
            prop="url"
            width="400px"
            label="项目地址"
          />
          <el-table-column
            prop="description"
            label="说明"
          />
          <el-table-column
            prop="created_at"
            label="创建时间">
          </el-table-column>
          <el-table-column
            align="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="editRecord(scope.row)">编辑</el-button>
              <el-button size="mini" type="text" @click="delRecord(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <el-dialog
      title="选择模版"
      :visible.sync="dialogVisible"
      width="540px"
    >
      <div class="template__list">
        <div
          class="template__item"
          v-for="item in templateList"
          :key="item.id"
        >
          <div class="template__item--thumb">
            <img :src="item.thumbnail">
          </div>
          <p class="template__item--title">{{ item.name }}模版</p>
          <div class="template__item--btn">
            <el-button type="primary" plain size="mini" @click="selectTemplate(item)">立即创建</el-button>
          </div>
        </div>
      </div>
    </el-dialog>

    <el-dialog
      title="输入项目名称"
      :visible.sync="showInputName"
      width="450px"
    >
      <el-form :model="form" :rules="rules" ref="ruleForm">
        <el-form-item prop="name">
          <el-input size="small" v-model="form.name" placeholder="字母、数字、下划线" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="createProject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SOCKET } from '../constant'
import socket from '../mixins/socket'

export default {
  name: 'home',

  components: {
  },

  mixins: [socket],

  data () {
    const validate = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入'))
      } else if (!/^[a-zA-Z0-9-]+$/.test(value)) {
        callback(new Error('只能为字母、数字、下划线'))
      } else {
        callback()
      }
    }

    return {
      templateList: [],
      recordsList: [],
      dialogVisible: false,
      showInputName: false,
      fullscreenLoading: false,
      form: {
        name: ''
      },
      rules: {
        name: [
          { validator: validate, trigger: 'blur' }
        ]
      },
      selectedTemplate: null
    }
  },

  async created () {
    this.$parent.messageArr = []

    // 写cookie
    const records = await this.$http.get('getRecords')
    this.recordsList = records.data

    const templates = await this.$http.get('getTemplate')
    this.templateList = templates.data
  },

  methods: {
    editRecord (item) {
      this.$router.push(`/project/edit/${item.id}/${item.dir_name}`)
    },

    newProject () {
      this.dialogVisible = true
    },

    selectTemplate (item) {
      this.selectedTemplate = item
      this.showInputName = true
    },

    createProject () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.makeTemplate(this.selectedTemplate.id, this.form.name)
        } else {
          return false
        }
      })
    },

    makeTemplate (id, dirName) {
      this.fullscreenLoading = true
      this.socket(SOCKET.PREPARE_TEMPLATE, {
        templateId: id,
        dirName
      })
    },

    afterMakeTemplate ({ recordId, dirName }) {
      this.fullscreenLoading = false
      this.$router.push(`/project/edit/${recordId}/${dirName}`)
    },

    async delRecord (item) {
      const ok = await this.$confirm('确定要删除吗？', { type: 'warning' })
      if (ok !== 'confirm') return
      const loading = this.$loading()
      await this.$http.post('delRecord', { id: item.id, dirName: item.dir_name })
      const index = this.recordsList.findIndex(x => x.id === item.id)
      this.recordsList.splice(index, 1)
      loading.close()
    }
  }
}
</script>

<style lang="stylus">
  .home
    height 100%
    &__content
      padding 20px
      &--list
        margin-top 20px
  .template
    &__list
      display flex
      justify-content space-between
    &__item
      width 240px
      height 380px
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.10)
      border-radius: 4px
      overflow: hidden
      &--thumb
        width 220px
        height 280px
        margin 10px auto
        background-color #f2f2f2
        img
          max-width 100%
      &--title
        padding-left 10px
      &--btn
        text-align right
        padding-right 10px
</style>
