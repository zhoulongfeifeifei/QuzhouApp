import recipe from '../../api/recipe'
import appApi from '../../api/app'
// import router from '../../router/index'

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
  // 待支付处方列表,下一页标识
  presWaitList: [],
  presWaitListNext: '',
  presWaitHosp: '',
  prescriptionDetail: {}

}

// getters
const getters = {
  // 待支付处方,判断是否有下一页
  presWaitList: state => state.presWaitList,
  presWaitListNext: state => state.presWaitListNext,
  presWaitHosp: state => state.presWaitHosp,
  prescriptionDetail: state => {
    let prescriptionDetail = state.prescriptionDetail
    prescriptionDetail.prompt = prescriptionDetail.prompt ? prescriptionDetail.prompt.replace(/\n/g, '<br/>') : ' '
    // prescriptionDetail.payStatus = payStatuses[prescriptionDetail.payStatus]
    prescriptionDetail.payType = payTypes[prescriptionDetail.payType]
    prescriptionDetail.itemList && prescriptionDetail.itemList.forEach(item => { item.combineFee = item.personalFee ? item.personalFee + '/' + item.personalScale : '' })
    return prescriptionDetail
  }
}

// actions
const actions = {
  // 获取待支付处方列表
  getQueryBill ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      recipe.getQueryBill({...params, userId: getters.userInfo.userId}).then(res => {
        appApi.appSyncPost({syncId: res.data.syncId, userId: getters.userInfo.userId}).then(res => {
          resolve(res)
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  },
  // 获取待支付处方列表
  getPresList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      recipe.getPresList({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
        res.data.pageNo = params.pageNo
        commit('GET_PRES_LIST', res.data)
      })
        .catch(err => {
          reject(err)
          commit('GET_PRES_LIST_FAILURE', err)
        })
    })
  },
  // 挂号单列表 点击去支付，1调用/newBill生成账单，2跳转支付详情 传参billsId
  withRegIdToPay ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      recipe.getNewBill({regId: params.regId, userId: getters.userInfo.userId}).then(res => {
        let billsId = res.data.billsId
        if (res.data.tipFlag === '1') {
          resolve(res)
        } else if (res.data.tipFlag === '0' && res.data.isPoll === '1') {
          appApi.appSyncPost({syncId: res.data.syncId, userId: getters.userInfo.userId}).then(res => {
            resolve(billsId)
            // router.push({path: '/paymentDetail/' + billsId, query: {dataId: params.regId}})
          }).catch(err => reject(err))
        } else if (res.data.tipFlag === '0' && res.data.isPoll === '0') {
          resolve(billsId)
          // router.push({path: '/paymentDetail/' + billsId})
        }
      }).catch(err => reject(err))
    })
  },

  // 待支付处方列表跳转支付详情，1调用/presMerge生成账单，
  // 2调用/preSettlementBill接口预结算，3跳转支付详情 传参billsId
  // 根据tipFlag弹窗提示黑名单用户和未开通医保用户，点击全自费支付后重新调用/presMerge
  withPresIdToPay ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      recipe.getPresMerge({presId: params.presId, hospId: rootGetters.getHospId, idCard: getters.userInfo.idCard, userId: getters.userInfo.userId}).then(res => {
      // recipe.getPresMerge({}).then(res => {
        let billsId = res.data.billsId
        let userId = getters.userInfo.userId
        if (res.data.tipFlag === '1') {
          resolve(res)
        } else if (res.data.tipFlag === '0' && res.data.isPoll === '1') {
          appApi.appSyncPost({syncId: res.data.syncId, userId: userId}).then(res => {
            actions.presPay(billsId, userId).then(res => resolve(res)).catch(err => reject(err))
          }).catch(err => reject(err))
        } else if (res.data.tipFlag === '0' && res.data.isPoll === '0') {
          actions.presPay(billsId, userId).then(res => resolve(res)).catch(err => reject(err))
        }
      }).catch(err => reject(err))
    })
  },
  // 处方支付前预结算
  presPay (billsId, userId) {
    return new Promise((resolve, reject) => {
      recipe.getPreSettlementBill({billsId: billsId, userId: userId}).then(res => {
        if (res.data.isPoll === '1') {
          appApi.appSyncPost({syncId: res.data.syncId, userId: userId}).then(res => {
            resolve(billsId)
          }).catch(err => reject(err))
        } else if (res.data.isPoll === '0') {
          resolve(billsId)
        }
      }).catch(err => reject(err))
    })
  },

  // 获取处方详情
  getPrescriptionDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      recipe.getPrescriptionDetail({...params, userId: getters.userInfo.userId}).then(res => {
        commit('GET_PRESCRIPTION_DETAIL', res)
        resolve(res)
      })
        .catch(err => {
          commit('GET_PRESCRIPTION_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  }
}

// mutations
const mutations = {
  GET_PRES_LIST (state, res) {
    res.pageNo === 1 ? state.presWaitList = res.presList : state.presWaitList = state.presWaitList.concat(res.presList)
    state.presWaitListNext = res.next
  },
  GET_PRES_LIST_FAILURE (state, res) {
    state.presWaitList = []
  },

  GET_PRESCRIPTION_DETAIL (state, res) {
    state.prescriptionDetail = res.data
  },

  GET_PRESCRIPTION_DETAIL_FAILURE (state, res) {
    state.prescriptionDetail = {}
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
