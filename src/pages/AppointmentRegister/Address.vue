<template>
  <div class="address">
    <mt-field label="家庭住址" placeholder="请输入家庭住址" v-model="address" class="add-address"></mt-field>
    <div class="button-container">
      <mt-button @click.native ="goAdd()" size="large" type="danger">添 加</mt-button>
    </div>
  </div>
</template>
<script>
import { Button, MessageBox, Toast } from 'mint-ui'
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
    ...mapGetters(['getHospId', 'userInfo'])
  },
  created () {
    window.scope = this
    this.$store.commit('changeHeaderTitle', '添加家庭住址')
  },
  methods: {
    goAdd () {
      let pattern = /[`~!@#$%^&*()+<>?:"{},.\\/;'[\]]/im
      if (this.address === '') {
        Toast({
          message: '地址不能为空',
          position: 'middle',
          duration: 2000
        })
      } else if (pattern.test(this.address)) {
        Toast({
          message: '地址格式不正确',
          position: 'middle',
          duration: 2000
        })
      } else if (this.address.length > 50) {
        Toast({
          message: '地址格式长度不能超过50位',
          position: 'middle',
          duration: 2000
        })
      } else {
        this.$indicator.open({text: '加载中...', spinnerType: 'snake'})
        this.$store.dispatch('getFileInfo', {hospId: this.getHospId, address: this.address, idCard: this.userInfo.idCard, siCardNo: this.userInfo.cardNum})
          .then(res => {
            this.$indicator.close()
          })
          .catch(err => {
            this.$indicator.close()
            MessageBox('提示', err.msg ? err.msg : '服务器繁忙')
            // this.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.add-address{
  margin-top: .5rem;
  border-top: 1px solid $color-border2;
  border-bottom: 1px solid $color-border2;
}
.add-address .mint-cell-value{
  font-size: .8rem
}
.button-container{
  padding: 0.95rem 0.75rem;
  button{
    width: 100%;
    font-size: .8rem
  }
}
</style>
