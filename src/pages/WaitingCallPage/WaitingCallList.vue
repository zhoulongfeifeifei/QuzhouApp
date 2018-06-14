<template>
  <div>
    <div v-if="waitingCallList.length!=0">
      <ReportItem v-for="item in waitingCallList" :key="item.repId" :item="item" :tag="tag"></ReportItem>
    </div>
    <NoData v-if="waitingCallList.length==0"></NoData>
    <div class="button-container">
      <mt-button type="danger" @click="$router.push({path: '/hospList', query: {tag}})">查询其他医院叫号</mt-button>
    </div>
  </div>
</template>

<script>
import ReportItem from '../../components/CommonComponents/ReportItem.vue'
import NoData from '../../components/CommonComponents/NoData.vue'
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'WaitingCallList',
  components: {
    ReportItem, NoData
  },
  data () {
    return {
      tag: 5
    }
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '候诊叫号')
    this.$store.commit('GET_WAITING_CALL_LIST_FAILURE')
    this.getWaitingCallList()
  },
  computed: {
    ...mapGetters([
      'waitingCallList'
    ])
  },
  methods: {
    getWaitingCallList: function (pageNo, pageSize) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getWaitingCallList', {})
        .then(res => {
          this.$indicator.close()
          if (res.data.length === 0) {
            // 数据为空时添加NoWaitCall字段
            this.$router.push({name: 'HospList', query: {tag: '5', NoWaitCall: '1'}})
          }
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.button-container{
  padding: 0.95rem 0.75rem;
  button{
    width: 100%;
    font-size: .8rem
  }
}
</style>
