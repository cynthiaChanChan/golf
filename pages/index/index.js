const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
Page({
    data: {
        img: util.data.img
    },
    onLoad() {
    },
    goIntro() {
        wx.navigateTo({
          url: "../faq/faq"
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
