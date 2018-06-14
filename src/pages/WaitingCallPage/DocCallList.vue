<template>
  <div class="page-search">
    <div class="search">
      <img src="../../assets/search@1x.png" alt="" class="search-bg">
      <form action="" method="" autocomplete="off" onsubmit="return false;">
        <input type="search" v-model='value' class="mint-search" autocomplete="off" autocorrect="off" @keypress.enter="search(value,$event)" @keyup="submit(value,$event)" placeholder="请输入关键字"/>
      </form>
    </div>
    <ul class="list">
      <li v-for="item in docCallList" :key="item.deptName">
        <p>{{item.deptName}}</p>
        <div class="call-list" @click="goDetail(items.docId, items.deptId)" v-for="items in item.deptList" :key="items.docId">
          <span class="call-name">{{items.docName}}</span>
          <div class="list-num">
            <img src="../../assets/laba@1x.png" alt="">
            <span class="call-num">{{items.curNum}}</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { MessageBox } from 'mint-ui'
import { mapGetters } from 'vuex'
export default {
  name: 'DocCallList',
  components: {
  },
  data () {
    return {
      value: ''
    }
  },
  computed: {
    ...mapGetters(['docCallList', 'getHospId'])
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '候诊叫号')
    this.$store.commit('GET_DOC_CALL_LIST_FAILURE')
    this.getDocCallList()
  },
  methods: {
    // 进入详情页面
    goDetail (docId, deptId) {
      this.$router.push({path: '/waitingCallDetail/' + this.getHospId, query: {docId, deptId}})
    },
    // 搜索
    search (keys, $event) {
      let keyCode = $event.keyCode
      if (keys) {
        if (keyCode === 13) {
          $event.preventDefault()
          this.getDocCallList(keys)
        }
      }
    },
    // 监听当搜索框为空时候的处理
    submit (keys, $event) {
      let keyCode = $event.keyCode
      if (keyCode === 8) {
        if (!keys) {
          $event.preventDefault()
          this.getDocCallList(keys)
        }
      }
    },
    getDocCallList (keys) {
      this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
      this.$store.dispatch('getDocCallList', {hospId: this.getHospId, key: keys})
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

<style lang="scss" scoped>
.search{
  padding: 0.6rem 0.5rem;
  background: $bg-color;
  position: relative;
  border-bottom:1px solid $color-border;
  .search-bg{
    width: 0.8rem;
    height: 0.8rem;
    position: absolute;
    left:1.2rem;
    top:1.15rem;
  }
  .mint-search{
    display: inline-block;
    width: 100%;
    background:$color-bg;
    height:1.75rem;
    border-radius:2.15rem;
    color: $color-font7;
    text-indent: 2rem
  }
   input[type=search]::-webkit-search-cancel-button{
    -webkit-appearance: none;/*此处只是去掉默认的小×*/
  }
}
.list{
  height:auto;
  background-color:$bg-color;
  color:#333;
  p{
    padding:0.7rem 0.75rem;
    background:$color-bg;
    border-bottom:1px solid $color-border;
    font-size:$font-size2;
  }
  li{
    border-bottom:1px solid $color-border;
  }
  .call-list{
    padding:0.65rem 0.75rem 0.65rem 0;
    margin-left: 0.75rem;
    background:$bg-color;
    border-bottom:1px solid $color-border;
     font-size:$font-size3;
     display:flex;
     justify-content:space-between;
    .call-name{
      display:inline-block;
      letter-spacing:-0.15px;
      text-align:left;
    }
    .list-num{
      display:inline-block;
      text-align:right;
      .call-num{
        display:inline-block;
        width:1.5rem;
        color:$color-font3;
        letter-spacing:-0.15px;
      }
      img{
        width:0.75rem;
        height:0.75rem;
        padding:0 0.2rem;
      }
    }
  }
  .call-list:last-child{
    border-bottom:none
  }
}
</style>
