import inspectionApi from '../../api/inspection'
import appApi from '../../api/app'
// import router from '../../router/index'

// initial state
const state = {
  // 检查检验报告单列表,下一页标识
  inspectionList: [],
  inspectionListNext: '',
  inspectionTime: '1',
  inspectionDetail: {},
  // 候诊叫号
  waitingCallList: [],
  docCallList: [],
  // 获取候诊叫号详情
  waitingCallDetail: {}
}

// getters
const getters = {
  // 检查检验报告单,判断是否有下一页
  inspectionTime: state => state.inspectionTime,
  inspectionList: state => state.inspectionList,
  inspectionListNext: state => state.inspectionListNext,
  inspectionDetail: state => {
    let inspectionDetail = state.inspectionDetail
    return inspectionDetail
  },
  // 候诊叫号
  waitingCallList: state => state.waitingCallList,
  docCallList: state => state.docCallList,
  // 判断如何进入候诊详情
  waitingCallDetail: state => state.waitingCallDetail
}

// actions
const actions = {
  // 获取报告单列表
  getInspectionList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      inspectionApi.getCallCmd({hospId: params.hospId, userId: getters.userInfo.userId}).then(res => {
        appApi.appSyncPost({syncId: res.data, userId: getters.userInfo.userId}).then(res => {
          inspectionApi.getRepList({pageNo: params.pageNo, pageSize: params.pageSize, hospId: params.hospId, timeState: params.timeState, userId: getters.userInfo.userId}).then(res => {
            resolve(res)
            res.data.pageNo = params.pageNo
            commit('GET_INSPECTION_LIST', res.data)
          })
            .catch(err => {
              reject(err)
              commit('GET_INSPECTION_LIST_FAILURE', err)
            })
        }).catch(err => reject(err))
      }).catch(err => reject(err))
    })
  },

  // 获取检验报告单详情
  getJyReportDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      let userId
      params.userId ? userId = params.userId : userId = getters.userInfo.userId
      inspectionApi.getJyRepView({...params, userId}).then(res => {
        commit('GET_INSPECTION_DETAIL', res)
        resolve(res)
      })
        .catch(err => {
          commit('GET_INSPECTION_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  },
  // 获取检查报告单详情
  getJcReportDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      let userId
      params.userId ? userId = params.userId : userId = getters.userInfo.userId
      inspectionApi.getJcRepView({...params, userId: userId}).then(res => {
        commit('GET_INSPECTION_DETAIL', res)
        resolve(res)
      })
        .catch(err => {
          commit('GET_INSPECTION_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  },

  // 获取候诊叫号列表
  getWaitingCallList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      inspectionApi.getCallList({...params, userId: getters.userInfo.userId}).then(res => {
        commit('GET_WAITING_CALL_LIST', res.data)
        resolve(res)
      })
        .catch(err => {
          commit('GET_WAITING_CALL_LIST_FAILURE', err)
          reject(err)
        })
    })
  },

  // 获取科室列表的叫号信息
  getDocCallList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      inspectionApi.getDeptCall({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('GET_DOC_CALL_LIST', res.data.dataList)
        resolve(res)
      })
        .catch(err => {
          commit('GET_DOC_CALL_LIST_FAILURE', err)
          reject(err)
        })
    })
  },
  // 通过病历号获取叫号信息
  withMrnToCallDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      inspectionApi.getCallDetail({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('GET_CALL_DETAIL', res.data)
        resolve(res)
      })
        .catch(err => {
          commit('GET_CALL_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  },
  // 通过医院查询进入候诊详情
  withDocToCallDetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      inspectionApi.waitingCallDetails({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('GET_CALL_DETAIL', res.data)
        resolve(res)
      })
        .catch(err => {
          commit('GET_CALL_DETAIL_FAILURE', err)
          reject(err)
        })
    })
  }
}

// mutations
const mutations = {
  GET_INSPECTION_LIST (state, res) {
    for (let i = 0; i < res.repList.length; i++) {
      res.repList[i].repComTime = res.repList[i].repComTime.slice(5, -3)
    }
    res.pageNo === 1 ? state.inspectionList = res.repList : state.inspectionList = state.inspectionList.concat(res.repList)
    for (let i = 0; i < state.inspectionList.length; i++) {
      if (state.inspectionList[i].repName.length > 15) {
        state.inspectionList[i].repName = state.inspectionList[i].repName.slice(0, 15) + '...'
      }
      // state.inspectionList[i].repComTime = state.inspectionList[i].repComTime.slice(5, -3)
    }
    state.inspectionListNext = res.next
  },
  GET_INSPECTION_LIST_FAILURE (state, res) {
    state.inspectionList = []
  },

  setInspectionTime (state, data) {
    state.inspectionTime = data
  },

  GET_INSPECTION_DETAIL (state, res) {
    state.inspectionDetail = res.data
  },
  GET_INSPECTION_DETAIL_FAILURE (state, res) {
    state.inspectionDetail = {}
  },

  // 获取候诊叫号列表
  GET_WAITING_CALL_LIST (state, res) {
    state.waitingCallList = res
  },
  GET_WAITING_CALL_LIST_FAILURE (state, res) {
    state.waitingCallList = []
  },
  GET_DOC_CALL_LIST (state, res) {
    state.docCallList = res
  },
  GET_DOC_CALL_LIST_FAILURE (state, res) {
    state.docCallList = []
  },
  GET_CALL_DETAIL (state, res) {
    state.waitingCallDetail = res
  },
  GET_CALL_DETAIL_FAILURE (state, res) {
    state.waitingCallDetail = {}
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
