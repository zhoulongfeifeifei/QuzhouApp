<template>
  <div class="address">
     <div class="add_address">
       <span>家庭住址</span>
       <input type="text" id="addressDetail" placeholder="请填写家庭住址" v-model="address">
     </div>
     <mt-button @click.native ="goAdd()" size="large" type="danger" plain class="add">添加</mt-button>
  </div>
</template>
<script>
import { Button, Toast } from 'mint-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'Address',
  components: { Button },
  data () {
    return {
      address: ''
    }
  },
  computed: {
    ...mapGetters(['hospList'])
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '添加家庭住址')
  },
  methods: {
    goAdd () {
      if (this.address === '') {
        Toast({
          message: '地址不能为空',
          position: 'middle',
          duration: 2000
        })
        console.log(this.$route.query.tag)
      }
    }
  }
}
</script>
<style lang="css" scoped>
.add_address {
    font-size: 0.8rem;
    background: #fff;
    margin-top: 1.2rem;
    padding-left: 1rem;
}
.add_address span{
  display: inline-block;
  width: 30%;
  line-height: 2.4rem;
}
.add_address input{
  display: inline-block;
  width: 65%;
  height: 1.4rem;
  border: none;
  resize: none;
  outline: none;
  font-size: 0.7rem;
  color: #666;
  }
  .add{
    width: 94%;
    margin: 0 auto;
  }
</style>
