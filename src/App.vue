<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import './common/style/reset';

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: $color-bg;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow: auto;
}

.card-container{
  margin: $base-indent;
}
.margin-bottom-m{
  margin-bottom: $base-indent;
}
.margin-top-m{
  margin-top: $base-indent;
}

// 改写indicator组件样式
.mint-indicator-wrapper{
  padding: 0.45rem 1rem;
  display: flex;
}
.mint-spinner-snake{
  border: 3px solid #cccccc;
  border-top-color: $color-font3 !important;
  height: 0.7rem!important;
  width: 0.7rem!important;
}
.mint-indicator-text{
  flex: 1;
  font-size: 0.7rem;
  margin-top: 0.1rem;
  font-weight: 300;
  margin-left: 0.5rem;
  white-space: nowrap;
}
</style>
