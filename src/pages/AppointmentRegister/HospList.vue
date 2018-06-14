<template>
  <div class="hosp-list">
    <p class="tips">请先选择医院,再继续挂号/缴费。</p>
    <ul class="content-list">
      <li class="list-item" v-for="item in hospList" @click="goNext(item.hospId, item.hospName, item.hospSPic)" :data-hospIcon="item.hospSPic" :key="item.hospId">{{item.hospName}}</li>
    </ul>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'HospList',
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters(['hospList', 'hasAddress', 'userInfo', 'getAddress'])
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '选择医院')
    this.getHospList()
  },
  methods: {
    getHospList: function () {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getHospList', {})
        .then(res => {
          this.$indicator.close()
        })
        .catch(err => {
          this.$indicator.close()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
    },
    goNext: function (id, hospName, hospSPic) {
      this.$store.commit('setTag', this.$route.query.tag)
      this.$store.commit('setHospInfo', {hospId: id, hospName: hospName, hospSPic: hospSPic})
      // 候诊叫号时，不进行档案查询
      parseInt(this.$route.query.tag) === 5 ? this.$router.push({ name: 'DocCallList' }) : this.goFileInfo(id)
    },
    goFileInfo: function (id) {
      // 默认有地址时, 是if (this.hasAddress === '0') {
      if (this.hasAddress === '0') {
        MessageBox({title: '', message: '医院档案信息中没有查到您的家庭住址，添加后才可以进行挂号', showCancelButton: true}).then(action => {
          if (action !== 'cancel') {
            this.$router.push({ name: 'Address' })
          }
        })
      } else {
        this.$indicator.open({ text: '正在努力查询您的医院门诊档案信息', spinnerType: 'snake' })
        this.$store.dispatch('getFileInfo', {hospId: id, siCardNo: this.userInfo.cardNum, idCard: this.userInfo.idCard, address: this.getAddress})
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
}
</script>

<style lang="scss" scoped>
.tips{ padding: .6rem .75rem;border-bottom: 1px solid $color-border;/*border-top: 1px solid #ddd*/ }
.list-item{ font-size: .8rem; color: #333;background: #fff;padding: .6rem .75rem;border-bottom: 1px solid $color-border }
</style>
