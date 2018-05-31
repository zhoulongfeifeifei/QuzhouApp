<template>
  <div class="">
    <div class="bar-code ac" v-if="prescriptionDetail.barcodeUrl">
      <p class="info" :style="{margin: '0.3rem 0 0'}">{{prescriptionDetail.hospName}}</p>
      <p class="info" :style="{margin: '0.1rem'}">{{prescriptionDetail.barCodeName}}</p>
      <p class="barcode" @click="openModal">
        <img :src="prescriptionDetail.barcodeUrl" :style="{width: '12.2rem', height: 'auto'}"/>
      </p>
      <p class="info" :style="{margin: '0.1rem'}">{{prescriptionDetail.barCodeNo}}</p>
      <p class="info" :style="{margin: '0.1rem'}">(凭此条形码至药房取药/检查/取报告单)</p>
    </div>
    <div class="margin-top-m status profile">
      <CellItem title="状态" :value="prescriptionDetail.payStatus" :text-color="prescriptionDetail.payStatusColor"></CellItem>
    </div>
    <div class="margin-top-m tips" v-if="prescriptionDetail.prompt">
      <CellItem title="就医提醒" value=" " is-open>
        <p v-html="prescriptionDetail.prompt" slot="collapse-content"></p>
      </CellItem>
    </div>
    <div class="margin-top-m profile">
      <CellItem :title="item.value" :value="prescriptionDetail[item.key]" :value-div="item.valueDiv"  v-for="(item, index) in fields" :key="index" :is-money="item.isMoney" :text-color="item.color" v-if="(!item.hide || (item.hide && prescriptionDetail[item.key]))">
        <slot slot="value-div">
          <span v-if="prescriptionDetail.mrn" :style="{fontSize: '0.6rem'}"> ({{prescriptionDetail.mrn}})</span>
        </slot>
      </CellItem>
    </div>
    <div class="margin-top-m profile">
      <CellItem :title="item.value" :value="prescriptionDetail[item.key]" :value-div="item.valueDiv" v-for="(item, index) in payFields" :key="index" :is-money="item.isMoney" :text-color="item.key === 'payStatus' ? prescriptionDetail.payStatusColor : item.color" :is-link="item.isLink" :is-open="item.isOpen" v-if="(!item.hide || (item.hide && prescriptionDetail[item.key]))">
        <slot v-if="item.key === 'personalFee'" slot="value-div">
          <span>元 <span v-if="prescriptionDetail.payMethod" :style="{fontSize: '0.6rem'}">({{prescriptionDetail.payMethod}})</span></span>
        </slot>
        <slot v-if="item.key === 'medicareFee'" slot="value-div">
          <span>元 <span v-if="prescriptionDetail.medicareType" :style="{fontSize: '0.6rem'}">({{prescriptionDetail.medicareType}})</span></span>
        </slot>
      </CellItem>
    </div>
    <div class="margin-top-m itemList">
      <CellItem title="项目详情" value=" " is-open class="bg-grey">
        <Table :columns="columns" :data="prescriptionDetail.itemList" class="table-program" slot="collapse-content"></Table>
      </CellItem>
    </div>
    <div class="margin-top-m profile">
      <CellItem :title="item.value" :value="prescriptionDetail[item.key]" v-for="(item, index) in presFields" :key="index" v-if="(!item.hide || (item.hide && prescriptionDetail[item.key]))">
      </CellItem>
    </div>

    <MyModal :visible="visible" @oncancel="onCancel" @onok="onOk" v-if="visible" :className="'barcode-modal'">
      <h4 class="title">{{prescriptionDetail.hospName}}</h4>
      <p class="title">{{prescriptionDetail.barCodeName}}</p>
      <p class="bar-image" @click="openModal">
        <img :src="prescriptionDetail.barcodeUrl" :style="{width: '100%', height: '6.5rem', margin: 'auto 0'}"/>
      </p>
      <p class="code-info" :style="{fontSize: '1.6rem'}">{{prescriptionDetail.barCodeNo}}</p>
      <p class="info">(凭此条形码到相应科室就诊)</p>
      <!-- <VueBarcode :value="prescriptionDetail.barcodeUrl" tag="img" :options="{ text: prescriptionDetail.barcodeUrl, height: 87, fontSize: 14, margin: 0 }"></VueBarcode> -->
    </MyModal>
  </div>
</template>

