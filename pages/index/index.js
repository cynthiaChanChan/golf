const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
Page({
    data: {
        img: util.data.img
    },
    onLoad() {
        wx.navigateTo({
          url: "../cms/cms"
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
    },
    goBaike() {
        wx.navigateTo({
          url: "../baike/baike"
        })
    },
    goTeacherlogin() {
        // 如已登录过，直接到管理页，否则到登录页
        const loginData = wx.getStorageSync('golfLogin');
        if (loginData.name) {
            wx.navigateTo({
              url: "../cms/cms"
            })
            return;
        }
        wx.navigateTo({
          url: "../teacherlogin/teacherlogin"
        })
    }
})
