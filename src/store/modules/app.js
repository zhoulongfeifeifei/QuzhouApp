import app from '../../api/app'

// initial state
const state = {
  login: true, // 是否登录
  user: {
    userId: '15460',
    authFlag: '',
    phoneNum: '151****8005',
    idCard: '430381198907248110'
  },
  header: '衢州人社',
  institutionInfo: {
    'client_secret': 'caeb341392a844b88d2970bb53770452',
    'clientId': '2018032800000000001001',
    'scope_name': 'get_tight_user_info',
    'state': 'string',
    'redirectUri': 'dyfs.dabay.com.cn:7100/index',
    'redirectApi': 'http://dyfs.dabay.com.cn:7100/'
    // 'redirectUri': 'dyfs.dabay.cn/index',
    // 'redirectApi': 'http://dyfs.dabay.cn/'
  },
  nextUrl: ''
}

// getters
const getters = {
  authParams: state => {
    return {
      accessToken: state.institutionInfo.accessToken,
      returnUrl: state.institutionInfo.returnUrl,
      refreshToken: state.institutionInfo.refreshToken
    }
  },

  userInfo: state => state.user,
  accessToken: state => state.accessToken,
  header: state => state.header,
  institutionInfo: state => state.institutionInfo,
  nextUrl: state => state.nextUrl
}

// actions
const actions = {
  getSecurityInfo ({commit, getters}, params) {
    return new Promise((resolve, reject) => {
      app.getSecurityInfo({...params}).then(res => {
        commit('SET_USER_INFO', res)
        resolve(res)
      })
        .catch(err => {
          commit('SET_SECUTITY_INFO_FAILURE', err.msg)
          reject(err)
        })
    })
  },

  agreeProtocol ({commit, getters}, params) {
    app.agreeProtocol({...params, userId: getters.userInfo.userId})
  },

  getRefreshToken ({commit, getters}, params) {
    return new Promise((resolve, reject) => {
      app.getRefreshToken({...params, userId: getters.userInfo.userId}).then(res => {
        resolve(res)
      })
        .catch(err => {
          reject(err.msg)
        })
    })
  },

  // 获取东阳人社sign
  getDySign ({commit, getters}, params) {
    return new Promise((resolve, reject) => {
      app.getDySign({userId: getters.userInfo.userId}).then(res => {
        commit('setNextUrl', res.data)
        resolve(res)
      })
        .catch(err => {
          reject(err.msg)
        })
    })
  }
}

// mutations
const mutations = {
  changeHeaderTitle (state, header) {
    state.header = header
  },

  changeUserInfo (state, param) {
    state.user = {...state.user, ...param}
  },

  SET_USER_INFO (state, res) {
    // 包含userId, authFlag, idCard, phone
    state.user = res.data
    // alert(res.data.userId)
    // localStorage.setItem('userId', res.data.userId)
  },

  SET_SECUTITY_INFO_FAILURE (state, errorCode) {
    state.user = {}
    // state.errorMsg = errorCode
  },

  changeInstitutionInfo (state, params) {
    state.institutionInfo = {...state.institutionInfo, ...params}
  },

  setNextUrl (state, data) {
    console.log(data)
    state.nextUrl = '?data=' + data.data + '&sign=' + data.sign
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
