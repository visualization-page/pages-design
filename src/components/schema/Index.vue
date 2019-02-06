<template>
  <div class="schema" v-if="mapData">
    <p>{{ schema.title }}</p>
    <template v-if="schema.subTypes && schema.subTypes.length">
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
    </template>
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
          v-model="mapData[field]"
        />
        <schema-color
          v-else-if="isColor(properties[field].format)"
          :key="field"
          :label="properties[field].title"
          v-model="mapData[field]"
        />
        <schema-input
          v-else-if="isDefault(properties[field].type)"
          :key="field"
          :label="properties[field].title"
          v-model="mapData[field]"
        />
      </template>
    </div>
  </div>
</template>

<script>
import FormatImage from './SchemaBlockImage'
import SchemaSelect from './SchemaSelect'
import SchemaInput from './SchemaInput'
import SchemaColor from './SchemaColor'

export default {
  data () {
    return {
      selectedSubTypesIndex: undefined,
      mapData: null
    }
  },

  props: {
    schema: Object
  },

  components: {
    FormatImage,
    SchemaInput,
    SchemaSelect,
    SchemaColor
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

  created () {
    if (this.schema.subTypes && this.schema.subTypes.length) {
      this.selectedSubTypesIndex = 0
    }

    this.mapData = this.initMapData(this.properties)
  },

  methods: {
    initMapData (obj) {
      const result = {}
      Object.keys(obj).forEach(key => {
        if (/block-/.test(obj[key].format)) {
          result[key] = []
          obj[key].enum.forEach(valItem => {
            result[key].push(valItem)
          })
        } else {
          result[key] = obj[key].default
        }
      })
      return result
    },

    getValue () {
      return JSON.parse(JSON.stringify(this.mapData))
    },

    isBlockImg (format) {
      return format === 'block-image'
    },

    isSelect (format) {
      return format === 'select'
    },

    isColor (format) {
      return format === 'color'
    },

    isArray (type) {
      return type === 'array'
    },

    isDefault (type) {
      return type === 'string'
    }
  }
}
</script>

<style lang="stylus">
.schema
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
  &-block-image-group
    margin 20px 0
    padding 20px 0
    border-top 1px solid #E9ECF0
    border-bottom 1px solid #E9ECF0
    .schema-format-image
      margin-bottom 20px
      &:last-child
        margin-bottom 0
</style>
