import Vue from 'vue'
import {
  Button,
  Table,
  TableColumn,
  Dialog,
  Form,
  FormItem,
  Input,
  MessageBox,
  Loading,
  Breadcrumb,
  BreadcrumbItem,
  Tag,
  Radio,
  RadioGroup,
  ColorPicker,
  Message
} from 'element-ui'

Vue.use(Button)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Dialog)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Tag)
Vue.use(ColorPicker)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Loading.directive)

Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
