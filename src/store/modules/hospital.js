import hospitalApi from '../../api/hospital'
import appApi from '../../api/app'
import router from '../../router/index'

// initial state
const state = {
  deptDetail: {}, // 当前已选科室
  deptData: [], // 科室数据
  deptSelIndex: 0, // 一级科室已选索引
  deptSubSelIndex: -1, // 二级科室已选索引
  hospList: [],
  tag: '',
  hospInfo: {}
}

// getters
const getters = {
  // 获取医院列表
  hospList: state => state.hospList,

  /* 获取医院ID */
  getHospId: state => state.hospInfo.hospId,
  getHospName: state => state.hospInfo.hospName,
  getHospSPic: state => state.hospInfo.hospSPic,
  /* 取当前已选科室Id */
  getDeptId: state => state.deptDetail.deptSubId,
  getDeptName: state => state.deptDetail.deptSubName,
  // 取得一级科室列表
  getDeptList: state => state.deptData.map(item => ({
    deptId: item.deptId,
    deptName: item.deptName
  })),

  // 取得二级科室列表
  getDeptSubList: state => state.deptData.length !== 0 ? state.deptData[state.deptSelIndex].deptSubList : [],

  deptSelIndex: state => state.deptSelIndex,
  deptSubSelIndex: state => state.deptSubSelIndex
}

// actions
const actions = {
  /* ajax update deptData */
  updateDeptData ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      hospitalApi.getDeptList({ ...params, userId: getters.userInfo.userId }).then(res => {
        commit('setDeptData', res.data)
        resolve()
      }).catch(err => reject(err))
    })
  },
  // 获取医院列表
  getHospList ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      hospitalApi.getHospList({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
        commit('GET_HOSP_LIST', res)
      })
        .catch(err => {
          reject(err)
          commit('GET_HOSP_LIST_FAILURE', err)
        })
    })
  },
  // 查询门诊档案
  getFileInfo ({ dispatch, commit, getters, rootGetters }, params) {
    return new Promise((resolve, reject) => {
      hospitalApi.getFileInfo({...params, userId: getters.userInfo.userId}).then(res => {
        if (res.data.isPoll === '1') {
          resolve(res.data.isPoll)
          appApi.appSyncPost({syncId: res.data.syncId, userId: getters.userInfo.userId}).then(res => {
            resolve()
            state.tag === 1 ? router.push({name: 'DepartmentsList'}) : router.push({name: 'PaymentWait'})
          }).catch(err => reject(err))
        } else if (res.data.isPoll === '0') {
          resolve(res.data.isPoll)
          // state.tag === 1 ? router.push({name: 'DepartmentsList'}) : router.push({name: 'PaymentWait'})
        }
      }).catch(err => reject(err))
    })
  }
}

// mutations
const mutations = {
  setDeptData (state, data) {
    state.deptData = data
  },
  setDeptSelIndex (state, index) {
    state.deptSelIndex = index
  },
  setDeptSubSelIndex (state, index) {
    state.deptSubSelIndex = index
  },
  setDeptDetail (state, item) {
    state.deptDetail = item
  },
  setDocId (state, docId) {
    state.docId = docId
  },
  GET_HOSP_LIST (state, res) {
    state.hospList = res.data
  },
  GET_HOSP_LIST_FAILURE (state, res) {
    state.hospList = []
  },
  setTag (state, tag) {
    state.tag = parseInt(tag)
  },
  setHospInfo (state, hosp) {
    state.hospInfo = hosp
  },
  resetState (state, res) {
    state.deptSelIndex = 0
    state.deptSubSelIndex = -1
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
