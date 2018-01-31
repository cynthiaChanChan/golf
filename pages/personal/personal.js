const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require('../../dist/request/request');
const notification = require("../../utils/notification");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {},
        list: [{
            icon: 'i-note-b',
            text: '我的预约',
            page: 'myOrder',
        },{
            icon: 'i-card-b',
            text: '个人信息',
            page: 'userInfo',
        }, {
            icon: 'i-edit',
            text: '意见反馈',
            page: 'comments',
        }]
    },
    onLoad() {
        new Tabbar();
        authorize.useUserInfo({
            success: () => {
                this.setInfo();
            },
            fail: () => {
                $.alert('获取不到您的个人信息！');
            }
        })
    },
    setInfo() {
        const userid = wx.getStorageSync(util.data.userIdStorage);
        request.GetUserInfoCommon(userid).then((res) => {
            if (res.username) {
    			res.wxname = res.username
    			res.photo = res.headImgUrl
    		}
    		this.setData({ info: res })
        });
    },
    turnOnMessage(e) {
        let unionid = ""
        //const isUserFollowed = notification.isUserFollowed(unionid);
        this.setData({
            isTurnOn: e.detail.value
        })

    }
})
