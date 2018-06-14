<template>
  <div class="report-item" @click="tag === 4 ? goNext(item.repId, item.repType, source) : goWaitingCall(item.hospId, item.pbId, item.mrn)">
    <div class="report-content">
      <mt-cell :title="tag===4 ? item.repName : item.hospName" class="report-content">
        <span :style="{color: tag===4 ? '#999' : '#ff2b2b'}">{{tag===4 ? item.repComTime : '当前叫号 ' + item.curNum + '号'}}</span>
      </mt-cell>
      <p class="lable">{{tag===4 ? item.hospSName : item.deptName + ' ' + item.docName}}
        <span v-if="tag===5" class="doc-title">{{item.docTitle}}</span>
      </p>
    </div>
    <mt-cell :title="tag===4 ? '就诊人：' : ''" :label="item.patnName" class="user-content">
      <span :style="{color: tag===4 ? item.repStatusColor : '#999'}">{{tag===4 ? item.repStatus : item.treatDate + ' ' + item.timePart + ' ' + item.myNum + '号'}}</span>
    </mt-cell>
  </div>
</template>

<script>
export default {
  name: 'ReportItem',
  props: ['item', 'tag', 'source'],
  data () {
    return {
    }
  },
  methods: {
    goNext: function (id, repType, source) {
      this.$router.push({path: '/inspectionDetail/' + id, query: {repType: repType, source}})
    },
    goWaitingCall: function (hospId, pbId, mrn) {
      this.$router.push({path: '/waitingCallDetail/' + mrn, query: {hospId: hospId, pbId: pbId}})
    }
  }
}
</script>

<style lang="scss" scoped>
.report-item{ margin-bottom: 0.5rem }
/deep/.report-content {
  .mint-cell{ min-height:38px;color:$color-font2 }
  .mint-cell-wrapper{ padding: .65rem .5rem 0 }
  .mint-cell-value{color:$color-font7;font-size:.6rem }
  .mint-cell-label{ display: block }
}
.report-content {
  .lable{padding:.1rem 0 .5rem .5rem;color:#888; background:#fff;font-size:.65rem}
  .doc-title {color:$color-font3;border:1px solid $color-font3;border-radius:0.15rem; padding: .05rem .2rem;margin-left:.5rem;font-size:.5rem}
}
/deep/.user-content{
  .mint-cell-text{ font-size:.6rem;color:#888; }
  .mint-cell-label{ color:$color-font1; vertical-align:middle }
  .mint-cell-value span{font-size:.65rem}
}
</style>
