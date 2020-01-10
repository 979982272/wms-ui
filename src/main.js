// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'styles/reset.css'
import 'styles/border.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'styles/iconfont.css'
import 'styles/scrollbars.css'
import store from './store'
import {post, deleteInfo} from './assets/script/http'
import {successMsg, errorMsg, downloadFile} from './assets/script/common'
import VueContextMenu from 'vue-contextmenu'
import 'vue-contextmenu/style/css/font-awesome.min.css'

Vue.config.productionTip = false
Vue.prototype.$post = post
Vue.prototype.$delete = deleteInfo
Vue.prototype.$successMsg = successMsg
Vue.prototype.$errorMsg = errorMsg
Vue.prototype.$downloadFile = downloadFile

Vue.use(ElementUI)
Vue.use(VueContextMenu)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
