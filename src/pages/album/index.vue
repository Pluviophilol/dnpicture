<template>
  <view>
    <!-- 专辑背景 -->
    <view class="album_bg">
      <image mode="widthFix" :src="album.cover"></image>
      <view class="album_info">
        <view class="album_name">{{ album.name }}</view>
        <view class="album_btn">关注专辑</view>
      </view>
    </view>
    <!-- 专辑作者 -->
    <view class="album_author">
      <view class="album_author_info">
        <image mode="widthFix" :src="album.user.avatar"></image>
        <view class="author_name"> {{ album.user.name }} </view>
      </view>
      <view class="album_author_desc">
        <!-- 使用text不会忽略换行符 -->
        <text> {{ album.desc }} </text>
      </view>
    </view>
    <!-- 图片列表 -->
    <view class="album_list">
      <view
        class="album_item"
        v-for="(item, index) in wallpaper"
        :key="item.id"
      >
        <go-detail :list="wallpaper" :index="index">
          <image
            mode="aspectFill"
            :src="item.thumb + item.rule.replace('$<Height>', 360)"
          ></image>
        </go-detail>
      </view>
    </view>
  </view>
</template>

<script>
import goDetail from '@/components/goDetail';

export default {
  components: { goDetail },
  data() {
    return {
      params: {
        limit: 30,
        order: 'new',
        skip: 0,
        first: 1,
      },
      id: -1,
      album: {},
      wallpaper: [],
      hasMore: true,
    };
  },
  onLoad(options) {
    this.id = options.id;
    // this.id = '5d5f8e45e7bce75ae7fb8278';
    this.getList();
  },
  // 页面触底 上拉加载下一页事件
  onReachBottom() {
    if (this.hasMore) {
      this.params.first = 0;
      this.params.skip += this.params.limit;
      this.getList();
    } else {
      uni.showToast({
        title: '没有数据了',
        icon: 'none',
      });
    }
  },
  methods: {
    async getList() {
      const { res } = await this.request({
        url: `http://157.122.54.189:9088/image/v1/wallpaper/album/${this.id}/wallpaper`,
        data: this.params,
      });
      console.log(res);
      if (Object.keys(this.album).length === 0) {
        this.album = res.album;
      }

      if (res.wallpaper.length === 0) {
        this.hasMore = false;
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
        return;
      }

      this.wallpaper = [...this.wallpaper, ...res.wallpaper];
    },
  },
};
</script>

<style lang="scss" scoped>
.album_bg {
  position: relative;
  image {
  }

  .album_info {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    height: 80rpx;
    align-items: center;
    color: #fff;
    padding: 0 15rpx;
    .album_name {
      font-size: 40rpx;
    }

    .album_btn {
      background-color: $color;
      width: 150rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10rpx;
    }
  }
}
.album_author {
  padding: 10rpx;
  .album_author_info {
    padding: 10rpx 0;
    display: flex;
    image {
      width: 50rpx;
    }

    .author_name {
      color: #000;
      margin-left: 15rpx;
    }
  }

  .album_author_desc {
  }
}
.album_list {
  display: flex;
  flex-wrap: wrap;
  .album_item {
    width: 33.33%;
    border: 3rpx solid #fff;
    image {
      height: 160rpx;
    }
  }
}
</style>
