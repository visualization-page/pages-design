<template>
  <div class="schema-format-image schema-item">
    <div class="schema-format-image__item">
      <div class="schema-format-image__item--left">
        <schema-image
          :value="''"
        />
      </div>
      <div class="schema-format-image__item--right">
        <template
          v-for="key in Object.keys(schema)"
          v-if="key !== imageKey"
        >
          <schema-select
            v-if="$parent.isSelect(schema[key].format)"
            :key="`schema-format-image-${key}`"
            :label="schema[key].title"
            :options="schema[key].options"
            v-model="local[key]"
          />
          <schema-input
            v-else
            :key="`schema-format-image-${key}`"
            :label="schema[key].title"
            v-model="local[key]"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import SchemaInput from './SchemaInput'
import SchemaImage from './SchemaImage'
import SchemaSelect from './SchemaSelect'

export default {
  data () {
    return {
      local: {}
    }
  },

  props: {
    schema: Object,
    value: {
      type: Object,
      default () {
        return {}
      }
    }
  },

  components: {
    SchemaImage,
    SchemaInput,
    SchemaSelect
  },

  computed: {
    imageKey () {
      return Object.keys(this.schema).find(x => this.schema[x].format === 'image')
    }
  },

  watch: {
    local(val) {
      this.$emit('input', val)
    }
  },

  created () {
    // todo 拷贝value
    this.local = JSON.parse(JSON.stringify(this.value))
  }
}
</script>

<style lang="stylus">
.schema-format-image
  &__item
    display flex
    background-color #f7f8f9
    border 1px dashed #E9ECF0
    padding 10px
    &--left
      margin-right 16px
    &--right
      & > div
        margin-bottom 20px
        &:last-child
          margin-bottom 0
</style>
