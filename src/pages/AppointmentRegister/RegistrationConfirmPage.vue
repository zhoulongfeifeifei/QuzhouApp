<template>
<div class="flex-container">
  <div>
    <cellItem :title="item.value" :value="registration[item.key]" :value-div="item.valueDiv" v-for="(item, index) in fields" :key="index" :is-money="item.isMoney" :text-color="item.color">
      <slot v-if="item.valueDiv" slot="value-div">
        <span class='doctor-tag'>{{registration.docTitle}}</span>
      </slot>
    </cellItem>
  </div>
  <div class="margin-top-m flex-main">
    <cellItem title="就诊序号" isLink :value="number ? number : '自动分配'" @click.native="linkTo"></cellItem>
  </div>
  <div class="button-container">
      <mt-button type="danger" @click="postComfirmDetail">提 交</mt-button>
    </div>
  <MyModal :width="'100%'" title="选择就诊序号" :visible="visible" @oncancel="onCancel" @onok="onOk" v-if="visible" :className="'pick-number-modal'" :header="true">
    <a class="number-cell" key="00" @click="pickSeqNumber('')">
      自动分配
    </a>
    <a class="number-cell" v-for="(item, index) in seqNum" :key="index" @click="pickSeqNumber(item.seqNum,item.timePart)">
      {{item.seqNum}}号 <span>{{item.timePart}}</span>
    </a>
  </MyModal>
</div>
</template>

<script>
import { Button, MessageBox } from 'mint-ui'
import CellItem from '@/components/CommonComponents/CellItem.vue'
import MyModal from '@/components/CommonComponents/Modal.vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'

const fields = [
  {key: 'hospName', value: '就诊医院', color: '', isMoney: false},
  {key: 'schTypeText', value: '门诊类型', color: '', isMoney: false, valueDiv: true},
  {key: 'deptName', value: '就诊科室', color: '', isMoney: false},
  {key: 'pbDate', value: '就诊时间', color: '#D72930', isMoney: false},
  {key: 'fee', value: '挂号费', color: '#ff2b2b', isMoney: true}
]

export default {
  name: 'RegistrationConfirm',
  components: { Button, CellItem, MyModal, MessageBox },
  data () {
    return {
      fields: fields,
      // 模态框是否显示
      visible: false,
      // 就诊序号
      number: ''
    }
  },
  computed: {
    ...mapGetters([
      'registration', 'seqNum', 'regParams', 'getPbhyState'
    ]),
    ...mapState({
      doctor: state => state.doctor
    })
  },

  methods: {
    ...mapActions([
      'getSeqInfoSync', 'getSeqNum', 'postTodayRegistration', 'preSettlementBill', 'postAppointRegistration'
    ]),
    ...mapMutations([
      'changeHeaderTitle'
    ]),
    postComfirmDetail () {
      const vm = this
      this.number === '自动分配' ? this.number = '' : this.number = this.number.substr(0, 1)
      // 当日挂号提交
      if (this.getPbhyState === '4') {
        this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
        this.$store.dispatch('postTodayRegistration', {seqNum: this.number}).then(res => {
          vm.$indicator.close()
          // 未开通医保or黑名单时，弹窗提示，点击全自费支付再次调用postTodayRegistration，并传selfFlag字段
          if (res.data.tipType === '1' || res.data.tipType === '2') {
            MessageBox({title: '', message: res.data.tipType === '1' ? '您还没有开通医保移动支付，请先开通。' : '您已被限制使用医保移动支付，请尝试全自费支付，或到医院窗口支付。', showCancelButton: true, cancelButtonText: '知道了', confirmButtonText: '全自费支付'}).then(action => {
              if (action === 'confirm') {
                vm.$toast({message: '调用全自费支付', position: 'center', duration: 2000})
                vm.$indicator.open({text: '加载中...', spinnerType: 'snake'})
                vm.$store.dispatch('postTodayRegistration', {seqNum: this.number, selfFlag: 1}).then(res => {
                  vm.$indicator.close()
                })
                  .catch(err => {
                    vm.$indicator.close()
                    vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
                  })
              }
            })
          } else {
            vm.$router.push({path: '/paymentDetail/' + res.data.billsId, query: {dataId: res.data.recordId}})
          }
        })
          .catch(err => {
            vm.$indicator.close()
            vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
          })
      }
      // 预约挂号提交
      if (this.getPbhyState === '3') {
        this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
        this.$store.dispatch('postAppointRegistration', {seqNum: this.number}).then(res => {
          vm.$indicator.close()
          vm.$router.push({path: '/regDetail/' + res.data.dataId, query: {source: 'index'}})
        })
          .catch(err => {
            vm.$indicator.close()
            vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
          })
      }
    },
    // 点击cell跳转函数
    linkTo () {
      this.visible = true
    },
    onCancel () {
      this.visible = false
    },
    onOk () {
      this.visible = false
    },
    pickSeqNumber (seqNum, timePart) {
      seqNum === '' ? this.number = '自动分配' : this.number = seqNum + '号 ' + timePart
      this.visible = false
    }
  },
  created () {
    this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
    this.$store.commit('changeHeaderTitle', '挂号确认单')
    const vm = this
    this.$store.dispatch('getSeqNumList', {...this.regParams}).then(res => {
      vm.$indicator.close()
    })
      .catch(err => {
        vm.$indicator.close()
        MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        // vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
      })
  }
}
</script>

<style lang="scss" scoped>
.flex-container{
  display: flex;
  flex-direction: column;
  height: 100%;
}
.flex-main{
  background-color: #ffffff;
  flex: 1;
}
.button-container{
  padding: 0.95rem 0.75rem;
  button{
    width: 100%;
  }
}
.doctor-tag {
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid $color-font3;
  color: $color-font3;
  margin-left: 2px;
  font-size: 0.5rem;
  padding: 0.05rem .1rem;
  margin-left: 0.25rem;
  line-height: 0.6rem;
}
</style>

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
</style>
