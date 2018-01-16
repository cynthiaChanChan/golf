//index.js
//获取应用实例
const app = getApp();
const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
Page({
  data: {
  },
  onLoad() {
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
  }
})
