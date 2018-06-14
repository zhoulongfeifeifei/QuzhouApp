<template>
  <div>
    <div class="select-box">
      <span>时间</span>
      <select v-model="selected" v-on:change="updateList" class="select-content">
        <option v-for="(item, index) in selectFields" :value="item.value" :key="index" >{{item.text}}</option>
      </select>
      <i></i>
    </div>
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="inspectionListNext==='0'" :auto-fill="false" :max-distance="150" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore">
      <div v-if="inspectionList.length!=0" class="content" ref="content">
        <ReportItem v-for="item in inspectionList" :key="item.repId" :item="item" :tag="tag" :source="source"></ReportItem>
        <span class="more">{{inspectionListNext==='0' ? "已经到底了":"上拉查看更多"}} ></span>
      </div>
      <div slot="top" class="mint-loadmore-top">
        <span v-show="topStatus === 'pull'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
        <span v-show="topStatus === 'loading'">Loading...</span>
        <span v-show="topStatus === 'drop'">释放更新</span>
      </div>
      <div slot="bottom" class="mint-loadmore-bottom">
        <span v-show="bottomStatus === 'pull'" :class="{ 'rotate': bottomStatus === 'drop' }">↑</span>
        <span v-show="bottomStatus === 'loading'">Loading~~~</span>
        <span v-show="bottomStatus === 'drop'">释放更新</span>
      </div>
    </mt-loadmore>
    <NoData v-if="inspectionList.length==0" :pageType="pageType"></NoData>
    <MyModal :width="'100%'" title="选择支付方式" :visible="visible" @oncancel="onCancel" @onok="onOk" v-if="visible" :className="'pick-number-modal'" :header="true">
      <a class="number-cell" v-for="(item, index) in selectFields" :key="index" @click="paymentMethod(item.value,item.name,item.icon)">
        <img :src="item.icon" alt="" :style="{width: '1.2rem', height: '1.2rem'}">{{item.name}}
      </a>
    </MyModal>
  </div>
</template>

<script>
import ReportItem from '../../components/CommonComponents/ReportItem.vue'
import NoData from '../../components/CommonComponents/NoData.vue'
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'InspectionList',
  components: {
    ReportItem, NoData
  },
  data () {
    return {
      selectFields: [
        { value: 0, text: '全部' },
        { value: 1, text: '一周内' },
        { value: 2, text: '一个月内' },
        { value: 3, text: '半年内' }
      ],
      selected: '1',
      visible: false,
      tag: 4,
      pageNo: 1,
      pageSize: 12,
      topStatus: '',
      bottomStatus: '',
      pageType: 'inspection', // noData判断显示哪个暂无记录的文案
      source: 'list' // 判断是否从消息中心进入，便于返回上一页
    }
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '我的报告单')
    this.$store.commit('GET_INSPECTION_LIST_FAILURE')
    this.getInspectionList(this.pageNo, this.pageSize, this.getHospId)
  },
  computed: {
    ...mapGetters([
      'getHospId', 'inspectionList', 'inspectionListNext', 'inspectionTime'
    ])
  },
  methods: {
    getInspectionList: function (pageNo, pageSize, hospId) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getInspectionList', {pageNo, pageSize, hospId, timeState: this.inspectionTime})
        .then(res => {
          this.$indicator.close()
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    },
    loadTop: function () {
      this.pageNo = 1
      this.getInspectionList(this.pageNo, this.pageSize, this.getHospId)
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom: function () {
      this.pageNo = this.pageNo + 1
      this.getInspectionList(this.pageNo, this.pageSize, this.getHospId)
      this.$refs.loadmore.onBottomLoaded()
    },
    handleTopChange: function (status) {
      this.topStatus = status
    },
    handleBottomChange: function (status) {
      this.bottomStatus = status
    },
    updateList: function () {
      this.$store.commit('setInspectionTime', this.selected)
      this.getInspectionList(this.pageNo, this.pageSize, this.getHospId)
    }
  }
}
</script>

<style lang="scss">
.more { text-align: center; display: block; font-size: .6rem; color: $color-font3 !important; }
.select-box{
  padding: 0.6rem 0.5rem;
  background: $color-bg;
  border-bottom:1px solid $color-border;
  position:relative;
  .select-content{
    width: 88%;
    margin-left: .5rem;
    padding: .3rem 1rem .4rem;
    border:1px solid $color-border2;
    border-radius: 2.15rem;
    overflow: hidden;
    background-color:#fff;
    -webkit-appearance: none;
  }
  .select-content:focus {
    outline: -webkit-focus-ring-color auto 0;
  }
}
.select-box i{
  display:inline-block;
  height:1rem;width:1rem;
  position:absolute;
  right:1.5rem;
  top:1.3rem;
  background:url('../../assets/xiala@1x.png') no-repeat
}
</style>
