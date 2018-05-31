import registration from '../../api/registration'
import app from '../../api/app'

// const regStatuses = {
//   '-1': '挂号失败',
//   '0': '已提交',
//   '1': '挂号成功',
//   '2': '预约成功',
//   '3': '已取消',
//   '4': '已就诊'
// }
//
// const payStatuses = {
//   '-1': '挂号失败',
//   '0': '不可支付',
//   '1': '待付款',
//   '2': '付款中',
//   '3': '付款成功',
//   '9': '账单关闭',
//   '31': '待退款',
//   '32': '退款中',
//   '33': '退款失败',
//   '34': '退款成功',
//   '其他': '处理中'
// }
const payTypes = {
  '1': '自费支付',
  '2': '医保报销'
}

// initial state
const state = {
  pbList: [],
  // 挂号/缴费列表
  regList: [],
  regListNext: '',
  presList: [],
  presListNext: '',
  // 挂号/预约确认单显示数据
  registration: {},
  // 挂号/预约确认单轮循参数
  regParams: {},
  // 挂号单详情
  registrationDetail: {},
  // 就诊序号
  seqNum: [],
  // 支付详情
  payDetail: {},
  payChannels: [],
  rule: ''
}

// getters
const getters = {
  // 挂号单确认显示
  registration: (state, getters, rootState) => {
    const registration = {
      hospName: getters.getHospName,
      schTypeText: getters.getDocDetail.docName,
      deptName: getters.getDeptName,
      pbDate: getters.getRegMessage.pbDate + ' ' + getters.getRegMessage.timeTypeText,
      fee: getters.getRegMessage.fee,
      docTitle: getters.getDocDetail.docTitle
    }
    return registration
  },
  // 挂号/预约确认单轮循参数
  regParams: (state, getters, rootState) => {
    const regParams = {
      hospId: getters.getHospId,
      pbId: getters.getRegMessage.pbId,
      noonType: getters.getRegMessage.timeType
    }
    return regParams
  },
  // 当日挂号单提交参数
  regPostParams: (state, getters, rootState) => {
    const regPostParams = {
      ...getters.regParams,
      idCard: rootState.app.user.idCard
    }
    return regPostParams
  },
  // 挂号单确认 就诊序号列表
  seqNum: state => {
    let {seqNum} = state
    seqNum.splice(0, {seqNum: '', timePart: '自动分配'})
    return seqNum
  },
  // 挂号单详情
  registrationDetail: state => {
    let registrationDetail = state.registrationDetail
    // registrationDetail.regStatus = regStatuses[registrationDetail.regStatus]
    registrationDetail.prompt = registrationDetail.prompt ? registrationDetail.prompt.replace(/\n/g, '<br/>') : ' '
    // registrationDetail.payStatus = payStatuses[registrationDetail.payStatus]
    registrationDetail.payType = payTypes[registrationDetail.payType]
    return registrationDetail
  },
  // 挂号单列表, 判断是否有下一页; 就诊缴费记录
  regList: state => state.regList,
  regListNext: state => state.regListNext,
  presList: state => state.presList,
  presListNext: state => state.presListNext,
  rule: state => state.rule.replace(/\n/g, '<br/>'),
  payDetail: state => {
    let payDetail = state.payDetail
    payDetail.itemList && payDetail.itemList.forEach(item => { item.combineFee = item.personalFee ? item.personalFee + '/' + item.personalScale : '' })
    return payDetail
  },
  payChannels: state => state.payChannels
}

