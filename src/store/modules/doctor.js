// import * as hospitalApi from '@/api/hospital'
import hospitalApi from '../../api/hospital'

// initial state
const state = {
  doctorsList: [], // 科室数据
  docId: '', // 科室医生ID
  docDetail: {}, // 医生主页 个人信息
  sortList: [], // 医生主页 排班信息
  regMessage: {}, // 点击的排班pbId
  pbhyState: '' // 3是预约，4是挂号
}

// getters
const getters = {

  // 取得科室医生列表
  getDoctorList: state => state.doctorsList.map(item => ({
    docId: item.docId,
    docName: item.docName,
    docTitle: item.docTitle
  })),

  // 取得医生个人信息
  getDocDetail: state => state.docDetail,

  // 取得医生排班信息
  getSortList: state => state.sortList,

  // 取得医生个人ID
  getdocId: state => state.docId,

  // 取得点击排班ID
  getRegMessage: state => state.regMessage,

  // 取得预约医生排班时间
  getTimeType: state => state.noonType,

  // 取得挂号还是预约
  getPbhyState: state => state.pbhyState
}

// actionsgetDoctorList
const actions = {
  /* ajax update DoctorList */
  updateDoctorList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      hospitalApi.getDocList({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('setDoctorList', res.data)
        resolve()
      }).catch(err => reject(err))
    })
  },

  // 医生信息
  updateDocdetail ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      hospitalApi.getDocdetail({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('setDocDetail', res.data)
        resolve()
      }).catch(err => reject(err))
    })
  },

  // 医生排班情况
  updateSortList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      hospitalApi.getSortList({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('setSortList', res.data.pbList)
        resolve()
      }).catch(err => reject(err))
    })
  }
}

// mutations
const mutations = {
  /* 设置当前科室医生列表 */
  setDoctorList (state, data) {
    state.doctorsList = data
  },

  /* 设置科室医生 */
  setDocId (state, newDocId) {
    state.docId = newDocId
  },

  /* 设置医生个人信息 */
  setDocDetail (state, data) {
    state.docDetail = data
  },

  /* 设置医生排班信息 */
  setSortList (state, data) {
    state.sortList = data
  },

  /* 设置当前选择的预约 */
  setRegMessage (state, newRegMessage) {
    state.regMessage = newRegMessage
  },

  /* 设置当前选择的timeTye */
  setTimeType (state, newtimeType) {
    state.noonType = newtimeType
  },

  /* 设置当前选择的pbhyState排班号源情况 */
  setPbhyState (state, newpbhyState) {
    state.pbhyState = newpbhyState
  },

  /* 设置当前选择的pbhyState排班号源情况 */
  setCurrentDate (state, date) {
    state.currentDate = date
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
