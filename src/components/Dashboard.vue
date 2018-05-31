<template>
  <div class="dashboard">
    <Header/>
    <div class="main-container">
      <router-view/>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header'

export default {
  name: 'Dashboard',
  components: { Header },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.dashboard{
  height: 100%;
}
.main-container{
  padding-top: 2.25rem;
  padding-bottom: 0.5rem;
}
</style>