// actions
const actions = {
  // 在这个模块中， dispatch 和 commit 也被局部化了
  // 他们可以接受 `root` 属性以访问根 dispatch 或 commit
  getSeqNumList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getSeqInfoSync({...params, userId: getters.userInfo.userId}).then(res1 => {
        app.appSyncPost({syncId: res1.data.syncId, userId: getters.userInfo.userId}).then(res2 => {
          registration.getSeqNum({...params, userId: getters.userInfo.userId}).then(res3 => {
            commit('GET_SEQ_NUM_LIST', res3)
            resolve(res3)
          })
            .catch(err => {
              commit('GET_SEQ_NUM_LIST_FAILURE', err)
              reject(err)
            })
        })
          .catch(err => {
            commit('GET_SEQ_NUM_LIST_FAILURE', err)
            reject(err)
          })
      })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 获取挂号单列表
  getRegisterList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getRegisterList({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
        res.data.pageNo = params.pageNo
        commit('GET_REGISTER_LIST', res.data)
      })
        .catch(err => {
          reject(err)
          commit('GET_REGISTER_LIST_FAILURE', err)
        })
    })
  },
  // 获取挂号单详情
  getRegistrationDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getRegistrationDetail({...params, userId: getters.userInfo.userId}).then(res => {
        commit('GET_REGISTTRATION_DETAIL', res)
        resolve(res)
      })
        .catch(err => {
          commit('GET_REGISTTRATION_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  },
  // 挂号单详情页取消预约
  cancelPrescription ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.cancelPrescription({...params, userId: getters.userInfo.userId}).then(res1 => {
        app.appSyncPost({syncId: res1.data.syncId, userId: getters.userInfo.userId}).then(res2 => {
          registration.getRegistrationDetail({regId: res2.data.dataId, userId: getters.userInfo.userId}).then(res3 => {
            commit('GET_REGISTTRATION_DETAIL', res3)
            resolve(res3)
          })
            .catch(err => {
              commit('GET_REGISTTRATION_DETAIL_FAILURE', err)
              reject(err)
            })
        })
          .catch(err => {
            reject(err)
          })
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 挂号单列表页取消预约
  cancelRegistration ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.cancelPrescription({regId: params.regId, userId: getters.userInfo.userId}).then(res1 => {
        app.appSyncPost({syncId: res1.data.syncId, userId: getters.userInfo.userId}).then(res2 => {
          registration.getRegisterList({pageNo: 1, pageSize: params.pageSize, userId: getters.userInfo.userId}).then(res3 => {
            res3.data.pageNo = 1
            commit('GET_REGISTER_LIST', res3.data)
            resolve(res3)
          })
            .catch(err => {
              commit('GET_REGISTER_LIST_FAILURE', err)
              reject(err)
            })
        })
          .catch(err => {
            reject(err)
          })
      })
        .catch(err => {
          reject(err)
        })
    })
  },
  // 获取就诊缴费列表
  getPayList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getPayList({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
        res.data.pageNo = params.pageNo
        commit('GET_PAY_LIST', res.data)
      })
        .catch(err => {
          reject(err)
          commit('GET_PAY_LIST_FAILURE', err)
        })
    })
  },

  // 挂号前预结算
  preSettlementBill ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.presNewBillSync({regId: params.regId, userId: getters.userInfo.userId}).then(res2 => {
        if (res2.data.isPoll === '1') {
          app.appSyncPost({syncId: res2.data.syncId, userId: getters.userInfo.userId}).then(res3 => {
            resolve(res3)
          })
        } else {
          resolve(res2)
        }
      }).catch(err => reject(err))
    })
  },

  // 获取支付通道列表
  getPaymentChannels ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getPayChannels({...params, userId: getters.userInfo.userId}).then(res => {
        commit('GET_PAYMENT_CHANNELS', res)
        resolve(res)
      })
        .catch(err => {
          commit('GET_PAYMENT_CHANNELS_FAILURE', err)
          reject(err)
        })
    })
  },

  // 获取支付详情
  getPaymentDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getPaymentDetail({...params, userId: getters.userInfo.userId}).then(res => {
        commit('GET_PAYMENT_DETAIL', res)
        resolve(res)
      })
        .catch(err => {
          commit('GET_PAYMENT_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  },

  // 一键支付接口
  oneClickPayment ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.oneClickPayment({...params, userId: getters.userInfo.userId}).then(res => {
        commit('ONE_CLICK_PAYMENT', res)
        resolve(res)
      })
        .catch(err => {
          commit('ONE_CLICK_PAYMENT_FAILURE', err)
          reject(err)
        })
    })
  },

  // 当日挂号确认单提交
  postTodayRegistration ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getTodayRegSync({...params, ...getters.regPostParams, userId: getters.userInfo.userId}).then(res => {
        // 是否弹框显示
        if (res.data.tipFlag === '1') {
          resolve(res)
        } else if (res.data.tipFlag === '0' && res.data.isPoll === '1') {
          app.appSyncPost({ syncId: res.data.syncId, userId: getters.userInfo.userId }).then(res2 => {
            res2.data.recordId = res.data.recordId // 挂号单id
            res2.data.billsId = res.data.billsId // 临时账单ID
            resolve(res2)
          })
            .catch(err => { reject(err) })
        }
      })
        .catch(err => { reject(err) })
    })
  },

  // 预约挂号确认单提交
  postAppointRegistration ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getAppointRegSync({...params, ...getters.regPostParams, userId: getters.userInfo.userId}).then(res1 => {
        app.appSyncPost({syncId: res1.data.syncId, userId: getters.userInfo.userId}).then(res2 => {
          resolve(res2)
        })
          .catch(err => { reject(err) })
      })
        .catch(err => { reject(err) })
    })
  },

  // 切换是否使用医保
  switchYbStatus ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getYbSwitchSync({...params, userId: getters.userInfo.userId}).then(res2 => {
        if (res2.data.isPoll === '1') {
          app.appSyncPost({syncId: res2.data.syncId, userId: getters.userInfo.userId}).then(res3 => {
            registration.getPaymentDetail({billsId: res3.data.dataId, userId: getters.userInfo.userId}).then(res4 => {
              commit('GET_PAYMENT_DETAIL', res4)
              resolve(res4)
            })
              .catch(err => {
                commit('GET_PAYMENT_DETAIL_FAILURE', err)
                reject(err)
              })
          })
            .catch(err => { reject(err) })
        } else {
          registration.getPaymentDetail({billsId: params.billsId, userId: getters.userInfo.userId}).then(res5 => {
            commit('GET_PAYMENT_DETAIL', res5)
            resolve(res5)
          })
            .catch(err => {
              commit('GET_PAYMENT_DETAIL_FAILURE', err)
              reject(err)
            })
        }
      })
        .catch(err => { reject(err) })
    })
  },

  // 支付
  postPayment ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.postPayment({userId: getters.userInfo.userId}).then(res1 => {
        actions.appSyncPost({syncId: res1.data.syncId, userId: getters.userInfo.userId}).then(res2 => {
          resolve(res2)
        })
          .catch(err => { reject(err) })
      })
        .catch(err => { reject(err) })
    })
  },

  // 支付多次轮循
  appSyncPost ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      app.appSyncPost({syncId: params.syncId, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
      })
        .catch(err => {
          if (err.data.nextSyncId) {
            actions.appSyncPost({syncId: err.data.nextSyncId})
          }
          reject(err)
        })
    })
  },

  // 支付成功后轮循跳转至详情页面
  syncPaymentDetailAction ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      app.appSyncPost({syncId: params.syncId, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 获取支付结果
  syncPaymentResultAction ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getPaymentStatus({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
      })
        .catch(err => {
          reject(err)
        })
    })
  },

  // 获取挂号/缴费规则
  getRule ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      registration.getRule({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
        commit('GET_RULE', res)
      })
        .catch(err => { reject(err) })
    })
  },

  // 获取支付token
  async getPaymentToken  ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      app.getUserToken({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res.data.token)
      })
        .catch(err => { reject(err) })
    })
  }
}

