<template>
  <view @touchstart="handleTouchstart" @touchend="handleTouchend">
    <slot></slot>
  </view>
</template>

<script>
export default {
  data() {
    return {
      startTime: 0,
      startX: 0,
      startY: 0,
    };
  },
  methods: {
    handleTouchstart(event) {
      this.startTime = Date.now();
      this.startX = event.changedTouches[0].clientX;
      this.startY = event.changedTouches[0].clientY;
    },
    handleTouchend(event) {
      const endTime = Date.now();
      const endX = event.changedTouches[0].clientX;
      const endY = event.changedTouches[0].clientY;

      if (endTime - this.startTime > 2000) {
        return;
      }

      // 滑动的方向
      let direction = '';

      if (
        Math.abs(endX - this.startX) > 10 &&
        Math.abs(endY - this.startY < 10)
      ) {
        direction = endX - this.startX > 0 ? 'right' : 'left';
      } else {
        return;
      }

      this.$emit('swiperAction', { direction });
    },
  },
};
</script>

<style></style>
