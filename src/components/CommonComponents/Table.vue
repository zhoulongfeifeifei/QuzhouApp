<template>
<div>
  <div class="my-table my-table-large my-table-scroll-position-left">
    <div class="my-table-content">
      <div class="my-table-body">
        <table class="">
          <thead class="my-table-thead">
            <tr>
              <th class="" v-for="(item, index) in columns" :key="index">
                <p><span>{{item.title}}</span></p>
                <p v-if="item.subTitle"><span>{{item.subTitle}}</span></p>
              </th>
            </tr>
          </thead>
          <tbody class="my-table-tbody">
            <tr class="my-table-row" v-for="(item, index) in data" :key="index" v-show="!hideMore || (hideMore && index === 0)">
                <td class="" v-for="(it, idx) in columns" :key="idx">
                  <p v-if="item[it.value]"><span>{{item[it.value]}}</span></p>
                  <p v-if="item[it.subValue]"><span>{{item[it.subValue]}}</span></p>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'MyTable',
  props: {
    'columns': Array,
    'data': Array,
    'hideMore': Boolean
  },
  data () {
    return {

    }
  },
  methods: {
    onCancelFunc () {
      document.body.style.overflow = ''
      this.$emit('oncancel')
    },
    onOkFunc () {
      document.body.style.overflow = ''
      this.$emit('onok')
    }

  },
  mounted () {
    document.body.style.overflow = 'hidden'
  },

  destroyed () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.my-table {
    font-family: "Monospaced Number", "Chinese Quote", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 0.6rem;
    color:#666666;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    clear: both;
}
.my-table-body {
    -webkit-transition: opacity .3s;
    transition: opacity .3s;
}
.my-table table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    text-align: left;
    border-radius: 4px 4px 0 0;
}
.my-table-thead > tr, .my-table-tbody > tr {
    -webkit-transition: all .3s;
    transition: all .3s;
}
.my-table-thead > tr:first-child > th:first-child {
    border-top-left-radius: 4px;
}
.my-table-thead > tr > th:last-child, .my-table-tbody > tr > td:last-child {
    text-align: right;
}
.my-table-thead > tr > th, .my-table-tbody > tr > td {
    height:45px;
    word-break: break-all;
}
.my-table-thead > tr > th {
    background: #fafafa;
    -webkit-transition: background .3s ease;
    transition: background .3s ease;
    text-align: left;
    border-bottom: 1px dashed #eeeeee;
    border-top: 1px solid #eeeeee;
    color: #666666;
    font-weight: normal;
}
.my-table-tbody > tr > td {
    // border-bottom: 1px solid #eeeeee;
    -webkit-transition: all .3s;
    transition: all .3s;
}
</style>
