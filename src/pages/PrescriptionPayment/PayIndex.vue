<template>
  <div>
    <cardHeader :tag="tag"></cardHeader>
    <div v-if="presList.length!=0">
      <cardItem v-for="item in presList" :key="item.regId" :item="item" :tag="tag" :source="source"></cardItem>
      <router-link class="more" :to="'./payHistory'">更多历史记录 ></router-link>
    </div>
    <NoData v-if="presList.length==0"></NoData>
  </div>
</template>

<script>
import CardHeader from '../../components/CommonComponents/CardHeader.vue'
import CardItem from '../../components/CommonComponents/CardItem.vue'
import NoData from '../../components/CommonComponents/NoData.vue'
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'PayIndex',
  components: {
    CardItem, CardHeader, NoData
  },
  data () {
    return {
      tag: 2,
      source: 'index',
      pageNo: 1,
      pageSize: 3
    }
  },
  created () {
    this.$store.commit('changeHeaderTitle', '就诊缴费')
    this.getPayList(this.pageNo, this.pageSize)
  },
  computed: {
    ...mapGetters(['presList'])
  },
  methods: {
    getPayList: function (pageNo, pageSize) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getPayList', {pageNo, pageSize})
        .then(res => {
          this.$indicator.close()
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    }
  }
}
</script>

<style lang="scss">
.more { text-align: center; display: block; font-size: .6rem; color: $color-font3 !important; }
</style>
