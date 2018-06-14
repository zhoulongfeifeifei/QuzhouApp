<template>
  <div class="wait-detail">
    <div class="doct-detail">
      <div class="photo">
        <!-- <img v-if="waitingCallDetail.docPic" :src="waitingCallDetail.docPic" alt="" class="photo"> -->
        <img src="../../assets/morem@1x.png" alt="" class="photo">
      </div>
      <div class="doc-pho">
        <h3><span class="doc-name">{{waitingCallDetail.docName}}</span> <span>{{waitingCallDetail.docTitle}}</span></h3>
        <p @click="isShow">{{introduce}}
          <img v-show="imgSure" src="../../assets/xiala@1x.png" alt="" class="photo">
        </p>
      </div>
      <div class="update" @click="update()">
        <img src="../../assets/updata@1x.png" alt="">
        <span>刷新</span>
      </div>
    </div>
    <div class="wait-call">
      <div class="wait-call-dev">
        <span>当前叫号</span>
        <span class="wait-span">
          <em>上午</em>
          <em class="wait-num">{{waitingCallDetail.itemList[0].curNum ? waitingCallDetail.itemList[0].curNum : '--'}}</em>
          <em>号</em>
        </span>
      </div>
      <div class="wait-call-dev">
        <span>我的排队号</span>
        <span class="wait-span">
          <em class="wait-num">{{waitingCallDetail.itemList[0].myNum ? waitingCallDetail.itemList[0].myNum : '--'}}</em>号
        </span>
      </div>
    </div>
    <div class="register-detail" @click="goToRegistrationDetail(waitingCallDetail.itemList[0].callId)" v-if="waitingCallDetail.itemList[0].callId.length>0">
      <span>{{waitingCallDetail.itemList[0].userName}}</span>
      <p>
        <span>查看挂号单详情</span>
        <img src="../../assets/right@1x.png" alt="">
      </p>
    </div>
    <div class="warm-prompt">
      <h3>温馨提示：</h3>
      <p>{{waitingCallDetail.warnTip ? waitingCallDetail.warnTip : ''}}</p>
    </div>
      <mt-button class="go-button" type="primary" v-if="waitingCallDetail.itemList[0].callId" @click.native="goToRegisterIndex(waitingCallDetail.hospId, waitingCallDetail.hospName, waitingCallDetail.docId, waitingCallDetail.deptId, waitingCallDetail.deptName)">预约挂号</mt-button>
  </div>
</template>

