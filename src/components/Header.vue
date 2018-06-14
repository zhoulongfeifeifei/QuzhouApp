<template>
<div class="header-container">
  <mt-header :title="header" :class="{'androidStyle': android, 'iosStyle' : ios}">
    <mt-button icon="back" slot="left" @click="goBack()" :class="{'ios-mint-but' : ios}"></mt-button>
  </mt-header>
</div>
</template>

<script>
import { Button } from 'mint-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  components: { Button },
  data () {
    return {
      android: false,
      ios: false
    }
  },
  computed: {
    ...mapGetters([
      'header'
    ])
  },
  methods: {
    goBack () {
      console.log('this.$route', this.$route)
      if (this.$route.name === 'RegisterHistory') {
        this.$router.push('/registerIndex')
      } else if (this.$route.name === 'PayHistory') {
        this.$router.push('/payIndex')
      } else if (this.$route.name === 'RegistrationDetail') {
        switch (this.$route.query.source) {
          case 'index': this.$router.push({ name: 'RegisterIndex' }); break
          case 'history': this.$router.push({ name: 'RegisterHistory' }); break
          case 'waiting': this.$router.back(); break
        }
      } else if (this.$route.name === 'PresDetail') {
        this.$route.query.source === 'index' ? this.$router.push('/payIndex') : this.$router.push('/payHistory')
      } else if (this.$route.name === 'PayIndex' || this.$route.name === 'RegisterIndex' || this.$route.name === 'WaitingCallList' || this.$route.name === 'Index') {
        this.goBackApp()
      } else if (this.$route.name === 'PaymentResult') {
        this.$route.query.navigate === 'regDetail' ? this.$router.push('/registerIndex') : this.$router.push('/PayIndex')
      } else if (this.$route.name === 'PaymentDetail') {
        this.$route.query.syncId ? this.$router.push('registerIndex') : this.$router.back()
      } else if (this.$route.name === 'presPayment') {
        if (this.$route.query.syncId) {
          this.$router.push('payIndex')
        } else if (this.$route.query.paymentType) { // 从消息推送进入时，通过有无paymentType判断 直接退出app
          this.goBackApp()
        } else {
          this.$router.back()
        }
      // 添加or不添加地址后跳转页面，到科室列表or待支付处方，返回时都回到医院列表
      } else if (this.$route.name === 'DepartmentsList' || this.$route.name === 'PaymentWait') {
        let tag = this.$route.name === 'DepartmentsList' ? 1 : 2
        this.$router.push({name: 'HospList', query: { tag }})
      // 检查检验报告单详情,正常进去返回上一页； 从消息推送进去时关掉页面
      } else if (this.$route.name === 'InspectionDetail') {
        this.$route.query.source === 'list' ? this.$router.back() : this.goBackApp()
      } else if (this.$route.name === 'InspectionList') {
        this.$router.push({name: 'HospList', query: { tag: 4 }})
      // 医院列表根据tag返回index
      } else if (this.$route.name === 'HospList') {
        let tag = parseInt(this.$route.query.tag)
        switch (tag) {
          case 1: this.$router.push({ name: 'RegisterIndex' }); break
          case 2: this.$router.push({ name: 'PayIndex' }); break
          case 4: this.goBackApp(); break
          // 候诊叫号列表为空
          case 5: this.$route.query.NoWaitCall === '1' ? this.goBackApp() : this.$router.push({ name: 'WaitingCallList' }); break
        }
      } else {
        this.$router.back()
      }
    },
    goBackApp () {
      if (window.isAndroid) {
        window.qzAndroid.pageClose()
      } else if (window.isiOS) {
        window.webkit.messageHandlers.pageClose.postMessage('')
      }
    }
  },
  created () {
    if (window.isAndroid) {
      this.android = true
    }
    if (window.isiOS) {
      this.ios = true
    }
  },
  mounted () {
    // 返回APP
    // let vm = this
    // window.goBackApp = function () {
    //   let NoWaitCall = parseInt(vm.$route.query.NoWaitCall)
    //   if (NoWaitCall === 1) {
    //     this.goBackApp()
    //   }
    // }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.header-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.mint-header {
  background: $color-bg2;
  // height: 2.25rem;
  color: #fff;
  border-bottom: 1px solid #B2B2B2;
  // padding: 10px;
  .mint-header-button {
    flex: .3;
  }
  h1{
    font-size: 0.9rem;
    margin-top: 5px;
    line-height: 1.2rem;
    // height: 1rem;
    // line-height: 1rem;
  }
}
.mint-indicator-mask {
  top: 2.25rem;
}
.iosStyle {
  height: 3.2rem;
}
.androidStyle{
  height: 2.25rem;
}
.ios-mint-but{
  margin-top: 0.8rem;
}
.iosStyle h1{
  margin-top: 1.2rem;
}
</style>
