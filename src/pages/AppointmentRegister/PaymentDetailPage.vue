<template>
  <div :style="{paddingBottom: '50px'}" v-if="allLoad">
    <div class="payment-detail">
      <div class="form">
        <div class="sub-title">
          <div class="line-left"></div>
          <div class="sub-title-detail">
            <h3>{{payDetail.hospName}}</h3>
            <p>{{payDetail.createTime}}</p>
          </div>
          <div class="line-left"></div>
        </div>
        <CellItem class-name="payment-cell" :title="value" :value="payDetail[key] ? payDetail[key] : '/'" v-for="(value, key) in fields" :key="key"></CellItem>
        <Table :columns="columns" :data="payDetail.itemList" class="margin-top-m" :hide-more="hideMore"></Table>
        <div class="ac">
          <a v-show="hideMore && payDetail.itemList && payDetail.itemList.length > 1" @click="changeTableHide(false)">查看更多</a>
          <a v-show="!hideMore" @click="changeTableHide(true)">点击收起</a>
        </div>
      </div>
      <div class="order margin-top-m">
        <div class="sub-title">
          <div class="line-left line-left-large"></div>
          <div class="sub-title-detail">
            <h3>结算明细</h3>
          </div>
          <div class="line-left line-left-large"></div>
        </div>
        <CellItem class-name="payment-cell btn-box" title="医保支付" style="color:red" :value="isMedicare" :value-div="true">
          <!-- <mt-switch class="yb-switch" v-model="isMedicare" @change="switchYbStatus" slot="value-div"></mt-switch> -->
          <div slot="value-div">
            <a @click="switchYbStatus(true)" v-show="isMedicare"><img src="./../../assets/img_kaiqi.png" :style="{width: '2.4rem'}"/></a>
            <a @click="switchYbStatus(false)" v-show="!isMedicare"><img src="./../../assets/img_weikaiqi.png" :style="{width: '2.4rem'}"/></a>
          </div>
        </CellItem>
        <CellItem class-name="payment-cell" title="结算总金额" :value="'￥' + payDetail.totalAmount"></CellItem>
        <hr/>
        <CellItem class-name="payment-cell" title="医保报销" :value="'￥' + payDetail.medicareFee" v-show="isMedicare"></CellItem>
        <CellItem class-name="payment-cell" title="支付方式" value="医保账户" v-show="isMedicare"></CellItem>
        <hr v-show="isMedicare"/>
        <CellItem class-name="payment-cell" title="个人支付" :value="'￥' + payDetail.personalFee" text-color="#ff2b2b"></CellItem>
        <hr/>
        <CellItem class-name="payment-cell" title="支付方式" value=' ' :value-div="true" @click.native="choosePayment">
          <div slot="value-div">
            <img :src="paymentSrc ? paymentSrc : payChannels[0] ? payChannels[0].icon : ''" :style="{width: '1.2rem', height: '1.2rem'}"/> {{paymentHtml ? paymentHtml : payChannels[0] ? payChannels[0].name : ''}}
          </div>
        </CellItem>
      </div>
    </div>
    <MyModal :width="'100%'" title="选择支付方式" :visible="visible" @oncancel="onCancel" @onok="onOk" v-if="visible" :className="'pick-number-modal'" :header="true">
      <a class="number-cell" v-for="(item, index) in payChannels" :key="index" @click="paymentMethod(item.value,item.name,item.icon)">
        <img :src="item.icon" alt="" :style="{width: '1.2rem', height: '1.2rem'}">{{item.name}}
      </a>
    </MyModal>
    <div class="place-bottom">
      <span class="pay-amount">还需支付金额: <span class="color-red"><span class="small-font">¥</span> {{payDetail.personalFee}}</span></span>
      <mt-button class="pay-button" type="danger" @click="postPayDetail">立即支付</mt-button>
    </div>
  </div>
</template>

<script>
import { Button, Switch, MessageBox } from 'mint-ui'
import CellItem from '@/components/CommonComponents/CellItem.vue'
import MyModal from '@/components/CommonComponents/Modal.vue'
import Table from '@/components/CommonComponents/Table.vue'
import { mapMutations, mapGetters, mapActions } from 'vuex'

