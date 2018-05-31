<template>
  <div class="card-item" @click="goNext(tag===1 ? item.regId : item.presId, source)">
      <mt-cell :title="tag===1 ? item.deptName : item.presName" :label="tag===1 ? item.userName:''" is-link>
        <span :style="{color:item.regStatusColor ? item.regStatusColor : item.payStatusColor}">{{item.regStatus ? item.regStatus : item.payStatus}}</span>
      </mt-cell>
      <div class="item-content">
        <i class="line"></i>
          <span class="fl hosp-font">{{tag===1 ? item.hospName : item.hospName + ' - ' + item.deptName}}</span>
          <span class="fr money-font">￥{{tag===1 ? item.fee : item.presFee}}</span><br>
          <span class="time-font"><i></i>{{tag===1 ? item.treatTime : item.presTime}}</span>
          <span v-if="tag!==3 && item.payStatus == '去支付'" class="fr pay-btn" :style="{ border: '1px solid '+item.payStatusColor, color: item.payStatusColor }" @click.stop.prevent="goPay(tag===1 ? item.regId : item.presId)">去支付</span>
          <span v-if="item.canCancel == '1'" class="fr pay-btn pay-btn-cancel" @click.stop.prevent="cancelRegistration(tag===1 ? item.regId : item.presId)">取消预约</span>
          <!-- 待支付处方时，不用根据后台字段，直接全部含有button -->
          <span v-if="tag===3" class="fr pay-btn" @click.stop.prevent="goPay(tag===1 ? item.regId : item.presId)">去支付</span>
          <span v-if="item.repayFlag == '1'" class="fr pay-btn" @click.stop.prevent="goPay(tag===1 ? item.regId : item.presId)">重新支付</span>
      </div>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'CardItem',
  props: ['item', 'tag', 'source', 'pageSize'],
  data () {
    return {
      linkHref: ''
    }
  },
  computed: {
    ...mapGetters(['hospList'])
  },
  methods: {
    goPay: function (id) {
      if (this.tag === 1) {
        this.withRegIdToPay(id)
      } else if (this.tag === 3) {
        this.withPresIdToPay(id)
      }
    },
    // 就诊挂号页面,点击去支付调用/newBill生成账单,跳转支付详情,传参billsId
    withRegIdToPay: function (id) {
      const vm = this
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('withRegIdToPay', {type: 1, regId: id})
        .then(res => {
          vm.$indicator.close()
          // res为1时 医保移动支付未开通，点击全自费支付后重新调用/presMerge
          if (res.data.tipType === '1' || res.data.tipType === '2') {
            MessageBox({title: '', message: res.data.tipType === '1' ? '您还没有开通医保移动支付，请先开通。' : '您已被限制使用医保移动支付，请尝试全自费支付，或到医院窗口支付。', showCancelButton: true, cancelButtonText: '知道了', confirmButtonText: '全自费支付'}).then(action => {
              if (action === 'confirm') {
                vm.$toast({message: '调用全自费支付', position: 'center', duration: 2000})
                vm.$indicator.open({text: '加载中...', spinnerType: 'snake'})
                vm.$store.dispatch('withRegIdToPay', {type: 1, regId: id, selfFlag: 1}).then(res => {
                  vm.$indicator.close()
                })
                  .catch(err => {
                    vm.$indicator.close()
                    vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
                  })
              }
            })
          } else {
            vm.$router.push({path: '/paymentDetail/' + res, query: {dataId: id}})
          }
        })
        .catch(err => {
          vm.$indicator.close()
          vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
        })
    },
    // 待支付处方页面,点击去支付调用/presMerge,再/preSettlementBill预结算，跳转支付详情,传参billsId
    withPresIdToPay: function (id) {
      const vm = this
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('withPresIdToPay', {type: 1, presId: id})
        .then(res => {
          vm.$indicator.close()
          // res为1时 医保移动支付未开通，点击全自费支付后重新调用/presMerge
          if (res.data.tipType === '1' || res.data.tipType === '2') {
            MessageBox({title: '', message: res.data.tipType === '1' ? '您还没有开通医保移动支付，请先开通。' : '您已被限制使用医保移动支付，请尝试全自费支付，或到医院窗口支付。', showCancelButton: true, cancelButtonText: '知道了', confirmButtonText: '全自费支付'}).then(action => {
              if (action === 'confirm') {
                vm.$toast({message: '调用全自费支付', position: 'center', duration: 2000})
                vm.$indicator.open({text: '加载中...', spinnerType: 'snake'})
                vm.$store.dispatch('withPresIdToPay', {type: 1, presId: id, selfFlag: 1}).then(res => {
                  vm.$indicator.close()
                })
                  .catch(err => {
                    vm.$indicator.close()
                    vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
                  })
              }
            })
          } else {
            vm.$router.push({path: '/presPayment/' + res})
          }
        })
        .catch(err => {
          vm.$indicator.close()
          vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
        })
    },

    goNext: function (id, source) {
      if (this.tag === 1) { // 就诊挂号页面,点击列表跳转挂号单详情,传参regId
        this.$router.push({path: '/regDetail/' + id, query: {source: source}})
      } else if (this.tag === 2) { // 就诊缴费页面,点击列表跳转处方详情,传参presId
        this.$router.push({path: '/presDetail/' + id, query: {source: source}})
      } else if (this.tag === 3) { // 待支付处方页面,点击列表直接调用withPresIdToPay(),传参billsId
        this.withPresIdToPay(id)
      }
    },

    cancelRegistration: function (id) {
      const vm = this
      MessageBox({title: '提示', message: '确定取消预约?', showCancelButton: true}).then(action => {
        if (action !== 'cancel') {
          vm.$indicator.open({text: '加载中...', spinnerType: 'snake'})
          vm.$store.dispatch('cancelRegistration', {regId: id, pageSize: this.pageSize}).then(res => {
            vm.$indicator.close()
            // vm.$toast({message: '已取消', position: 'center', duration: 2000})
          })
            .catch(err => {
              vm.$indicator.close()
              vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-item { background: #fff;margin-bottom: 0.5rem;border-bottom: 1px solid $color-border2;border-top: 1px solid $color-border2  }
.mint-cell span { font-size: 0.7rem }
.item-content { padding: 0 .75rem 0 .5rem }
.line { display: block;border-top:1px solid $color-border; padding-bottom: .6rem }
.hosp-font { font-size: .7rem; color: #666 }
.money-font { font-size: .7rem; color: #333 }
.time-font { color: #666 ;background: #f4f4f4; font-size: .6rem ;padding: .3rem .6rem; margin: .3rem 0 .6rem; display: inline-block;border-radius:.75rem }
.time-font i { display: inline-block; height: .9rem; width: .9rem; background: url(../../assets/icon_time.png) no-repeat; background-size: 100% 100%; vertical-align: top;margin-right: .3rem }
.pay-btn { font-size: .7rem;margin-top: 0.5rem;border-radius: .25rem;padding:.1rem .5rem;border: 1px solid $color-btn3;color: $color-btn3;}
.pay-btn-cancel { color:#999; border:1px solid #999 }
</style>
