import axios from 'axios'
import hospital from './hospital'
import app from './app'
import registration from './registration'

// axios.defaults.withCredentials = true
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
export const baseConf = {
  // baseURL: 'http://192.168.3.50:8080/',
  // baseURL: 'https://qzht.dabay.cn:6800/yw', // 联调环境
  baseURL: 'https://ywapp.dabay.cn/yw', // 生产环境
  method: 'post'
}

export default {
  hospital,
  app,
  registration
}
