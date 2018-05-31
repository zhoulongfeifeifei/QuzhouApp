<template>
  <div :style="{paddingBottom: '50px'}">
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
        <CellItem class-name="payment-cell margin-top-m btn-box" title="医保支付" style="color:red" :value="isMedicare" :value-div="true">
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
        <!-- <CellItem class-name="payment-cell" title="支付方式" :value="paymentHtml" :value-div="true" @click.native="choosePayment">
          <div slot="value-div">
            <img :src="payChannels && payChannels[0] ? payChannels[0].icon : ''" :style="{width: '1.2rem', height: 'auto'}"/> {{payChannels && payChannels[0] ? payChannels[0].name : ''}}
          </div>
        </CellItem> -->
        <CellItem class-name="payment-cell" title="支付方式" :value="paymentHtml" :value-div="true" @click.native="choosePayment">
          <div slot="value-div">
            <img :src="paymentSrc" :style="{width: '1.2rem', height: 'auto'}"/> {{paymentHtml}}
          </div>
        </CellItem>
      </div>
    </div>
    <!-- 线上：https://epay1.zj96596.com/paygate/main 测试： http://60.190.244.46:8004/paygate/main-->
    <!-- <form name="pay-form" ref="payForm" method="post" action="http://60.190.244.46:8004/paygate/main" style="display: none">
        <input type="hidden" name="signedData" v-model="signedData"/>
        <textarea name="Plain" v-model="Plain"></textarea>
        <textarea name="Signature" v-model="Signature"></textarea> -->
        <!-- <input type="submit" name="submit" value="银行支付网关" /> -->
    <!-- </form> -->
    <!-- <MyModal :width="'100%'" title="选择支付方式" :visible="visible" @oncancel="onCancel" @onok="onOk" v-if="visible" :className="'pick-number-modal'" :header="true">
    <a class="number-cell" v-for="(item, index) in payChannels" :key="index" @click="paymentMethod(item.value,item.name,item.icon)">
      <img :src="item.icon" alt="" :style="{width: '1.2rem', height: 'auto'}">{{item.name}}
    </a>
  </MyModal> -->
  <MyModal :width="'100%'" title="选择支付方式" :visible="visible" @oncancel="onCancel" @onok="onOk" v-if="visible" :className="'pick-number-modal'" :header="true">
    <a class="number-cell" v-for="(item, index) in paymentStyle" :key="index" @click="paymentMethod(item.value,item.name,item.icon)">
      <img :src="item.icon" alt="" :style="{width: '1.2rem', height: 'auto'}">{{item.name}}
    </a>
  </MyModal>
    <div class="place-bottom">
      <span class="pay-amount">还需支付金额: <span class="color-red"><span class="small-font">¥</span> {{payDetail.personalFee}}</span></span>
      <mt-button class="pay-button" type="danger" @click="postPayDetail">立即支付</mt-button>
    </div>
    <!-- <vue-pay-keyboard ref="pay" :is-pay="isPay" @pas-end="pasEnd" @close="closeModal" pay-title="请输入医保支付密码"></vue-pay-keyboard> -->
  </div>
</template>

<script>
import { Button, Switch, MessageBox } from 'mint-ui'
import CellItem from '@/components/CommonComponents/CellItem.vue'
import MyModal from '@/components/CommonComponents/Modal.vue'
import Table from '@/components/CommonComponents/Table.vue'
import { mapMutations, mapGetters, mapActions } from 'vuex'
// import md5 from 'js-md5'

