<template>
    <div  class="homepage">
      <div class='doctor-detail'>
        <h4>
          <span>{{docDetail.docName}}</span>
          <span class='sche-rank'>{{docDetail.docTitle}}</span>
        </h4>
        <p>{{docDetail.docSpecial}}</p>
      </div>
      <div class="sche-list"
        v-for='(item) in sortList'
        :key='item.deptId'>
        <div class="sche-item">
          <p>{{item.pbDate}}</p>
          <p class="regi-money">{{item.fee}}元</p>
        </div>
        <div class="sche-item">{{item.timeTypeText}}</div>
        <div class="sche-item">{{item.schTypeText}}</div>
        <div class="sche-item">
          <mt-button type="primary" size="small" :class='{orderAble: isOrder(item)}'
            @click='handleToRegConfirm(item)'
          >
            {{item.pbhyStateText}}
          </mt-button>
        </div>
      </div>
      <NoData v-if="sortList.length==0"></NoData>
    </div>
</template>
<script>
import NoData from '../../components/CommonComponents/NoData.vue'
import { MessageBox } from 'mint-ui'
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  name: 'DoctorHomeage',
  components: {
    NoData
  },
  data () {
    return {
    }
  },

  computed: {
    ...mapGetters({
      'docDetail': 'getDocDetail',
      'sortList': 'getSortList',
      'deptId': 'getDeptId',
      'docId': 'getdocId',
      'hospId': 'getHospId'
      // 'pbhyState': 'getPbhyState'
    })
  },

  created () {
    window.scope = this
    this.changeHeaderTitle('医生主页')
    this.$store.commit('setSortList', [])
    setTimeout(this.getDocdetail, 500)
    this.createPolling()
  },

  methods: {
    ...mapMutations(['changeHeaderTitle', 'setRegMessage', 'setTimeType', 'setPbhyState']),
    ...mapActions(['updateDocdetail', 'updateSortList']),

    loading () {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
    },

    closeLoading () {
      this.$indicator.close()
    },

    getDocdetail () {
      this.loading()
      this.updateDocdetail({
        hospId: this.hospId,
        deptId: this.deptId,
        docId: this.docId,
        pbhyState: this.pbhyState
      })
    },

    /* 轮循流程 */
    createPolling () {
      this.loading()
      this.$api.hospital.getSortPolling({
        hospId: this.hospId,
        deptId: this.deptId,
        docId: this.docId
      }).then(res => {
        this.$api.hospital.SortPolling({
          syncId: res.data.syncId
        }).then(res => {
          this.getSortList()
        }).catch(err => {
          this.closeLoading()
          MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
        })
      })
    },

    /* 更新排班数据 */
    getSortList () {
      this.updateSortList({
        hospId: this.hospId,
        deptId: this.deptId,
        docId: this.docId
      }).then(() => {
        this.closeLoading()
      }).catch(err => {
        this.closeLoading()
        MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
      })
    },

    isOrder (item) {
      const state = +item.pbhyState
      return state === 3 || state === 4
    },

    handleToRegConfirm (item) {
      if (!this.isOrder(item)) return 'can not order!'
      this.setRegMessage(item)
      this.setTimeType(item.timeType)
      this.setPbhyState(item.pbhyState)
      this.$router.push({
        name: 'RegistrationConfirm',
        query: {
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.homepage {
  .doctor-detail {
    min-height: 4rem;
    padding: 0.55rem 0.7rem;
    box-sizing: border-box;
    background-color: $color-bg1;
    border-bottom: 1px solid #eee;
    h4 {
      font-size: $font-size1;
      color: $color-font2;
      height: 1rem;
      display: flex;
      align-items: center;
      .sche-rank {
        box-sizing: border-box;
        border-radius: 2px;
        border: 1px solid $color-font3;
        color: $color-font3;
        margin-left: 2px;
        font-size: 0.5rem;
        padding: 0.05rem .1rem;
        margin-left: 0.25rem;
        line-height: 0.6rem;
      }
    }
    p {
      font-size: $font-size4;
      color: $color-font1;
      margin-top: 0.5rem;
      letter-spacing: 0.08rem;
    }
  }
  .sche-list {
    padding: 11px 15px;
    display: flex;
    justify-content: space-between;
    /*align-items: center;*/
    background-color: $color-font6;
    font-size: $font-size3;
    color: $color-font2;
    border-bottom: 1px solid $color-border;
    .sche-item {
      .regi-money {
        color: $color-font4;
        font-size: $font-size4;
        margin-top: .4rem;
      }
      /deep/ .mint-button--small {
        height: 1.5rem;
        line-height: 1.5rem;
        background-color: $color-btn1;
        &.orderAble {
          background-color: $color-btn2;
        }
      }
    }
    .sche-item:last-child {
      margin-top:0.2rem
    }
  }
}
</style>
