<template>
  <div class="card-header">
    <div class="card-header-box">
      <mt-button @click.native ="goChoseHosp(tag)" class="" size="large" type="danger" plain>{{tag===1? '去挂号':'去缴费'}}</mt-button>
      <router-link class="rule" :to="'./rule?tag=' + tag">{{tag===1? '挂号规则':'缴费规则'}}</router-link>
    </div>
    <div class="history-box">
      <i class="line"></i><p class="subtitle">历史记录</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardHeader',
  props: ['tag'],
  data () {
    return {
    }
  },
  methods: {
    goChoseHosp: function (tag) {
      this.$router.push({name: 'HospList', query: { tag }})
    }
  }
}
</script>

<style lang="scss" scoped>
.card-header-box{
  background: #fff;
  padding: 1.75rem 2rem
}
.mint-button{
  box-sizing: border-box;
 // border: 1px solid $color-bg2;
 // color: $color-bg2;
  letter-spacing: 4px;
  border-radius: 2.6rem;
}
.rule{ float: right; margin-top: 0.5rem; color: $color-bg2 !important }

.line { display: block;border-top:1px solid $color-border2; margin: 1rem .6rem .75rem; }
.history-box{text-align: center;position: relative;}
.subtitle{position: absolute;top: -.4rem;left: 38%;color: #999;background: $color-bg;padding: 0 1rem}
</style>
