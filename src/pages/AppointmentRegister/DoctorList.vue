<template>
  <div class="doctor-list">
    <mt-cell :title='item.docName' :value='item.docTitle' v-for='(item, index) in docList' :key='item.docId' is-link @click.native='handleToDocDetail(item.docId, index)'>
    </mt-cell>
  </div>
</template>
<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  name: 'DoctorList',
  data () {
    return {
    }
  },
  created () {
    window.scope = this
    this.changeHeaderTitle('医生列表')
    this.$store.commit('setDoctorList', [])
    this.getDoctorList()
  },
  computed: {
    ...mapGetters({
      'docList': 'getDoctorList',
      'deptId': 'getDeptId',
      'hospId': 'getHospId'
    })
  },
  methods: {
    ...mapMutations(['changeHeaderTitle', 'setDocId']),
    ...mapActions(['updateDoctorList']),

    loading () {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
    },

    closeLoading () {
      this.$indicator.close()
    },

    getDoctorList () {
      this.loading()
      this.updateDoctorList({
        hospId: this.hospId,
        deptId: this.deptId
      }).then(() => {
        this.closeLoading()
      }).catch(err => {
        this.closeLoading()
        this.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
      })
    },

    handleToDocDetail (id, index) {
      this.setDocId(id)
      this.$router.push({
        name: 'DoctorHomepage',
        query: {
          id,
          hospId: this.hospId
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
/* DoctorList */
.doctor-list {
  /deep/ .mint-cell {
    border-bottom: 1px solid $color-border
  }
  /deep/ .mint-cell-value {
    font-size: $font-size4;
    color: $color-font7;
    line-height: 0.6rem;
  }
  /deep/ .mint-cell-wrapper {
    background-origin: unset;
  }
}

</style>
