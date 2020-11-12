<template>
  <view @click="handleClick">
    <slot></slot>
  </view>
</template>

<script>
export default {
  props: {
    list: Array,
    index: Number,
  },
  methods: {
    handleClick() {
      // 1. 缓存数据
      getApp().globalData.imgList = this.list;
      getApp().globalData.imgIndex = this.index;
      // 2. 点击跳转页面
      uni.navigateTo({
        url: '/pages/imgDetail/index',
      });
    },
  },
};
</script>

<style></style>
