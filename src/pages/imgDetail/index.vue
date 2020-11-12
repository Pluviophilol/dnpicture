<template>
  <view>
    <!-- 用户信息 -->
    <view class="user_info">
      <view class="user_icon">
        <image :src="imgDetail.user.avatar" mode="widthFix"></image>
      </view>
      <view class="user_desc">
        <view class="user_name">{{ imgDetail.user.name }}</view>
        <view class="user_time">{{ imgDetail.cnTime }}</view>
      </view>
    </view>
    <!-- 图片 -->
    <view class="high_img">
      <swiper-action @swiperAction="handleSwiperAction">
        <image :src="imgDetail.thumb" mode="widthFix"></image>
      </swiper-action>
    </view>
    <!-- 点赞 -->
    <view class="user_rank">
      <view class="rank">
        <text class="iconfont icondianzan"> {{ imgDetail.rank }} </text>
      </view>
      <view class="user_collect">
        <text class="iconfont iconshoucang">收藏</text>
      </view>
    </view>
    <!-- 专辑 -->
    <view class="album_wrap" v-if="album.length">
      <view class="album_title">相关</view>
      <view class="album_list">
        <view class="album_item" v-for="item in album" :key="item.id">
          <view class="album_cover">
            <image :src="item.cover" mode="aspectFill"></image>
          </view>
          <view class="album_info">
            <view class="album_info_text">专辑</view>
            <view class="album_name"> {{ item.name }} </view>
            <text class="iconfont iconiconfontjiantou4"></text>
          </view>
        </view>
      </view>
    </view>
    <!-- 热评 -->
    <view class="comment hot" v-if="hot.length">
      <view class="comment_title">
        <text class="iconfont iconhot1"></text>
        <text class="comment_text">最热评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in hot" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 头像 -->
            <view class="user_icon">
              <image :src="item.user.avatar" mode="widthFix"></image>
            </view>
            <!-- 名称 -->
            <view class="user_name">
              <view class="user_nickname"> {{ item.user.name }} </view>
              <view class="user_time"> {{ item.cnTime }} </view>
            </view>
            <!-- 徽章 -->
            <view class="user_badge">
              <image
                v-for="item2 in item.user.title"
                :key="item2.icon"
                :src="item2.icon"
              ></image>
            </view>
          </view>
          <!-- 评论数据 -->
          <view class="comment_desc">
            <view class="comment_content"> {{ item.content }} </view>
            <view class="comment_like">
              <text class="iconfont icondianzan"> {{ item.size }} </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 新评 -->
    <view class="comment new" v-if="comment.length">
      <view class="comment_title">
        <text class="iconfont iconpinglun"></text>
        <text class="comment_text">最新评论</text>
      </view>
      <view class="comment_list">
        <view class="comment_item" v-for="item in comment" :key="item.id">
          <!-- 用户信息 -->
          <view class="comment_user">
            <!-- 头像 -->
            <view class="user_icon">
              <image :src="item.user.avatar" mode="widthFix"></image>
            </view>
            <!-- 名称 -->
            <view class="user_name">
              <view class="user_nickname"> {{ item.user.name }} </view>
              <view class="user_time"> {{ item.cnTime }} </view>
            </view>
            <!-- 徽章 -->
            <view class="user_badge">
              <image
                v-for="item2 in item.user.title"
                :key="item2.icon"
                :src="item2.icon"
              ></image>
            </view>
          </view>
          <!-- 评论数据 -->
          <view class="comment_desc">
            <view class="comment_content"> {{ item.content }} </view>
            <view class="comment_like">
              <text class="iconfont icondianzan"> {{ item.size }} </text>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 下载 -->
    <view class="download">
      <view class="download_btn" @click="handleDownload">下载图片</view>
    </view>
  </view>
</template>

<script>
import moment from 'moment';
import swiperAction from '@/components/swiperAction';
moment.locale('zh-cn');

