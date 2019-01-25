import { SOCKET } from '../constant'

export default {
  sockets: {
    connect () {
      this.$socket.emit('chat', [SOCKET.INIT])
    },
    operatorLog (val) {
      this.$parent.messageArr.push(val)
      if (this.$parent.messageArr.length > 500) {
        this.$parent.messageArr.splice(500, this.$parent.messageArr.length)
      }
      if (typeof val === 'object' && val.result) {
        switch (val.name) {
          case SOCKET.PREPARE_TEMPLATE:
            this.afterMakeTemplate(val.result)
            break
          case SOCKET.PROJECT_INFO:
            this.afterProjectInfo(val.result)
            break
          case SOCKET.PUT_COMPONENT:
            this.afterPutComponent(val.result)
            break
          case SOCKET.DEL_COMPONENT:
            this.afterDelComponents(val.result)
            break
          case SOCKET.UPDATE_COMPONENT:
            this.refreshIframe()
            break
          case SOCKET.SAVE_PAGE_CONFIG:
            this.afterSavePageConfig(val.result)
            break
          case SOCKET.UPDATE_COMPONENT_SORT:
            this.refreshIframe()
            break
          case SOCKET.PUBLISH:
            this.afterPublish()
            break
        }
      }
    }
  },

  methods: {
    socket (fnName, params) {
      this.$socket.emit('chat', [fnName, params])
    }
  }
}
