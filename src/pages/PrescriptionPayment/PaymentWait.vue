<template>
  <div>
    <h6 class="hosp-title"><i><img :src="getHospSPic"></i>{{getHospName}}</h6>
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="presWaitListNext==='0'" :auto-fill="false" :max-distance="150" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore">
      <div class="content">
        <cardItem v-for="item in presWaitList" :key="item.presId" :item="item" :tag="tag"></cardItem>
        <span v-if="presWaitList.length !== 0" class="more">{{presWaitListNext==='0' ? "已经到底了":"上拉查看更多"}} ></span>
        <!-- <a class="more" :href="'./registerHistory?userId='">{{allLoaded ? "已经到底了":"上拉查看更多"}} ></a> -->
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
    <NoData v-if="presWaitList.length==0"></NoData>
  </div>
</template>

<script>
import CardItem from '../../components/CommonComponents/CardItem.vue'
import NoData from '../../components/CommonComponents/NoData.vue'
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'PaymentWait',
  components: {
    CardItem, NoData
  },
  data () {
    return {
      tag: 3,
      pageNo: 1,
      pageSize: 12,
      topStatus: '',
      bottomStatus: ''
    }
  },
  created () {
    this.$store.commit('changeHeaderTitle', '待支付处方')
    this.$store.commit('GET_PRES_LIST_FAILURE')
    this.getQueryBill()
  },
  computed: {
    ...mapGetters([
      'presWaitList', 'presWaitListNext', 'getHospName', 'getHospId', 'getHospSPic', 'userInfo'
    ])
  },
  methods: {
    getQueryBill: function () {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getQueryBill', {idCard: this.userInfo.idCard, hospId: this.getHospId})
        .then(res => {
          this.getPresList(this.pageNo, this.pageSize)
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    },
    getPresList: function (pageNo, pageSize) {
      this.$store.dispatch('getPresList', {pageNo: pageNo, pageSize: pageSize, hospId: this.getHospId})
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
      this.getPresList(this.pageNo, this.pageSize)
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom: function () {
      this.pageNo = this.pageNo + 1
      this.getPresList(this.pageNo, this.pageSize)
      this.$refs.loadmore.onBottomLoaded()
    },
    handleTopChange: function (status) {
      this.topStatus = status
    },
    handleBottomChange: function (status) {
      this.bottomStatus = status
    }
  }
}
</script>

<style lang="scss" scoped>
.hosp-title { height: 1rem;line-height: 1.2rem;padding: 0.6rem 0.75rem;background: #fff;margin-bottom: .5rem;border-bottom: 1px solid $color-border2;font-size: 0.75rem }
.hosp-title i { display: inline-block; width: 1.25rem; height: 1.25rem; margin:-.1rem .5rem 0 0; float: left }
.hosp-title i img { width: 100%; height: 100% }
.more { text-align: center; color: $color-font3 !important; display: block; font-size: .6rem }
</style>
