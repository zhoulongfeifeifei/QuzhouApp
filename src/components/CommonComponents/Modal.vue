<template>
<div>
  <transition-group>
    <div class="modal-mask" :style="{display: visible ? 'block': 'none'}" key="1"></div>
    <div class="modal fade" :class="[className]" :style="{display: visible ? 'block': 'none'}" id="myModal" key="2">
      <div class="modal-dialog" :style="{width: Number.isInteger(width) ? width + 'px' : width}">
        <div class="modal-content">
          <div class="modal-header" v-if="header">
            <button type="button" class="modal-close" data-dismiss="modal" @click="onCancelFunc"><span aria-hidden="true">&times;</span></button>
            <h4 class="modal-title" id="myModalLabel">{{title}}</h4>
          </div>
          <div class="modal-body">
            <slot></slot>
          </div>
          <div class="modal-footer" v-if="footer">
            <button type="button" class="btn btn-default" data-dismiss="modal" @click="onCancelFunc">关闭</button>
            <button type="button" class="btn btn-primary" @click="onOkFunc">{{okText}}</button>
          </div>
        </div>
      </div>
    </div>
  </transition-group>
</div>
</template>

<script>
export default {
  name: 'MyModal',
  props: {
    'visible': null,
    'footer': null,
    'header': null,
    'title': null,
    'width': {type: [Number, String], default: '13rem'},
    'className': String,
    'okText': {type: String, default: '确认'},
    'oncancel': Function,
    'onok': Function
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
    window.addEventListener('click', this.onCancelFunc)
  },

  destroyed () {
    window.removeEventListener('click', this.onCancelFunc)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.modal-mask {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    background-color: #373737;
    background-color: rgba(0, 0, 0, 0.65);
    height: 100%;
    z-index: 1000;
    filter: alpha(opacity=50);
}
.modal {
    position: fixed;
    overflow: auto;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1000;
    -webkit-overflow-scrolling: touch;
    outline: 0;
}
.modal.modal-dialog {
    font-size: 0.7rem;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    list-style: none;
    position: relative;
    width: auto;
    margin: 0 auto;
    top: 5rem;
    padding-bottom: 1.2rem;
}
.modal-content {
    position: relative;
    background-color: #fff;
    border: 0;
    border-radius: 4px;
    background-clip: padding-box;
    -webkit-box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
.modal-close {
    cursor: pointer;
    background: transparent;
    z-index: 10;
    color: rgba(0, 0, 0, 0.45);
    span{
      font-size: 1.4rem;
      line-height: 1.2rem;
    }
}
.modal-header {
    padding: 0.55rem 0.75rem;
    border-radius: 4px 4px 0 0;
    background: #fff;
    color: rgba(0, 0, 0, 0.65);
    border-bottom: 1px solid #e8e8e8;
    display: flex;

    .modal-title {
        margin: 0;
        font-size: 0.9rem;
        line-height: 1.2rem;
        flex: 1;
        text-align: center;
        color: #333333;
    }
}
.modal-body {
    padding: 1.2rem;
    font-size: 0.7rem;
    line-height: 1.5;
}
.modal-footer {
    border-top: 1px solid #e8e8e8;
    padding: 0.5rem 0.8rem;
    text-align: right;
    border-radius: 0 0 4px 4px;
}
</style>
