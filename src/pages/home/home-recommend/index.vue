<template>
  <scroll-view
    @scrolltolower="handleToLower"
    class="recommend_view"
    scroll-y
    v-if="recommends.length > 0"
  >
    <!-- 推荐 -->
    <view class="recommend_wrap">
      <navigator
        class="recommend_item"
        v-for="item in recommends"
        :key="item.id"
        :url="`/pages/album/index?id=${item.target}`"
      >
        <image mode="widthFix" :src="item.thumb"></image>
      </navigator>
    </view>
    <!-- 月份 -->
    <view class="months_wrap">
      <view class="months_title">
        <view class="months_title_info">
          <view class="months_info">
            <text> {{ months.DD }} / </text>
            {{ months.MM }} 月
          </view>
          <view class="months_text">{{ months.title }}</view>
        </view>
        <view class="months_title_more">更多 ></view>
      </view>
      <view class="months_content">
        <view class="months_item" v-for="item in months.items" :key="item.id">
          <image
            mode="aspectFill"
            :src="item.thumb + item.rule.replace('$<Height>', 360)"
          ></image>
        </view>
      </view>
    </view>
    <!-- 热门 -->
    <view class="hots_wrap">
      <view class="hots_title">
        <text> 热门 </text>
      </view>
      <view class="hots_content">
        <view class="hot_item" v-for="item in hots" :key="item.id">
          <image mode="widthFix" :src="item.thumb"></image>
        </view>
      </view>
    </view>
  </scroll-view>
</template>

<script>
import moment from 'moment';

export default {
  data() {
    return {
      // 推荐列表
      recommends: [],
      months: {},
      hots: [],
      params: {
        limit: 30,
        order: 'hot',
        skip: 0,
      },
      // 是否还有下一页
      hasMore: true,
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    async getList() {
      const { res } = await this.request({
        url: 'http://157.122.54.189:9088/image/v3/homepage/vertical',
        data: this.params,
      });

      // 判断还有没有下一页数据
      if (res.vertical.length === 0) {
        this.hasMore = false;
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
        return;
      }

      if (this.recommends.length === 0) {
        this.recommends = res.homepage[1].items;
        this.months = res.homepage[2];
        this.months.MM = moment(this.months.stime).format('MM');
        this.months.DD = moment(this.months.stime).format('DD');
      }
      this.hots = [...this.hots, ...res.vertical];
    },
    handleToLower() {
      if (this.hasMore) {
        this.params.skip += this.params.limit;
        this.getList();
      } else {
        // 弹窗提示
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
.recommend_view {
  height: calc(100vh - 36px);
}
.recommend_wrap {
  display: flex;
  flex-wrap: wrap;
  .recommend_item {
    width: 50%;
    border: 3rpx solid #fff;
  }
}
.months_wrap {
  .months_title {
    display: flex;
    justify-content: space-between;
    padding: 20rpx;
    .months_title_info {
      color: $color;
      font-size: 30rpx;
      font-weight: 600;
      display: flex;
      .months_info {
        text {
          font-size: 36rpx;
        }
      }

      .months_text {
        font-size: 34rpx;
        color: #666;
        margin-left: 30rpx;
      }
    }

    .months_title_more {
      font-size: 24rpx;
      color: $color;
    }
  }

  .months_content {
    display: flex;
    flex-wrap: wrap;
    .months_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
.hots_wrap {
  .hots_title {
    padding: 20rpx;
    text {
      border-left: 20rpx solid $color;
      padding-left: 20rpx;
      font-style: 34rpx;
      font-weight: 600;
    }
  }

  .hots_content {
    display: flex;
    flex-wrap: wrap;
    .hot_item {
      width: 33.33%;
      border: 5rpx solid #fff;
    }
  }
}
</style>
