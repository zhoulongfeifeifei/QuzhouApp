import axios from 'axios'
import hospital from './hospital'
import app from './app'
import registration from './registration'

// axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

export const baseConf = {
  // baseURL: 'http://192.168.3.50:8080/',
  // baseURL: 'http://114.215.28.253:7500/yw', // 联调环境
  // baseURL: 'http://dyfs.dabay.cn/yw', // 生产环境
  // baseURL: 'http://dyfs.dabay.com.cn:7500/yw', // 准生产环境
  // baseURL: 'http://rap2api.taobao.org/app/mock/2841/POST',
  baseURL: 'http://rap2api.taobao.org/app/mock/8311',
  method: 'post'
}

export default {
  hospital,
  app,
  registration
}
