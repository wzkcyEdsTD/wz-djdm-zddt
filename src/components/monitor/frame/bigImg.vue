<template>
  <!-- 过渡动画 -->
  <transition name="fade">
    <div class="img-view" @click="bigImg">
      <!-- 遮罩层 -->
      <div id="box">
        <img id="img" :src="imgSrc" @click="stop" />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {};
  },
  // 接受图片地址
  props: ["imgSrc"],
  methods: {
    bigImg() {
      this.$parent.bigShow = false;
    },
    stop(e) {
      e.stopPropagation();
    }
  }
};
</script>

<style lang="less" scoped>
.img-view {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  margin: auto;
  z-index: 40;

  #box {
    overflow: hidden;
    position: relative;
    border: 1px solid #000;
    width: 80%;
    height: 100%;
    left: 10%;
    img {
      position: relative;
      top: 50%;
      transform: translate(0, -50%);
      width: 100%;
      height: 85%;
    }
  }
}
</style>