// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store/'
import api from './api'
import { Toast, MessageBox, Indicator, Cell, Button, Loadmore, Header, Field, Switch } from 'mint-ui'
import vuePayKeyboard from './components/VuePayKeyboardIndex'
import './common/style/my-mint.scss'

Vue.config.productionTip = false

Vue.prototype.$api = api
Vue.prototype.$toast = Toast
Vue.prototype.$messageBox = MessageBox
Vue.prototype.$indicator = Indicator
Vue.prototype.MFS = window.MFS

Vue.use({Toast, MessageBox})
Vue.use(vuePayKeyboard)
Vue.component(Cell.name, Cell)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)
Vue.component(Header.name, Header)
Vue.component(Field.name, Field)
Vue.component(Switch.name, Switch)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
