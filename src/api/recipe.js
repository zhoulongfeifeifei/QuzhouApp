import createApi from './createApi'
import { baseConf } from './index'

// 处方支付相关api
export default {
  // 获取待支付处方列表，之前先调用云平台命令获取账单
  getQueryBill: data => createApi(baseConf, {url: '/pres/queryBill', data}),
  getPresList: data => createApi(baseConf, {url: '/pres/list', data}),

  // registerIndex页面 根据挂号单id生成billsId
  getNewBill: data => createApi(baseConf, {url: '/pres/newBillQz', data}),

  // paymentWait页面 根据处方单id生成billsId
  getPresMerge: data => createApi(baseConf, {url: '/pres/presMergeQz', data}),
  // 根据处方单id生成的billsId进行预结算
  getPreSettlementBill: data => createApi(baseConf, {url: '/pres/preSettlementBill', data}),

  // 获取处方详情
  getPrescriptionDetail: data => createApi(baseConf, {url: '/pres/presView', data})
}
