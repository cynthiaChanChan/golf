const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
Page({
  data: {
  },
  onLoad() {
    wx.navigateTo({
      url: "../userInfo/userInfo"
    })
    authorize.useUserInfo({
      success: () => {
        this.init();
      },
      fail: () => {
        console.log("Fail to useUserInfo");
      }
    })
  },
  init() {
    const userId = wx.getStorageSync("golfUserInfo");
    console.log("success to useUserInfo", userId);
  },
  goIntro() {
    wx.navigateTo({
      url: "../intro/intro"
    })
  }
})
