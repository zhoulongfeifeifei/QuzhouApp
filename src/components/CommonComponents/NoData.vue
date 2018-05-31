<template>
  <div class="noData">
    <img class="img-empty" src="../../assets/icon_empty.png">
    <p class="tips">{{content}}</p>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    'content': {
      type: String,
      default: '当前暂无记录'
    }
  },
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.noData { text-align: center; margin-top: 6rem}
.tips { margin-top: .5rem; font-size: .7rem; color: #666 }
.img-empty {width: 5rem; height: 5rem;}
</style>
