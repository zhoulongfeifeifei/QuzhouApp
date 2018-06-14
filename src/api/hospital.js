import createApi, { createPolling } from './createApi'
import { baseConf } from './index'

// 选择医院页面
export default {
  // 获取医院列表
  getHospList: data => createApi(baseConf, {url: '/hosp/list', data}),
  // 查询门诊档案
  getFileInfo: data => createApi(baseConf, {url: '/hosp/fileInfo', data}),

  // 获取科室列表(部分获取)
  getDeptList: data => createApi(baseConf, {url: '/hosp/deptMain', data}),
  getDeptSubList: data => createApi(baseConf, {url: '/hosp/deptSub', data}),

  // 获取科室医生列表
  getDocList: data => createApi(baseConf, {url: '/hosp/deptSchedule', data: data}),

  // 获取医生信息详情
  getDocdetail: data => createApi(baseConf, {url: '/doc/viewDoc', data}),

  // 获取排班号源轮询ID
  getSortPolling: data => createApi(baseConf, {url: '/doc/getPb', data}),

  // 排班号源轮询
  SortPolling: data => createPolling(baseConf, {url: '/syncWithoutS', data}),

  // 获取排班号源接口
  getSortList: data => createApi(baseConf, {url: '/doc/getDocPbInfo', data})
}
