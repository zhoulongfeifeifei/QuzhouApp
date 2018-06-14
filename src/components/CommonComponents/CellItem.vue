<template>
  <a class="cell" :class="className">
    <div class="cell-left"></div>
    <div class="cell-wrapper">
      <div class="cell-title">
        <span class="cell-text">{{title}}</span>
      </div>
      <div class="cell-value" :class="{isLink: isLink}" :style="{color: textColor && value ? textColor : '#333333'}">
        <span class="single-line cell-span">{{value ? value : '-'}}</span>
        <span :style="{color: '#333333'}">{{isMoney && value ? ' 元' : ''}}</span>
      </div>
      <div class="cell-value" v-if="valueDiv">
        <slot name="value-div"></slot>
      </div>
      <a v-if="isLink" @click="linkto()">
        <i class="cell-allow-right"></i>
      </a>
      <a @click="changeCollapseStatus(true)" v-if="isOpen && !hasOpen">
        <i class="cell-allow-down"></i>
      </a>
      <a @click="changeCollapseStatus(false)" v-if="isOpen && hasOpen">
        <i class="cell-allow-up" v-if="isOpen && hasOpen"></i>
      </a>
    </div>
    <div class="cell-right"></div>
    <div class="collapse-content collapse-content-inactive" role="tabpanel" v-if="isOpen && hasOpen">
      <div class="collapse-content-box">
        <slot name="collapse-content"></slot>
      </div>
    </div>
  </a>
</template>

<script>
export default {
  name: 'CellItem',
  props: {
    'title': String,
    'value': null,
    'valueDiv': Boolean,
    'isLink': Boolean,
    'isOpen': Boolean,
    'isMoney': Boolean,
    'textColor': String,
    'openContent': null,
    'className': String,
    'linkto': Function
  },
  data () {
    return {
      hasOpen: true

    }
  },
  methods: {
    changeCollapseStatus (status) {
      this.hasOpen = status
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.cell {
    background-color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: inherit;
    min-height: 2.3rem;
    display: block;
    overflow: hidden;
    position: relative;
    text-decoration: none;
    border-bottom: 1px solid $color-border;
}
.cell:last-child {
    border-bottom: 0;
    background-repeat: no-repeat;
    background-position: bottom;
}
.cell-wrapper {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 0.8rem;
    line-height: 1;
    min-height: inherit;
    overflow: hidden;
    padding: 0 0 0 0.7rem;
    width: 100%;
}
.cell:first-child .cell-wrapper {
    background-origin: border-box;
}
.cell-title {
    text-align: left;
    font-size: 0.7rem;
    color: #666666;
    letter-spacing: 0;
    line-height: 1.2rem;
    width: 5.6rem;
}
.cell-text {
    vertical-align: middle;
}
.cell-value {
    color: #888;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    font-size: 0.7rem;
    color: #333333;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    height: 1.2rem;
    .cell-span {
      max-width: 12rem;
      line-height: 1.2rem;
    }
}
.cell-value.is-link {
    margin-right: 24px;
}
.cell-left {
    position: absolute;
    height: 100%;
    left: 0;
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
}
.cell-right {
    position: absolute;
    height: 100%;
    right: 0;
    top: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
}
.cell-allow-right::after {
    border: solid 1px #979797;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    right: 1rem;
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
}
.cell-allow-up::after {
    border: solid 1px #979797;
    border-bottom-width: 0;
    border-right-width: 0;
    content: " ";
    right: 1rem;
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    top: 1.3rem;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
}
.cell-allow-down::after {
    border: solid 1px #979797;
    border-top-width: 0;
    border-left-width: 0;
    content: " ";
    right: 1rem;
    position: absolute;
    width: 0.5rem;
    height: 0.5rem;
    top: 1rem;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
}
.collapse-content {
    background-color: transparent;
    border-top: 0;
}
.collapse-item:last-child > .collapse-content {
    border-radius: 0 0 4px 4px;
}
.collapse-content {
    overflow: hidden;
    color: rgba(0, 0, 0, 0.65);
    padding: 0 16px;
    background-color: #fff;
    border-top: 1px solid #d9d9d9;
}
.collapse-content > .collapse-content-box {
    padding-top: 16px;
    padding-bottom: 16px;
}
</style>
