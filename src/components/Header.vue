<template>
<div class="header-container">
  <mt-header :title="header">
    <mt-button icon="back" slot="left" @click="goBack()"></mt-button>
  </mt-header>
</div>
</template>

<script>
import { Button } from 'mint-ui'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  components: { Button },
  data () {
    return {

    }
  },
  computed: {
    ...mapGetters([
      'header'
    ])
  },
  methods: {
    goBack () {
      console.log('this.$route', this.$route)
      if (this.$route.name === 'Index' || this.$route.name === 'Protocol' || this.$route.name === 'HomePage' || this.$route.name === 'PasswordSetting' || this.$route.name === 'ErrorPrompt') {
        this.MFS.goBack()
      } else if (this.$route.name === 'RegistrationDetail') {
        this.$route.query.source === 'index' ? this.$router.push('/registerIndex') : this.$router.push('/registerHistory')
      } else if (this.$route.name === 'PresDetail') {
        this.$route.query.source === 'index' ? this.$router.push('/payIndex') : this.$router.push('/payHistory')
      } else if (this.$route.name === 'PayIndex' || this.$route.name === 'RegisterIndex') {
        this.$router.push('/homePage')
      } else if (this.$route.name === 'RegisterHistory') {
        this.$router.push('/registerIndex')
      } else if (this.$route.name === 'PayHistory') {
        this.$router.push('/payIndex')
      } else if (this.$route.name === 'PaymentResult') {
        this.$route.query.navigate === 'regDetail' ? this.$router.push('/registerIndex') : this.$router.push('/PayIndex')
      } else if (this.$route.name === 'PaymentDetail') {
        this.$route.query.syncId ? this.$router.push('registerIndex') : this.$router.back()
      } else if (this.$route.name === 'presPayment') {
        this.$route.query.syncId ? this.$router.push('/payIndex') : this.$router.back()
      } else {
        this.$router.back()
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.header-container{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 999;
}
.mint-header {
  background: $color-bg2;
  height: 2.25rem;
  color: #fff;
  border-bottom: 1px solid #B2B2B2;
  // padding: 10px;
  .mint-header-button {
    flex: .3;
  }
  h1{
    font-size: 0.9rem;
    margin-top: 5px;
    line-height: 1.2rem;
    // height: 1rem;
    // line-height: 1rem;
  }
}
.mint-indicator-mask {
  top: 2.25rem;
}
</style>