// mutations
const mutations = {
  GET_SEQ_NUM_LIST (state, res) {
    state.seqNum = res.data
  },

  GET_SEQ_NUM_LIST_FAILURE (state, err) {
    state.seqNum = []
  },

  GET_REGISTER_LIST (state, res) {
    res.pageNo === 1 ? state.regList = res.regList : state.regList = state.regList.concat(res.regList)
    state.regListNext = res.next
  },
  GET_REGISTER_LIST_FAILURE (state, res) {
    state.regList = []
  },
  GET_REGISTTRATION_DETAIL (state, res) {
    state.registrationDetail = res.data
  },
  GET_REGISTTRATION_DETAIL_FAILURE (state, res) {
    state.registrationDetail = {}
  },

  GET_PAY_LIST (state, res) {
    res.pageNo === 1 ? (state.presList = res.presList) : (state.presList = state.presList.concat(res.presList))
    state.presListNext = res.next
  },
  GET_PAY_LIST_FAILURE (state, res) {
    state.presList = []
  },
  GET_PAYMENT_DETAIL (state, res) {
    state.payDetail = res.data
  },
  GET_PAYMENT_DETAIL_FAILURE (state, res) {
    state.payDetail = {}
  },
  GET_PAYMENT_CHANNELS (state, res) {
    state.payChannels = res.data
  },
  GET_PAYMENT_CHANNELS_FAILURE (state, res) {
    state.payChannels = []
  },
  GET_RULE (state, res) {
    state.rule = res.data.rule
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
