<template>
  <div class="schema" v-if="mapData">
    <!--<p>{{ schema.title }}</p>-->
    <div class="schema__subtype" v-if="schema.subTypes && schema.subTypes.length">
      <p>选择模版</p>
      <div
        v-for="(item, i) in schema.subTypes"
        :key="i"
        class="schema__sub"
        :class="{
          'schema__sub--active': i === selectedSubTypesIndex
        }"
        @click="selectedSubTypesIndex = i"
      >
        <div class="schema__sub--cover"></div>
        <span>{{ item.title }}</span>
      </div>
    </div>
    <div class="schema__properties">
      <template v-for="field in Object.keys(properties)">
        <div
          v-if="isArray(properties[field].type) && isBlockImg(properties[field].format)"
          class="schema-block-image-group"
        >
          <format-image
            v-for="(valItem, i) in properties[field].enum"
            :key="`${field}-${i}`"
            :schema="properties[field].properties"
            v-model="mapData[field][i]"
          />
        </div>
        <schema-select
          v-else-if="isSelect(properties[field].format)"
          :key="field"
          :label="properties[field].title"
          :options="properties[field].options"
          :is-link="properties[field].isLink"
          v-model="mapData[field]"
        >
          <schema-input
            v-if="properties[field].isLink"
            :is-link="properties[field].isLink"
            v-model="mapData[field]"
          />
        </schema-select>
        <schema-color
          v-else-if="isColor(properties[field].format)"
          :key="field"
          :label="properties[field].title"
          v-model="mapData[field]"
        />
        <schema-image
          v-else-if="isImage(properties[field].format)"
          :key="field"
          :label="properties[field].title"
          v-model="mapData[field]"
        />
        <schema-input-number
          v-else-if="isNumber(properties[field].type)"
          :key="field"
          :label="properties[field].title"
          v-model="mapData[field]"
        />
        <schema-input
          v-else-if="isDefault(properties[field].type)"
          :key="field"
          :label="properties[field].title"
          :is-textarea="isTextarea(properties[field].format)"
          v-model="mapData[field]"
        />
      </template>
    </div>

    <resource
      v-if="showResource"
    />
  </div>
</template>

<script>
import FormatImage from './SchemaBlockImage'
import SchemaSelect from './SchemaSelect'
import SchemaInput from './SchemaInput'
import SchemaInputNumber from './SchemaInputNumber'
import SchemaColor from './SchemaColor'
import SchemaImage from './SchemaImage'
import formatType from './mixin/formatType'
import resource from './mixin/resource'
import Resource from './Resource'

export default {
  name: 'Schema',

  data () {
    return {
      selectedSubTypesIndex: undefined,
      mapData: null
    }
  },

  props: {
    schema: Object
  },

  mixins: [formatType, resource],

  components: {
    FormatImage,
    SchemaInput,
    SchemaSelect,
    SchemaColor,
    SchemaImage,
    Resource,
    SchemaInputNumber
  },

  computed: {
    properties () {
      let result = { ...this.schema.properties }
      if (this.selectedSubTypesIndex !== undefined) {
        result = Object.assign(result, this.schema.subTypes[this.selectedSubTypesIndex].properties)
      }
      return result
    }
  },

  watch: {
    selectedSubTypesIndex () {
      this.mapData = this.initMapData(this.properties)
    },
    schema (val) {
      this.mapData = null
      if (val) {
        this.init()
      }
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      if (this.schema.subTypes && this.schema.subTypes.length) {
        this.selectedSubTypesIndex = 0
      } else {
        this.selectedSubTypesIndex = undefined
      }
      this.mapData = this.initMapData(this.properties)
    },

    initMapData (obj) {
      const result = {}
      Object.keys(obj).forEach(key => {
        const { format } = obj[key]
        if (/block-/.test(format)) {
          result[key] = []
          obj[key].enum.forEach((valItem, i) => {
            result[key].push(this.mapData && this.mapData[key][i] || valItem)
          })
        } else {
          result[key] = obj[key].overwrite
            ? obj[key].default
            : this.mapData && this.mapData[key] || obj[key].default
        }
      })
      return result
    },

    getValue () {
      return JSON.parse(JSON.stringify(this.mapData))
    }
  }
}
</script>

<style lang="stylus">
.schema
  &__subtype
    margin-bottom 20px
    padding-bottom 20px
    border-bottom 1px solid #E9ECF0
  &__sub
    display inline-block
    border 1px #eee solid
    width 74px
    height 72px
    font-size 12px
    text-align center
    margin-right 10px
    &:last-child
      margin-right 0
    &--active
      border-color #488FF9
    &--cover
      width 64px
      height 40px
      margin 5px
      background-color #f2f2f2
  &-item
    display flex
    align-items center
    margin-bottom 10px
    &:last-child
      margin-bottom 0
    &__label
      flex 0 0 60px
      font-size 12px
</style>