<script>
import { Button, MessageBox } from 'mint-ui'
import { mapMutations, mapGetters, mapActions } from 'vuex'
export default {
  name: 'WaitingCallDetail',
  components: {
    Button
  },
  data () {
    return {
      introduce: '',
      imgSure: true,
      introduces: '',
      checks: false
    }
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '候诊叫号')
    this.$store.commit('GET_CALL_DETAIL_FAILURE')
  },
  mounted () {
    if (this.$route.query.hospId && this.$route.query.pbId) {
      // 通过病历号进入
      this.withMrnDetail(this.$route.query.hospId, this.$route.query.pbId, this.$route.params.id)
    } else {
      this.withDocDetail(this.$route.params.id, this.$route.query.docId, this.$route.query.deptId)
    }
  },
  computed: {
    ...mapGetters({
      'waitingCallDetail': 'waitingCallDetail',
      'hospId': 'getHospId',
      'deptId': 'getDeptId',
      'docId': 'getdocId'
    })
  },
  methods: {
    ...mapMutations(['setDocId', 'setDocInfo']),
    ...mapActions(['withMrnToCallDetail', 'withDocToCallDetail']),
    // 字符串截取
    interception () {
      this.introduce = this.waitingCallDetail.docDesc
      if (!this.introduce) {
        this.introduce = ''
      }
      if (this.introduce.length > 40) {
        this.introduces = this.introduce
        this.introduce = this.introduce.slice(0, 40) + '...'
        this.imgSure = true
      } else {
        this.imgSure = false
      }
    },
    isShow () {
      if (this.introduces.length > 40) {
        if (this.checks === false) {
          this.introduce = this.introduces
          this.imgSure = false
        } else {
          this.imgSure = true
          this.introduces = this.introduce
          this.introduce = this.introduce.slice(0, 40) + '...'
        }
        this.checks = !this.checks
      }
    },

    withMrnDetail (hospId, pbId, mrn) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.withMrnToCallDetail({hospId, pbId, mrn}).then(() => {
        this.$indicator.close()
        this.interception()
      }).catch(err => {
        this.$indicator.close()
        MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
      })
    },
    withDocDetail (hospId, docId, deptId) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.withDocToCallDetail({hospId, docId, deptId}).then(() => {
        this.$indicator.close()
        this.interception()
      }).catch(err => {
        this.$indicator.close()
        MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
      })
    },

    // 刷新当前页面
    update () {
      if (this.$route.query.hospId && this.$route.query.pbId) {
        this.withMrnDetail(this.$route.query.hospId, this.$route.query.pbId, this.$route.params.id)
      } else {
        this.withDocDetail(this.$route.params.id, this.$route.query.docId, this.$route.query.deptId)
      }
    },
    // 跳转挂号单详情页面
    goToRegistrationDetail (params) {
      this.$router.push({path: '/regDetail/' + params, query: {source: 'waiting'}})
    },
    // 跳转到就诊挂号页面
    goToRegisterIndex (hospId, hospName, docId, deptId, deptName) {
      this.setDocId(docId)
      let obj = {hospId: hospId, hospName: hospName, deptId: deptId, deptName: deptName}
      this.setDocInfo(obj)
      this.$router.push({
        name: 'DoctorHomepage',
        query: {
          docId,
          hospId: hospId
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.doct-detail{
  width: 100%;
  // min-height: 8.3rem;
  background: url(../../assets/bg@1x.png) no-repeat center center;
  background-size: 100%;
  position: relative;
  .photo{
    width: 3.5rem;
    height: 4.5rem;
    line-height: 4.5rem;
    margin: 0 auto;
    text-align: center;
    img{
      width: 3.5rem;
      height: 3.5rem;
    }
  }
  .doc-pho{
    height: auto;
    h3{
      height: 1rem;
      line-height: 1rem;
      font-size:0.55rem;
      color:$color-font7;
      text-align: center;
      padding-bottom: 0.5rem;
      .doc-name{
        font-size: $font-size1;
        color: #333;
      }
    }
    p{
      padding:  0 0.75rem;
      font-size:$font-size4;
      color:#555555;
      line-height: 0.8rem;
       text-indent:2em;
       img{
         width: 0.7rem;
         height: 0.3rem;
         text-align: right;
         padding-left: 5%;
       }
    }
  }
  .update{
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.8rem;
    font-size: $base-indent;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.wait-call{
  padding: 0 0.75rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #fff;
  border:1px solid $color-border;
  border-right:0;
  border-left:0;
  .wait-call-dev{
    padding:0.5rem 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: $font-size1;
    color:#333;
    .wait-span{
      font-size: $font-size4;
      color: $color-font1;
      padding-top:0.5rem;
      .wait-num{
        color: $color-font4;
        font-size: $font-size1;
      }
    }
  }
}
.register-detail{
  padding: 0.5rem 0.75rem;
  color: $color-font1;
  font-size: $font-size3;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background: #fff;
  border-bottom:1px solid $color-border2;
  p{
    color:$color-font7;
    font-size: $font-size4;
  }
}
.warm-prompt{
  padding: 0 0.8rem;
  margin: 0.5rem auto;
  background: #fff;
  border:1px solid $color-border2;
  border-right:0;
  border-left:0;
  h3{
    color: $color-font1;
    font-size: $font-size3;
    padding-top:0.5rem;
  }
  p{
    color: $color-font7;
    font-size: $font-size4;
    padding:0.2rem 0;
  }
}
.go-button{
  display: block;
  width: 92%;
  height: 2.25rem;
  margin: 1rem auto;
  line-height: 2.25rem;
  background:$color-bg2;
  border-radius:5px;
  color: $bg-color;
  font-size: $font-size1;
}
</style>
