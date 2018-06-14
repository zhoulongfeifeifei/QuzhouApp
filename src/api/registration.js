import createApi from './createApi'
import { baseConf } from './index'

// 挂号相关api
export default {
  // 获取挂号单确认单轮循id
  getSeqInfoSync: data => createApi(baseConf, {url: '/reg/getSeq', data}),

  // 获取就诊序号列表
  getSeqNum: data => createApi(baseConf, {url: '/reg/seqNum', data}),

  // 获取挂号单列表
  getRegisterList: data => createApi(baseConf, {url: '/reg/list', data}),

  // 获取挂号单详情
  getRegistrationDetail: data => createApi(baseConf, {url: '/reg/view', data}),

  // 取消预约
  cancelPrescription: data => createApi(baseConf, {url: '/reg/orderCancel', data}),

  // 获取缴费记录列表
  getPayList: data => createApi(baseConf, {url: '/pres/history', data}),

  // 获取支付详情
  getPaymentDetail: data => createApi(baseConf, {url: '/pres/presPayDetails', data}),

  // 获取当日挂号确认单单轮循ID
  getTodayRegSync: data => createApi(baseConf, {url: '/reg/submitQz', data}),

  // 获取预约挂号确认单单轮循ID
  getAppointRegSync: data => createApi(baseConf, {url: '/reg/bookRegist', data}),

  // 支付预结算
  getPrePaySync: data => createApi(baseConf, {url: '/pres/preSettlementBill', data}),

  // 获取切换医保状态切换的轮循id
  getYbSwitchSync: data => createApi(baseConf, {url: '/pres/isYbOn', data}),

  // 挂号预结算轮循id
  presNewBillSync: data => createApi(baseConf, {url: '/pres/newBill', data}),

  // 获取挂号/缴费规则
  getRule: data => createApi(baseConf, {url: '/rule', data}),

  // 一键支付接口
  oneClickPayment: data => createApi(baseConf, {url: '/pres/expressCheckOutQz', data}),

  // 获取支付状态
  getPaymentStatus: data => createApi(baseConf, {url: '/pres/paymentQuery', data}),

  // 获取支付通道列表
  getPayChannels: data => createApi(baseConf, {url: '/pres/payChannel', data})
}
