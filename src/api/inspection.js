import createApi from './createApi'
import { baseConf } from './index'

// 检查检验报告单相关api
export default {
  // 查询报告单 后 获取报告单列表
  getCallCmd: data => createApi(baseConf, {url: '/rep/callCmd', data}),
  getRepList: data => createApi(baseConf, {url: '/rep/list', data}),

  // 检验报告单详情
  getJyRepView: data => createApi(baseConf, {url: '/rep/jyRepView', data}),

  // 检查报告单详情
  getJcRepView: data => createApi(baseConf, {url: '/rep/jcRepView', data}),

  // 获取叫号列表
  getCallList: data => createApi(baseConf, {url: '/call/all', data}),
  // 点击叫号列表 获取叫号信息
  getCallDetail: data => createApi(baseConf, {url: '/call/withMrn', data}),
  // 通过医院科室列表 获取叫号信息
  getDeptCall: data => createApi(baseConf, { url: '/call/deptCall', data }),
  waitingCallDetails: data => createApi(baseConf, { url: '/call/withDoc', data })
}