<script>
import { Cell, Button } from 'mint-ui'
import MyModal from '@/components/CommonComponents/Modal.vue'
import CellItem from '@/components/CommonComponents/CellItem.vue'
import Table from '@/components/CommonComponents/Table.vue'
import { mapActions, mapGetters, mapMutations } from 'vuex'

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
  name: 'PrescriptionDetail',
  components: { Cell, Button, MyModal, CellItem, Table },
  data () {
    return {
      fields: [
        {key: 'userName', value: '就诊人', valueDiv: true},
        {key: 'hospName', value: '就诊医院'},
        {key: 'deptName', value: '就诊科室'}
      ],
      payFields: [
        {key: 'invoice', value: '发票号'},
        {key: 'totalAmount', value: '费用总额', color: '', isMoney: true},
        {key: 'personalFee', value: '个人支付', color: '#ff2b2b', valueDiv: true},
        {key: 'medicareFee', value: '医保报销', valueDiv: true}
      ],
      presFields: [
        {key: 'docName', value: '开方医生'},
        {key: 'payType', value: '账单来源', hide: true},
        {key: 'billsId', value: '账单编号'},
        {key: 'createTime', value: '就诊时间'},
        {key: 'payTime', value: '缴费时间'}
      ],
      columns: columns,
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'prescriptionDetail'
    ])
  },

  methods: {
    ...mapActions([
      'getPrescriptionDetail'
    ]),
    ...mapMutations([
      'changeHeaderTitle'
    ]),
    onCancel () {
      this.visible = false
    },
    onOk () {
      this.visible = false
    },
    openModal () {
      this.visible = true
    }
  },
  created () {
    const vm = this
    this.$store.commit('changeHeaderTitle', '处方详情')
    this.$store.commit('GET_PRESCRIPTION_DETAIL_FAILURE')
    this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
    this.$store.dispatch('getPrescriptionDetail', {presId: this.$route.params.id}).then(res => {
      vm.$indicator.close()
    })
      .catch(err => {
        vm.$indicator.close()
        vm.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
      })
  }
}
</script>

<style lang="scss">
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
.bar-code{
  background-color: #fff;
  border-bottom: 1px solid #ddd
}
.margin-top-m{
  border-bottom: 1px solid #ddd;
  border-top: 1px solid #ddd
}
.profile{
  padding-left: 0.75rem;
  background-color: #ffffff;
  .cell{
    min-height: 2rem!important;
  }
  .cell-wrapper{
    padding: 0!important;
    .cell-title{
      width: 4rem;
    }
  }
}
.barcode-modal{
  .modal-dialog{
    width: 100%!important;
    height: 100%;
    top: 0;
    padding-bottom: 0;
    .modal-content{
      border-radius: 0;
      height: 100%;
      img{
        display: block;
        transform: rotate(90deg);
        transform-origin: 6rem 5.2rem;
      }
    }
    h4.title{
      margin: 0.1rem;
      transform: rotate(90deg);
      transform-origin: 6rem 7.5rem;
      text-align: center;
      width: 27.4rem;
      color: $color-font2;
      font-size: 0.8rem;
    }
    p.title{
      margin: 0.1rem;
      transform: rotate(90deg);
      transform-origin: 6rem 6.4rem;
      text-align: center;
      width: 27.4rem;
      font-size: 0.75rem;
    }
    p.bar-image{
      width: 27.4rem;
      height: 6.5rem;
      text-align: center;
    }
    p.code-info{
      margin: 0.1rem;
      transform: rotate(90deg);
      transform-origin: 5.8rem -1.5rem;
      text-align: center;
      width: 27.4rem;
      color: $color-font2
    }
    p.info{
      margin: 0.1rem;
      transform: rotate(90deg);
      transform-origin: 5.8rem -3.9rem;
      text-align: center;
      width: 27.4rem;
      color: $color-font7
    }
  }
}
.table-program .my-table-thead > tr > th {
  background-color: #f5f5f9!important;
  border-top: 0!important;
}
.bg-grey > .collapse-content{
  background-color: #f5f5f9!important;
  .collapse-content-box{
    padding: 0!important;
  }
}
.bg-grey > .collapse-content > .collapse-content-box{
  padding: 0
}
.cancel-button{
  position: fixed;
  bottom: 0;
  background-color: #fff;
  color: #333333;
  width: 100%;
  border-top: 1px solid $color-border;
  border-radius: 0;
  font-size: 0.7rem;
}
</style>
