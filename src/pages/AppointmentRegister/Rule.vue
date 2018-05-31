<template>
  <div v-html="rule" class="rule">
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Rule',
  data () {
    return {
    }
  },
  created () {
    window.scope = this
    let tag = this.$route.query.tag
    this.$store.commit('changeHeaderTitle', tag === '1' ? '挂号规则' : '缴费规则')
    this.$store.dispatch('getRule', {ruleType: tag})
      .then(res => {
        this.$indicator.close()
      })
      .catch(err => {
        this.$indicator.close()
        this.$toast({message: err.msg ? err.msg : '服务器繁忙', position: 'center', duration: 2000})
      })
  },
  computed: {
    ...mapGetters(['rule'])
  },
  methods: {
  }
}
</script>

<style scoped>
.rule { background: #fff; padding: 1rem; line-height: 1.2rem; font-size: .7rem }
</style>
