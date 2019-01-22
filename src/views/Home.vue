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
    <template v-if="recordsList">
      <p>记录列表</p>
      <div
        class="template__item"
        v-for="item in recordsList"
        :key="item.id"
        @click="editRecord(item)"
      >
        <p>name: {{ item.name }} / dir_name: {{ item.dir_name }}</p>
      </div>
    </template>
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
      recordsList: null
    }
  },

  async created () {
    // 写cookie
    const records = await this.$http.get('getRecords')
    this.recordsList = records.data

    const templates = await this.$http.get('getTemplate')
    this.templateList = templates.data
  },

  methods: {
    editRecord (item) {
      // this.socket('prepareTemplate', {
      //   templateId: item.template_id,
      //   projectName: item.dir_name,
      //   // pid: this.serverPid,
      //   recordId: item.id
      // })
      this.$router.push(`/create/record/${item.id}/${item.dir_name}`)
    },

    selectTemplate (templateItem) {
      const dirName = prompt('输入项目名称，字母数字')
      if (!dirName) {
        return
      }
      if (/^[a-zA-Z0-9]+$/.test(dirName)) {
        this.$router.push(`/create/template/${templateItem.id}/${dirName}`)
      } else {
        alert('只能输入字母数字')
      }
    }
  }
}
</script>

<style lang="stylus">
  .home
    width 70%
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
</style>
