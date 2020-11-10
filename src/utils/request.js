export default (params) => {
  uni.showLoading({
    title: '加载中',
  });

  return new Promise((reslove, reject) => {
    wx.request({
      ...params,
      success(res) {
        reslove(res.data);
      },
      fail(err) {
        reject(err);
      },
      complete() {
        uni.hideLoading();
      },
    });
  });
};
