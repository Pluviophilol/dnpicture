<template>
  <scroll-view
    @scrolltolower="handleScrolltolower"
    scroll-y
    enable-flex
    class="video_main"
  >
    <view
      class="video_item"
      v-for="item in videowp"
      :key="item.id"
      @click="handleGoVideo(item)"
    >
      <image mode="widthFix" :src="item.img"></image>
    </view>
  </scroll-view>
</template>

<script>
export default {
  props: {
    urlobj: Object,
  },
  data() {
    return {
      videowp: [],
      hasMore: true,
    };
  },
  watch: {
    urlobj() {
      this.videowp = [];
      this.hasMore = true;
      this.getList();
    },
  },
  mounted() {
    console.log(this.urlobj);
    this.getList();
  },
  methods: {
    async getList() {
      const { res } = await this.request({
        url: this.urlobj.url,
        data: this.urlobj.params,
      });
      // console.log(res);

      if (res.videowp.length === 0) {
        this.hasMore = false;
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
        return;
      }
      this.videowp = [...this.videowp, ...res.videowp];
    },
    handleScrolltolower() {
      if (this.hasMore) {
        this.urlobj.params.skip += this.urlobj.params.limit;
        this.getList();
      } else {
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
      }
    },
    handleGoVideo(item) {
      getApp().globalData.video = item;
      uni.navigateTo({
        url: '/pages/videoPlay/index',
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.video_main {
  display: flex;
  flex-wrap: wrap;
  height: calc(100vh - 36px);
  .video_item {
    width: 33.33%;
    border-bottom: 5rpx solid #fff;
    image {
    }
  }
}
</style>
