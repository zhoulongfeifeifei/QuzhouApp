<template>
  <div class="inspection-page">
  <mt-loadmore :top-method="loadTop" :auto-fill="false" :max-distance="150" @top-status-change="handleTopChange" ref="loadmore">
    <div class="inspection-detail">
      <section class="title">
        <h3>{{inspectionDetail.repName}}</h3>
        <p>{{inspectionDetail.hospSName}}</p>
      </section>
      <section class="intro">
        <ul>
          <li :key="index" v-for="(item, index) in fields" >{{item.value}}
            <span :style="{color: item.color? item.color :'#333'}">{{inspectionDetail[item.key]}}</span>
          </li>
        </ul>
      </section>
      <section class="reporter">
        <ul>
          <li :key="index" v-for="(item, index) in reporterFields" >{{item.value}}
            <span :style="{color: item.color? item.color :'#333'}">{{inspectionDetail[item.key]}}</span>
          </li>
        </ul>
        <!-- 检验报告单 -->
        <table v-if="repType===1 && inspectionDetail.quotaList.length != 0">
          <tr><th>项目</th><th>结果</th><th><span>单位</span><br><span>参考范围</span></th></tr>
          <tr v-for="(item, index) in inspectionDetail.quotaList" :key="index">
            <td>{{item.checkResult}}</td><td>{{item.qualitative}} <i :style="{color: item.flagColor}">{{item.flag}}</i></td>
            <td>
              <span class="unit">{{item.measurement}}</span><br>
              <span>{{item.reference}}</span>
            </td>
          </tr>
        </table>
        <!-- 检查报告单 -->
        <div v-if="repType===2" class="reporter-content">
          <h4>检查所见：</h4>
          <p>{{inspectionDetail.checkDetail}}</p>
        </div>
        <div v-if="repType===2" class="reporter-content">
          <h4>诊断结果：</h4>
          <p>{{inspectionDetail.checkResult}}</p>
        </div>
      </section>
      <section class="dept">
        <ul>
          <li :key="index" v-for="(item, index) in deptFields" >{{item.value}}
            <span :style="{color: item.color? item.color :'#333'}">{{inspectionDetail[item.key]}}</span>
          </li>
        </ul>
      </section>
    </div>
    <img class="border-img" src="../../assets/border.png" width="100%">
  </mt-loadmore>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'InspectionDetail',
  data () {
    return {
      fields: [
        {key: 'patnName', value: '就诊人：'},
        {key: 'mrn', value: '病历号：'},
        {key: 'sex', value: '性别：'},
        {key: 'age', value: '年龄：'},
        {key: 'diagnosis', value: '临床诊断：'}
      ],
      reporterFields: [
        {key: 'repCode', value: '报告单号：'},
        {key: 'repStatus', value: '报告单状态：', color: 'repStatusColor'}
      ],
      deptFields: [
        {key: 'deptName', value: '申请科室:'},
        {key: 'applyDoc', value: '申请医生:'},
        {key: 'repTime', value: '完成时间:'}
      ],
      repType: parseInt(this.$route.query.repType),
      topStatus: ''
    }
  },
  computed: {
    ...mapGetters([
      'inspectionDetail'
    ])
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '报告单详情')
    this.$store.commit('GET_INSPECTION_DETAIL_FAILURE')
  },
  mounted () {
    this.getRepDetail(this.$route.params.id, this.repType, this.$route.query.userId)
    // this.$route.query.userId ? this.getRepDetail(this.$route.params.id, this.repType, this.$route.query.userId) : this.getRepDetail(this.$route.params.id, this.repType)
  },
  methods: {
    ...mapActions([
      'getJyReportDetail', 'getJcReportDetail'
    ]),
    getRepDetail: function (id, repType, userId) {
      this.$store.dispatch(repType === 1 ? 'getJyReportDetail' : 'getJcReportDetail', {repId: id, userId: userId})
        .then(res => {
          this.$indicator.close()
          if (res.data.repStatus !== '已完成') {
            this.$toast({message: '报告单未完成，暂时无法查看详情，请稍后再试。', position: 'center', duration: 2000})
          }
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    },
    loadTop: function () {
      this.getRepDetail(this.$route.params.id, this.repType, this.$route.query.userId)
      this.$refs.loadmore.onTopLoaded()
    },
    handleTopChange: function (status) {
      this.topStatus = status
    }
  }
}
</script>

<style lang="scss" scoped>
.inspection-detail{background:#fff; padding: 0 .75rem; line-height: 1rem }
.inspection-detail section{padding:.5rem 0 .3rem; border-bottom: 1px solid $color-border}
.inspection-detail section:last-child{border-bottom:none;padding-bottom:.75rem}
.title h3{font-size:.8rem; color:$color-font2; font-weight:600}
.title p{font-size:.6rem; color:$color-font7}

section ul{display:block; overflow:hidden;font-size:.65rem;}
.intro ul li,.dept ul li{width:50%;float:left}
.reporter{color:$color-font2}
.reporter ul li:first-child{float:left}
.reporter ul li:last-child{float:right}
.reporter-content h4{font-size:.7rem;font-weight:600;line-height:1.6rem}
.reporter-content p{font-size:.65rem;line-height:0.9rem;padding-bottom:.2rem}
.border-img{margin-top:-0.8rem}

.reporter table{width:100%; text-align:left;margin:.25rem 0 .75rem}
.reporter table tr th{background:#f0f9fe; color:$color-font1; font-weight:400}
.reporter table tr td{font-size:.65rem;background:#f5f5f9;}
.reporter table tr th,.reporter table td{padding-left:.5rem}
.reporter table tr th:last-child,.reporter table tr td:last-child{text-align:right;padding: .25rem .5rem .25rem 0; line-height:.8rem}
.reporter table .unit{color:$color-font7}
.reporter table i{vertical-align: top;line-height:.7rem}

.mint-loadmore{ padding-bottom: 100px}/*为了下拉刷新*/
</style>
