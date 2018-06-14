<template>
  <div >
  </div>
</template>

<script>
// import { mapMutations, mapGetters } from 'vuex'
import { MessageBox } from 'mint-ui'
export default {
  name: 'Index',
  data () {
    return {
    }
  },
  created () {
    this.$store.commit('changeHeaderTitle', '授权登陆')
  },
  mounted () {
    this.$indicator.open({text: '加载中...', spinnerType: 'snake'})

    // 调用sdk获取用户信息
    if (window.isAndroid) {
      let userInfo = window.qzAndroid.getUserInfo()
      this.getSecurityInfo(JSON.parse(userInfo))
    } else if (window.isiOS) {
      console.log('123')
      var vm = this
      window.WebViewJavascriptBridge.callHandler('getUserInfo', '', function (userInfo) {
        vm.getSecurityInfo(JSON.parse(userInfo))
      })
    }
  },
  methods: {
    getSecurityInfo: function (userInfo) {
      const appId = userInfo.appId
      const medicalServiceType = userInfo.medicalServiceType
      const sourceUserId = userInfo.sourceUserId
      const name = userInfo.name
      const cardNum = userInfo.cardNum
      const cardStatus = userInfo.cardStatus
      const siNo = userInfo.siNo
      const certNo = userInfo.certNo
      const tcqNo = userInfo.tcqNo
      const cbdName = userInfo.cbdName
      const telphoneNo = userInfo.telphoneNo
      const bankCode = userInfo.bankCode
      const bankName = userInfo.bankName
      const bankNo = userInfo.bankNo
      const authStatus = userInfo.authStatus
      const mobilePayStatus = userInfo.mobilePayStatus
      const isBlackList = userInfo.isBlackList
      const extendedField = userInfo.extendedField
      const qzSign = userInfo.qzSign

      this.$store.dispatch('getSecurityInfo', {appId: appId, medicalServiceType: medicalServiceType, sourceUserId: sourceUserId, name: name, cardNum: cardNum, cardStatus: cardStatus, siNo: siNo, certNo: certNo, tcqNo: tcqNo, cbdName: cbdName, telphoneNo: telphoneNo, bankCode: bankCode, bankName: bankName, bankNo: bankNo, authStatus: authStatus, mobilePayStatus: mobilePayStatus, isBlackList: isBlackList, extendedField: extendedField, qzSign: qzSign})
        .then(res => {
          this.$indicator.close()
          this.$store.commit('getUserInfo', res.data.userInfo)
          let medicalServiceType = parseInt(res.data.userInfo.medicalServiceType)
          switch (medicalServiceType) {
            case 1: this.$router.push({ name: 'RegisterIndex' }); break
            case 2: this.$router.push({ name: 'PayIndex' }); break
            case 3: this.$router.push({ name: 'HospList', query: {tag: 4} }); break
            case 4: this.$router.push({ name: 'WaitingCallList' }); break
          }
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    }
  }
}
</script>