const fields = {'userName': '就诊人', 'mrn': '就诊卡号', 'docName': '开方医生'}
const columns = [{
  title: '项目/规格',
  subTitle: '类',
  value: 'name',
  subValue: 'category'
},
{
  subTitle: '金额(元)',
  subValue: 'totalFee'
},
{
  title: '数量',
  subTitle: '自理自费(元/%)',
  value: 'count',
  subValue: 'combineFee'
}]
export default {
  name: 'PaymentDetail',
  components: { Button, CellItem, MyModal, Table, Switch },
  inject: ['reload'],
  data () {
    return {
      fields: fields,
      columns: columns,
      hideMore: true,
      isMedicare: true,
      syncId: '',
      visible: false,
      paymentHtml: '',
      paymentValue: '',
      paymentSrc: '',
      webkit: '',
      allLoad: false
    }
  },
  computed: {
    ...mapGetters([
      'payDetail', 'userInfo', 'payChannels', 'institutionInfo'
    ])
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchData'
  },
  created () {
    this.$store.commit('changeHeaderTitle', '支付详情')
  },
  mounted () {
    const vm = this
    this.$indicator.open({text: '正在结算中...', spinnerType: 'snake'})

    // 从消息推送进入时，paymentType=1时，用regId调用接口换billsId
    if (vm.$route.query.paymentType === '1') {
      let regId = vm.$route.params.id
      let userId = vm.$route.query.userId
      vm.withRegIdToPay(regId, userId)
    } else {
      let billsId = this.$route.params.id
      let userId = this.$route.query.userId
      this.$store.dispatch('getPaymentDetail', {billsId: billsId, userId: userId}).then(res => {
        vm.isMedicare = res.data.isMedicare === '1'
        vm.allLoad = true // 没有完全加载时不显示页面详情（因为中间有跳转当前页）
        vm.$indicator.close()
      })
        .catch(err => {
          vm.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })

      // 获取支付通道列表
      setTimeout(() => {
        this.$store.dispatch('getPaymentChannels', {billsId: billsId, userId: userId}).then(res => {
          vm.$indicator.close()
        })
          .catch(err => {
            vm.$indicator.close()
            MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
          })
      }, 200)

      // 获取支付结果
      window.payStatus = function (resultStatus) {
        if (window.isAndroid) {
          let syncId = resultStatus.syncId
          let payStatu = resultStatus.payStatus
          if (payStatu === '0') {
            vm.syncPaymentDetail(syncId)
          }
          if (payStatu === '1') {
            this.$router.push({path: '/' + vm.$route.query.current + '/' + vm.$route.params.id, query: {source: 'index'}})
          }
        }
        if (window.isiOS) {
          let resultStatu = resultStatus.split(',')
          let syncId = resultStatu[1]
          let payStatu = resultStatu[0]
          if (payStatu === '0') {
            vm.syncPaymentDetail(syncId)
          }
          if (payStatu === '1') {
            this.$router.push({path: '/' + vm.$route.query.current + '/' + vm.$route.params.id, query: {source: 'index'}})
          }
        }
      }
      // 医保拿syncId
      window.ybStatus = function (resultStatus) {
        if (window.isAndroid) {
          vm.syncPaymentDetail(resultStatus.syncId)
        }
        if (window.isiOS) {
          vm.syncPaymentDetail(resultStatus)
        }
      }
    }
  },
  methods: {
    ...mapActions([
      'postPayment', 'getPaymentDetail', 'getPaymentChannels', 'switchYbStatus', 'oneClickPayment', 'syncPaymentResultAction', 'syncPaymentDetailAction', 'getRandomNum'
    ]),
    ...mapMutations([
      'changeHeaderTitle'
    ]),
    changeTableHide (status) {
      this.hideMore = status
    },
    // 支付方式选择
    choosePayment () {
      this.visible = true
    },
    onCancel () {
      this.visible = false
    },
    onOk () {
      this.visible = false
    },
    paymentMethod (value, name, src) {
      this.paymentHtml = name
      this.paymentValue = value
      this.paymentSrc = src
      this.visible = false
    },
    // 切换是否使用医保状态
    switchYbStatus (checked) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      const vm = this
      let userId = this.$route.query.userId
      this.$store.dispatch('switchYbStatus', {billsId: this.$route.params.id, isMedicare: !checked ? '0' : '1', userId: userId}).then(res => {
        vm.$indicator.close()
        this.isMedicare = !checked
      })
        .catch(err => {
          vm.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    },
    // 提交支付
    postPayDetail () {
      const param = {
        billsId: this.$route.params.id,
        isMedicare: this.isMedicare ? '1' : '0',
        payChannel: this.paymentValue ? this.paymentValue : this.payChannels[0].value,
        idCard: this.userInfo.idCard,
        cardNum: this.userInfo.cardNum,
        userId: this.$route.query.userId ? this.$route.query.userId : this.userInfo.userId
      }
      let parm = JSON.stringify(param)
      if (window.isAndroid) {
        window.qzAndroid.showKeyboard(parm)
      }
      if (window.isiOS) {
        window.webkit.messageHandlers.showKeyboard.postMessage(parm)
      }
    },
    // 支付成功，轮循获取详情id
    syncPaymentDetail (syncId) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      const vm = this
      let userId = vm.$route.query.userId
      this.syncPaymentDetailAction({syncId: syncId, userId: userId}).then(res => {
        this.$indicator.close()
        let dataId
        dataId = vm.$route.meta.navigate === 'regDetail' ? vm.$route.query.dataId : res.data.ids[0]
        // vm.$refs.pay.$payStatus(true)
        vm.$router.push({path: '/' + vm.$route.meta.navigate + '/' + dataId, query: {source: 'index'}})
      })
        .catch(err => {
          MessageBox({ title: '提示', message: err.msg ? err.msg : '服务器繁忙', showCancelButton: false }).then(action => {
            if (action === 'confirm') {
              if (this.$route.name === 'PaymentDetail') {
                vm.$router.push('/registerIndex')
              } else {
                vm.$router.push('/payIndex')
              }
            }
          })
        })
    },
    // 刷新当前路由
    fetchData: function () {
      this.reload()
    },
    // 消息推送页面,点击后，在支付详情页面调用/newBill生成账单,跳转支付详情,传参billsId
    withRegIdToPay: function (id, userId) {
      const vm = this
      vm.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('withRegIdToPay', {type: 1, regId: id, userId: userId})
        .then(res => {
          vm.$indicator.close()
          if (res.data.tipFlag === '1') {
            MessageBox({title: '', message: res.data.tipType === '1' ? '您还没有开通医保移动支付，请先开通。' : '您已被限制使用医保移动支付，请尝试全自费支付，或到医院窗口支付。', showCancelButton: true, cancelButtonText: '知道了', confirmButtonText: '全自费支付'}).then(action => {
              if (action === 'confirm') {
                vm.$toast({message: '调用全自费支付', position: 'center', duration: 2000})
                vm.$indicator.open({text: '加载中...', spinnerType: 'snake'})
                vm.$store.dispatch('withRegIdToPay', {type: 1, regId: id, selfFlag: 1, userId: userId}).then(res => {
                  vm.$indicator.close()
                })
                  .catch(err => {
                    vm.$indicator.close()
                    MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
                  })
              }
            })
          } else {
            vm.$router.push({path: '/presPayment/' + res.data.billsId, query: {paymentType: '2'}})
          }
        })
        .catch(err => {
          vm.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    }
  }
}
</script>
<style lang="scss">
.pick-number-modal{
  .modal-content{
    position: absolute!important;
    bottom: 0;
    width: 100%;
    border-radius: 0!important;
    max-height: 13rem;
    text-align: center
  }
  .modal-body{
    padding: 0!important;
    max-height: 10.6rem;
    overflow: auto;
    .number-cell{
      border-bottom: 1px solid $color-border;
      padding: 0.8rem 0.8rem;
      display: block;
    }
  }
}
.cell.payment-cell{
  border-bottom: 0!important;
  min-height: 1.25rem!important;
  .cell-wrapper{
    padding: 0;
    .cell-value{
      font-size: 0.7rem;
      color: #333333;
      position: absolute;
      right: 0;
      margin-right: 0.1rem;
    }
  }
}
.mint-msgbox{
  width: 13.5rem;
  border-radius: 0.35rem;
  .mint-msgbox-content{
    padding: 1rem 2.6rem;
  }
  .mint-msgbox-message{
    line-height: 1.1rem;
    font-size: 0.75rem;
    color: #888888;
  }
}
.yb-switch {
  .mint-switch-core {
    width: 2rem;
    height: 1rem;
  }
  .mint-switch-core::before {
    width: 1.9rem;
    height: 0.9rem;
  }
  .mint-switch-core::after {
    width: 0.9rem;
    height: 0.9rem;
    right: 1rem;
    left: initial;
  }

}
</style>
<style lang="scss" scoped>
.payment-detail{
  padding: 0.6rem 0.5rem;
}
.form{
  background-color: #ffffff;
  padding: 0.5rem 0.75rem;

}
.order{
  background-color: #ffffff;
  padding: 0.5rem 0.75rem;
}
.place-bottom{
  position: fixed;
  bottom: 0;
  background-color: #fff;
  color: #333333;
  width: 100%;
  border-top: 1px solid $color-border;
  border-radius: 0;
  font-size: 0.7rem;
  height: 2.5rem;
}
.pay-button{
  border-radius: 0;
  width: 6.5rem;
  font-size: 0.9rem;
  height: 2.5rem;
  float: right;
}
.pay-amount{
  line-height: 2.5rem;
  padding-left: 0.5rem;
}
.small-font{
  font-size: 0.6rem;
}
.color-red{
  color: #ff2b2b;
}
hr{
  border-bottom: 1px solid #eeeeee;
  margin: 0.5rem 0;
  border-top: 0;
}
.sub-title{
  display: flex;
  h3{
    font-size: 0.75rem;
    color:#333333;
  }
  p{
    font-size:0.6rem;
    color:#999999;
  }
  .line-left{
    width: 4rem;
    height: 0.45rem;
    border-bottom: 2px solid #eeeeee;
  }
  .line-left-large{
    width: 6rem;
  }
  .sub-title-detail{
    flex: 1;
    text-align: center;
  }

}

/deep/.btn-box .cell-value{
  font-size: 0rem !important
}
</style>
