const util = require("../../utils/util");

Page({
    data: {
    },
    onLoad() {
    },
    goBack() {
        util.navigateBack();
    },
    onShareAppMessage: function (res) {
        return {
          title: '粉我吧科技出品',
          path: '/page/intro/intro',
          imageUrl:'../../images/introShare.jpg',
          success: function(res) {
            // 转发成功
          },
          fail: function(res) {
            // 转发失败
          }
        }
  }
})