const fields = {'userName': '就诊人', 'mrn': '就诊卡号', 'docName': '开方医生'}
const paymentStyle = [
  {name: '支付宝', value: '2', icon: 'http://static.dabay.cn/icon/icon_alipay%402x.png'},
  {name: '微信支付', value: '4', icon: 'http://static.dabay.cn/icon/icon_alipay%402x.png'},
  {name: '银联支付', value: '8', icon: 'http://static.dabay.cn/icon/icon_alipay%402x.png'}
]
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
  data () {
    return {
      fields: fields,
      columns: columns,
      paymentStyle: paymentStyle,
      hideMore: true,
      isMedicare: true,
      isPay: false,
      Plain: '',
      Signature: '',
      signedData: '',
      formUrl: '',
      syncId: '',
      visible: false,
      paymentHtml: paymentStyle[0].name,
      paymentValue: paymentStyle[0].value,
      paymentSrc: paymentStyle[0].icon
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
    // switchYbStatus (checked) {
    //   // this.isMedicare = !checked
    //   this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
    //   const vm = this
    //   this.$store.dispatch('switchYbStatus', {billsId: this.$route.params.id, isMedicare: !checked ? '0' : '1'}).then(res => {
    //     vm.$indicator.close()
    //     this.isMedicare = !checked
    //   })
    //     .catch(err => {
    //       vm.$indicator.close()
    //       vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
    //     })
    // },
    // 提交支付
    async postPayDetail () {
      // 首先判断当前设备
      var userAgent = navigator.userAgent
      var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Adr') > -1 // android终端
      var isiOS = !!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) // ios终端
      var zhrsAndroid, webkit
      webkit || webkit = {}
      // 当点击立即支付的时候此时要用安卓或者ios的方法同时传入billsId(账单id)、payChannel(支付方式)、isMedicare(是否自费)
      // const vm = this
      // const params = {
      //   userId: this.userInfo.userId,
      //   billsId: this.$route.params.id,
      //   isMedicare: this.isMedicare ? '1' : '0',
      //   payChannel: this.payChannels[0].value,
      //   source: '2',
      //   returnUrl: this.institutionInfo.redirectApi + vm.$route.meta.current + '/' + this.$route.params.id + '?navigate=' + this.$route.meta.navigate + '&dataId=' + this.$route.query.dataId
      // }
      const params = {
        billsId: this.$route.params.id,
        isMedicare: this.isMedicare ? '1' : '0',
        payChannel: this.paymentValue
      }
      function showKeyboard (params) {
        let parma = JSON.stringify(params)
        if (isAndroid) {
          zhrsAndroid ? zhrsAndroid.showKeyboard(parma) : ''
        }
        if (isiOS) {
          webkit ? webkit.showKeyboard(parma) : ''
        }
      }
      // if (this.isMedicare) {
      //   // 纯医保支付或者医保加自费(先唤醒键盘)
      //   this.isPay = true
      // } else {
      //   // 纯自费支付(先调用一键支付接口，再唤醒丰收e支付，再轮循)
      //   vm.oneClickPayment({...params}).then(res => {
      //     // 提交form,唤醒丰收e支付的键盘
      //     // localStorage.setItem('syncId', res.data.syncId)
      //     vm.syncId = res.data.syncId
      //     const { url, signedData, Plain, Signature } = res.data.orderInfo
      //     vm.formUrl = url
      //     vm.signedData = signedData
      //     vm.Plain = Plain
      //     vm.Signature = Signature
      //     setTimeout(() => {
      //       vm.$refs.payForm.submit()
      //       vm.MFS.showNav()
      //     }, 1000)
      //   })
      //     .catch(err => {
      //       vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
      //     })
      // }
    },

    // 关闭模态框
    // closeModal () {
    //   this.isPay = false
    //   this.$refs.pay.val = []
    // },

    // 密码输入成功
    // async pasEnd (val) {
    //   const vm = this
    //   const params = {
    //     userId: this.userInfo.userId,
    //     billsId: this.$route.params.id,
    //     isMedicare: this.isMedicare ? '1' : '0',
    //     payChannel: this.payChannels[0].value,
    //     source: '2',
    //     returnUrl: this.institutionInfo.redirectApi + vm.$route.meta.current + '/' + this.$route.params.id + '?navigate=' + vm.$route.meta.navigate + '&dataId=' + this.$route.query.dataId
    //   }
    //   try {
    //     // 密码加密
    //     let hash = await this.getRandomNum()
    //     let passWord = hash.slice(0, 20) + md5(val) + hash.slice(-20)
    //     // 用密码获取token
    //     let payToken = await vm.getPaymentToken({type: 2, passWord: passWord})
    //     if (parseFloat(vm.payDetail.personalFee)) {
    //       // 医保加自费(先调用一键支付接口，提交后先进行丰收e支付，再轮循)
    //       vm.oneClickPayment({...params, token: payToken}).then(res => {
    //         // 提交form,唤醒丰收e支付的键盘
    //         // localStorage.setItem('syncId', res.data.syncId)
    //         const { url, signedData, Plain, Signature } = res.data.orderInfo
    //         vm.formUrl = url
    //         vm.signedData = signedData
    //         vm.Plain = Plain
    //         vm.Signature = Signature
    //         vm.MFS.showNav()
    //         setTimeout(() => {
    //           vm.$refs.payForm.submit()
    //           vm.MFS.showNav()
    //         }, 1000)
    //       })
    //         .catch(err => {
    //           vm.$refs.pay.$payStatus(false)
    //           vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
    //         })
    //     } else {
    //       // 纯医保支付(先调用一键支付接口)
    //       vm.oneClickPayment({...params, token: payToken}).then(res => {
    //         // 开始轮循
    //         vm.syncPaymentDetail(res.data.syncId)
    //       })
    //         .catch(err => {
    //           vm.$refs.pay.$payStatus(false)
    //           vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
    //         })
    //     }
    //   } catch (err) {
    //     vm.$refs.pay.$payStatus(false)
    //     vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
    //   }
    // },
    // 支付成功，轮循获取详情id
    syncPaymentDetail (syncId) {
      const vm = this
      this.syncPaymentDetailAction({syncId: syncId}).then(res => {
        let dataId
        dataId = vm.$route.meta.navigate === 'regDetail' ? vm.$route.query.dataId : res.data.ids[0]
        vm.$refs.pay.$payStatus(true)
        vm.$router.push({path: '/' + vm.$route.meta.navigate + '/' + dataId, query: {source: 'index'}})
      })
        .catch(err => {
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
          vm.$refs.pay.$payStatus(false)
          // vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
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
          // this.$router.push({path: '/' + this.$route.query.current + '/' + this.$route.params.id, query: {source: 'index'}})
        }
      } catch (err) {
        this.$indicator.close()
        MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        // this.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
      }
    }
  },
  mounted () {
    const vm = this
    this.$indicator.open({text: '正在结算中...', spinnerType: 'snake'})
    this.$store.commit('changeHeaderTitle', '支付详情')
    let billsId = this.$route.params.id
    // 获取支付详情
    if (this.$route.query.syncId) {
      this.syncPaymentResult(this.$route.query.syncId)
    }
    this.$store.dispatch('getPaymentDetail', {billsId: billsId}).then(res => {
      vm.isMedicare = res.data.isMedicare === '1'
      vm.$indicator.close()
    })
      .catch(err => {
        this.$indicator.close()
        vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
      })
    // 获取支付通道列表
    this.$store.dispatch('getPaymentChannels', {billsId: billsId}).then(res => {
      vm.$indicator.close()
    })
      .catch(err => {
        this.$indicator.close()
        vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 5000})
      })
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
