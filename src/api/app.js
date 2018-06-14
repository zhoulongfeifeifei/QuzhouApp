import createApi from './createApi'
import { baseConf } from './index'

// 全局api
export default {
  appSyncPost: data => {
    let num = 1
    return new Promise((resolve, reject) => {
      const func = () => {
        createApi(baseConf, {url: '/sync', data}).then(res => {
          num += 1
          if (res.data.syncStatus === 1 || res.data.syncStatus === -1 || num === 31) {
            res.data.syncStatus === 1 ? resolve(res) : reject(res)
            return
          }
          setTimeout(func, 1000)
        }).catch(err => {
          reject(err)
        })
      }
      func()
    })
  },
  // 授权接口获取基本信息
  getSecurityInfo: data => createApi(baseConf, {url: '/user/qzrsInfo', data})
}
