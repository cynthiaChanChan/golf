const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
Page({
    data: {
        img: util.data.img
    },
    onLoad() {
        // wx.navigateTo({
        //   url: "../list/list?typename=男子职业比赛"
        // })
        wx.navigateTo({
          url: "../booking/booking"
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
    goBooking() {
        wx.navigateTo({
          url: "../booking/booking"
        })
    },
    goIndoor() {
        wx.navigateTo({
          url: "../indoor/indoor"
        })
    },
    goEventslist() {
        wx.navigateTo({
          url: "../eventslist/eventslist"
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
