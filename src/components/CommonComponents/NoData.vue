<template>
  <div class="noData">
    <img class="img-empty" src="../../assets/icon_empty.png">
    <!-- <p class="tips">{{content}}</p> -->
    <p class="tips">{{ pageType==='inspection'? content2: content}}</p>
  </div>
</template>

<script>
export default {
  name: 'NoData',
  props: {
    'content': {
      type: String,
      default: '当前暂无记录'
    },
    'content2': {
      type: String,
      default: '暂未查询到您在该医院有相关的检查检验报告单信息，请确认后再次查询。'
    },
    'pageType': {
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
.tips { margin: .5rem auto; font-size: .7rem; color: #666; width: 80%; line-height: 1rem }
.img-empty {width: 5rem; height: 5rem;}
</style>
