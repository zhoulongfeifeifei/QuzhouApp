import createApi, { createPolling } from './createApi'
import { baseConf } from './index'

// 选择医院页面
export default {
  // 获取医院列表
  getHospList: data => createApi(baseConf, {url: '/hosp/list', data}),
  // 查询门诊档案
  getFileInfo: data => createApi(baseConf, { url: '/hosp/nxFileInfo', data }),

  /**
   * 获取科室列表
   * @param {string} data.hospId 医院ID
   */
  getDeptList: data => createApi(baseConf, {
    url: '/hosp/dept',
    data
  }),

  /**
   * 获取科室医生列表
   * @param {string} data.hospId 医院ID
   * @param {string} data.deptId 科室ID
   */
  getDocList: data => createApi(baseConf, {
    url: '/hosp/deptSchedule',
    data: data
  }),

  /**
   * 获取医生信息详情
   * @param {string} data.hospId 医院ID
   * @param {string} data.deptId 科室ID
   * @param {string} data.docId  医生ID
   */
  getDocdetail: data => createApi(baseConf, {
    url: '/doc/viewDoc',
    data
  }),

  /**
   * 获取排班号源轮询ID
   * @param {string} data.hospId 医院ID
   * @param {string} data.deptId 科室ID
   * @param {string} data.docId  医生ID
   */
  getSortPolling: data => createApi(baseConf, {
    url: '/doc/getPb',
    data
  }),

  /**
   * 排班号源轮询
   * @param {string} data.syncId 轮循ID
   */
  SortPolling: data => createPolling(baseConf, {
    url: '/syncWithoutS',
    data
  }),

  /**
   * 获取排班号源接口
   * @param {string} data.hospId 医院ID
   * @param {string} data.deptId 科室ID
   * @param {string} data.docId  医生ID
   */
  getSortList: data => createApi(baseConf, {
    url: '/doc/getDocPbInfo',
    data
  })
}
