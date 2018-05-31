import axios from 'axios'
// import store from './../store/index'

var qs = require('qs')
/* common params */
let baseOpt = {
  source: '13',
  signNo: '0',
  v: '1.0'
  // userId: store ? store.state.app.user.userId : ''
}

export default function createApi () {
  return new Promise((resolve, reject) => {
    // 需要增加签名操作和公共请求头
    const arg = Array.prototype.slice.call(arguments) // 参数的数组
    const opt = Object.assign.apply({}, arg) // 合并参数
    Object.assign(opt.data, baseOpt)
    opt.data = qs.stringify(opt.data)
    axios(opt).then(res => {
      if (typeof res === 'string') res = JSON.parse(res)
      res.data.code === 0 ? resolve(res.data) : reject(res.data)
    }).catch(err => {
      if (typeof err === 'string') err = JSON.parse(err)
      reject(err)
    })
  })
}

export function createPolling () {
  const arg = Array.prototype.slice.call(arguments)
  let count = 0
  return new Promise((resolve, reject) => {
    const fn = () => {
      createApi(...arg).then(res => {
        count++
        console.log('轮循第' + count + '次')
        const syncStatus = res.data.syncStatus
        const fail = syncStatus === -1 || count === 30
        const success = syncStatus === 1 && count < 30
        if (success) resolve(res) || console.log('轮循成功！')
        if (fail) reject(res) || console.log('轮循失败！')
        if (success || fail) return 'jump polling'
        window.setTimeout(fn, 1000)
      }).catch(err => {
        count++
        count < 30 ? window.setTimeout(fn, 1000) : reject(err)
      })
    }
    fn()
  })
}
