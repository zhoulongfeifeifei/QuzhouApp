<template>
  <div>

  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'

export default {
  name: 'PaymentResult',
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'payDetail', 'userInfo', 'payChannels', 'institutionInfo'
    ])
  },
  methods: {
    ...mapActions([
      'postPayment', 'getPaymentDetail', 'switchYbStatus', 'getPaymentToken', 'oneClickPayment', 'syncPaymentResultAction', 'syncPaymentDetailAction', 'getRandomNum'
    ]),
    ...mapMutations([
      'changeHeaderTitle'
    ]),

    // 支付成功，轮循获取详情id
    syncPaymentDetail (syncId) {
      const vm = this
      this.syncPaymentDetailAction({syncId: syncId}).then(res => {
        vm.$indicator.close()
        let dataId = vm.$route.query.navigate === 'regDetail' ? vm.$route.query.dataId : vm.$route.query.billsNo
        vm.$router.push({path: '/' + vm.$route.query.navigate + '/' + dataId, query: {source: 'index'}})
      })
        .catch(err => {
          vm.$indicator.close()
          vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
          vm.$router.push({path: '/' + vm.$route.query.current + '/' + vm.$router.params.id, query: {source: 'index'}})
        })
    },
    // 获取支付结果
    async syncPaymentResult (syncId) {
      try {
        let {data} = await this.syncPaymentResultAction({paymentId: this.$route.query.paymentId})
        // this.syncPaymentDetail(syncId)
        if (data.tradeStatus === 'PAYMENT_SUCCESS') {
          // 支付成功
          this.syncPaymentDetail(syncId)
        } else {
          // 支付失败，页面可继续发起支付
          // localStorage.removeItem('syncId')
          this.$router.push({path: '/' + this.$route.query.current + '/' + this.$route.params.id, query: {source: 'index'}})
        }
      } catch (err) {
        this.$indicator.close()
        this.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
      }
    }
  },
  updated () {
    if (this.$route.query.syncId) {
      this.querySyncId = this.$route.query.syncId
    }
  },
  mounted () {
    const vm = this
    this.MFS.hideNav()
    this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
    this.$store.commit('changeHeaderTitle', '支付结果')
    let syncId = this.$route.query ? this.$route.query.syncId : null
    this.syncPaymentResult(syncId)
    // 获取支付详情
    this.$store.dispatch('getPaymentDetail', {billsId: this.$route.params.id}).then(res => {
      vm.$indicator.close()
    })
      .catch(err => {
        vm.$indicator.close()
        vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
      })
  }
}
</script>
<style lang="scss" scoped>

</style>
