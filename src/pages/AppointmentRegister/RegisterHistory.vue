<template>
  <div>
    <mt-loadmore :top-method="loadTop" :bottom-method="loadBottom" :bottom-all-loaded="regListNext==='0'" :auto-fill="false" :max-distance="150" @top-status-change="handleTopChange" @bottom-status-change="handleBottomChange" ref="loadmore">
      <div v-if="regList.length!=0" class="content" ref="content">
        <cardItem v-for="item in regList" :key="item.regId" :item="item" :tag="tag" :source="source"></cardItem>
        <span class="more">{{regListNext==='0' ? "已经到底了":"上拉查看更多"}} ></span>
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
    <NoData v-if="regList.length==0"></NoData>
  </div>
</template>

<script>
import CardItem from '../../components/CommonComponents/CardItem.vue'
import NoData from '../../components/CommonComponents/NoData.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'RegisterHistory',
  components: {
    CardItem, NoData
  },
  data () {
    return {
      tag: 1,
      source: 'history',
      pageNo: 1,
      pageSize: 12,
      topStatus: '',
      bottomStatus: ''
    }
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '挂号单列表')
    this.getRegisterList(this.pageNo, this.pageSize)
  },
  computed: {
    ...mapGetters([
      'regList', 'regListNext'
    ])
  },
  methods: {
    getRegisterList: function (pageNo, pageSize) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getRegisterList', {pageNo, pageSize})
        .then(res => {
          this.$indicator.close()
        })
        .catch(err => {
          this.$indicator.close()
          this.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
        })
    },
    loadTop: function () {
      this.pageNo = 1
      this.getRegisterList(this.pageNo, this.pageSize)
      this.$refs.loadmore.onTopLoaded()
    },
    loadBottom: function () {
      this.pageNo = this.pageNo + 1
      this.getRegisterList(this.pageNo, this.pageSize)
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

<style lang="scss">
.more { text-align: center; display: block; font-size: .6rem; color: $color-font3 !important; }
</style>
