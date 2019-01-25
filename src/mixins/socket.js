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
            this.handleProjectInfo(val.result)
            break
          case SOCKET.PUT_COMPONENT:
            this.afterPutComponent(val.result)
            break
          case SOCKET.DEL_COMPONENT:
            this.afterDelComponents(val.result)
            break
          case SOCKET.UPDATE_COMPONENT:
            this.afterUpdateComponents(val.result)
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
