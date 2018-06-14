// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import api from './api'
// import axios from 'axios'
import { Toast, MessageBox, Indicator, Cell, Button, Loadmore, Header, Field, Switch } from 'mint-ui'
import './common/style/my-mint.scss'
Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$toast = Toast
Vue.prototype.$messageBox = MessageBox
Vue.prototype.$indicator = Indicator

Vue.use({Toast, MessageBox})
Vue.component(Cell.name, Cell)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.component(Field.name, Field)
Vue.component(Switch.name, Switch)
let userAgent = navigator.userAgent
window.isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1 // android终端
window.isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
// axios.interceptors.request.use(function (config) {
//   if (!navigator.onLine) {
//     MessageBox('提示', '网络连接异常，请检查网络')
//   }
//   // 请求发送前处理
//   return config
// }, function (error) {
//   // 请求错误后处理
//   return Promise.reject(error)
// })
// window.addEventListener('click', function () {
//   if (!navigator.onLine) {
//     MessageBox('提示', '网络连接异常，请检查网络').then(action => {
//       if (action === 'confirm') {
//         removeEventListener('click', function () {}, false)
//       }
//     })
//   }
// }, false)