export default {
  components: {
    swiperAction,
  },
  data() {
    return {
      imgDetail: {},
      album: [],
      hot: [],
      comment: [],
      imgIndex: 0,
    };
  },
  onLoad() {
    const { imgIndex } = getApp().globalData;

    this.imgIndex = imgIndex;
    this.getData();
  },
  methods: {
    // 给页面赋值
    getData() {
      const { imgList } = getApp().globalData;
      this.imgDetail = imgList[this.imgIndex];

      this.imgDetail.cnTime = moment(this.imgDetail.atime * 1000).fromNow();
      this.getComments(this.imgDetail.id);
    },
    async getComments(id) {
      const { res } = await this.request({
        url: `http://157.122.54.189:9088/image/v2/wallpaper/wallpaper/${id}/comment`,
      });
      console.log(res);
      this.album = res.album;

      res.hot.forEach((v) => (v.cnTime = moment(v.atime * 1000).fromNow()));
      res.comment.forEach((v) => (v.cnTime = moment(v.atime * 1000).fromNow()));

      this.hot = res.hot;
      this.comment = res.comment;
    },
    // 滑动事件
    handleSwiperAction(e) {
      /**
       * 1. 左滑 imgIndex++
       * 2. 右划 imgIndex--
       */
      const { imgList } = getApp().globalData;
      if (e.direction === 'left' && this.imgIndex < imgList.length - 1) {
        this.imgIndex++;
        this.getData();
      } else if (e.direction === 'right' && this.imgIndex > 0) {
        this.imgIndex--;
        this.getData();
      } else {
        uni.showToast({
          title: '没有数据了',
          icon: 'none',
        });
      }
    },
    // 下载图片
    async handleDownload() {
      uni.showLoading({ title: '下载中' });

      // 1. 远程文件下载到小程序内存中 tempFilePath
      const res1 = await uni.downloadFile({ url: this.imgDetail.img });
      const { tempFilePath } = res1[1];

      // 2. 将图片从内存中下载到本地
      const res2 = await uni.saveImageToPhotosAlbum({ filePath: tempFilePath });

      uni.hideLoading();
      await uni.showToast({ title: '下载成功' });
    },
  },
};
</script>

<style lang="scss" scoped>
.user_info {
  display: flex;
  padding: 20rpx;
  .user_icon {
    padding: 0 20rpx;
    image {
      width: 88rpx;
      border-radius: 50%;
    }
  }

  .user_desc {
    .user_name {
      color: #000;
      font-weight: 600;
    }

    .user_time {
      color: #ccc;
      font-size: 24rpx;
      padding: 10rpx 0;
    }
  }
}
.user_rank {
  display: flex;
  height: 80rpx;
  justify-content: space-around;
  border-bottom: 5rpx solid #eee;
  .rank {
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
    }
  }

  .user_collect {
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
    }
  }
}
.high_img {
  image {
    border-bottom: 1rpx solid #eee;
  }
}
.album_wrap {
  padding: 20rpx;
  .album_title {
    padding: 10rpx 0;
  }

  .album_list {
    .album_item {
      display: flex;
      padding: 10rpx 0;
      border-bottom: 10rpx solid #eee;
      .album_cover {
        flex: 1;
        image {
          width: 180rpx;
          height: 180rpx;
        }
      }

      .album_info {
        flex: 3;
        padding-left: 20rpx;
        position: relative;
        .album_info_text {
          width: 100rpx;
          height: 50rpx;
          background-color: $color;
          color: #fff;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .album_name {
          padding: 10rpx 0;
          color: #888;
        }

        .iconfont {
          font-size: 40rpx;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 10%;
          color: #000;
        }
      }
    }
  }
}
.comment {
  .comment_title {
    padding: 15rpx;
    .iconfont {
      color: red;
      font-size: 40rpx;
    }

    .comment_text {
      font-weight: 600;
      font-size: 28rpx;
      color: #666;
      margin-left: 10rpx;
    }
  }

  .comment_list {
    .comment_item {
      border-bottom: 15rpx solid #eee;
      .comment_user {
        display: flex;
        padding: 20rpx 0;
        .user_icon {
          width: 15%;
          display: flex;
          justify-content: center;
          align-items: center;
          image {
            width: 90%;
          }
        }

        .user_name {
          flex: 1;
          .user_nickname {
            color: #777;
          }

          .user_time {
            color: #ccc;
            font-size: 24rpx;
            padding: 5rpx;
          }
        }

        .user_badge {
          image {
            display: inline-block;
            margin-right: 10rpx;
            width: 40rpx;
            height: 40rpx;
          }
        }
      }

      .comment_desc {
        display: flex;
        padding: 30rpx 0;
        .comment_content {
          flex: 1;
          padding-left: 15%;
          color: #000;
        }

        .comment_like {
          text-align: right;
          .iconfont {
          }
        }
      }
    }
  }
}

// 最新评论
.new {
  .iconpinglun {
    color: aqua !important;
  }
}

// 下载
.download {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  .download_btn {
    width: 90%;
    height: 80%;
    background-color: $color;
    color: #fff;
    font-size: 50rpx;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
