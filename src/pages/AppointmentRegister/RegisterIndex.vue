<template>
  <div>
    <cardHeader :tag="tag"></cardHeader>
    <div v-if="regList.length!=0">
      <cardItem v-for="item in regList" :key="item.regId" :item="item" :tag="tag" :pageSize="pageSize" :source="source"></cardItem>
      <router-link class="more" :to="'./registerHistory'">更多历史记录 ></router-link>
    </div>
    <NoData v-if="regList.length==0"></NoData>
  </div>
</template>

<script>
import CardHeader from '../../components/CommonComponents/CardHeader.vue'
import CardItem from '../../components/CommonComponents/CardItem.vue'
import NoData from '../../components/CommonComponents/NoData.vue'
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'RegisterIndex',
  components: {
    CardItem, CardHeader, NoData
  },
  data () {
    return {
      tag: 1,
      source: 'index',
      pageNo: 1,
      pageSize: 3
    }
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '预约挂号')
    this.getRegisterList(this.pageNo, this.pageSize)
  },
  computed: {
    ...mapGetters([
      'regList', 'userInfo'
    ])
  },
  methods: {
    getRegisterList: function (pageNo, pageSize) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getRegisterList', {pageNo: pageNo, pageSize: pageSize})
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
