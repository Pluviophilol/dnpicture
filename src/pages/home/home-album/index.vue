<template>
  <scroll-view
    class="album_scroll_view"
    scroll-y
    @scrolltolower="handleToLower"
  >
    <!-- 轮播图 -->
    <view class="ablum_swiper">
      <swiper autoplay indicator-dots circular>
        <swiper-item v-for="item in banner" :key="item.id">
          <image :src="item.thumb"></image>
        </swiper-item>
      </swiper>
    </view>
    <!-- 列表 -->
    <view class="album_list">
      <navigator
        class="album_item"
        v-for="item in album"
        :key="item.id"
        :url="`/pages/album/index?id=${item.id}`"
      >
        <view class="album_img">
          <image mode="aspectFill" :src="item.cover"></image>
        </view>
        <view class="album_info">
          <view class="album_name"> {{ item.name }} </view>
          <view class="album_desc"> {{ item.desc }} </view>
          <view class="album_btn">
            <view class="album_attention">关注</view>
          </view>
        </view>
      </navigator>
    </view>
  </scroll-view>
</template>

<script>
export default {
  data() {
    return {
      params: {
        limit: 30,
        order: 'new',
        skip: '0',
      },
      banner: [],
      album: [],
      hasMore: true,
    };
  },
  mounted() {
    uni.setNavigationBarTitle({ title: '专辑' });
    this.getList();
  },
  methods: {
    async getList() {
      const { res } = await this.request({
        url: 'http://157.122.54.189:9088/image/v1/wallpaper/album',
        data: this.params,
      });
      // console.log(res);
      if (this.banner.length === 0) {
        this.banner = res.banner;
      }
      if (res.album.length === 0) {
        this.hasMore = false;
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
        return;
      }
      this.album = [...this.album, ...res.album];
    },
    handleToLower() {
      if (this.hasMore) {
        this.params.skip += this.params.limit;
        this.getList();
      } else {
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.album_scroll_view {
  height: calc(100vh - 36px);
}
.ablum_swiper {
  swiper {
    // 宽固定750rpx，高度按图片比例调整 640/284≈2.3
    height: calc(750rpx / 2.3);
    image {
      height: 100%;
    }
  }
}
.album_list {
  padding: 10rpx;
  .album_item {
    padding: 10rpx 0;
    display: flex;
    border-bottom: 1rpx solid #ccc;
    .album_img {
      flex: 1;
      padding: 10rpx;
      image {
        height: 200rpx;
        width: 200rpx;
      }
    }

    .album_info {
      flex: 2;
      padding: 0 10rpx;
      overflow: hidden;
      .album_name {
        font-size: 30rpx;
        color: #000;
        padding: 10rpx 0;
      }

      .album_desc {
        padding: 10rpx 0;
        font-size: 24rpx;

        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .album_btn {
        padding: 10rpx;
        display: flex;
        justify-content: flex-end;
        .album_attention {
          color: $color;
          border: 1rpx solid $color;
          padding: 10rpx;
        }
      }
    }
  }
}
</style>
