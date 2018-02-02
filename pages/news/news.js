// pages/news/news.js
const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const request = require("../../dist/request/request");
const WxParse = require('../../dist/wxParse/wxParse.js');
Page({
    data: {
        img: util.data.img,
        host: util.data.host,
        height: '',
        id: 0,
        news_list: [],
        pgnu: 0,
        isHide: true,
        isLoad: true
    },
    onLoad: function (options) {
        // 页面初始化 options为页面跳转所带来的参数
        var _this = this;
        this.setData({
            itemImage: options.image
        })
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    header: {
                        title: options.title
                    },
                    type: options.type,
                    height: res.windowHeight,
                    id: options.id
                })
            }
        })
        this.load()
    },
    load: function () {
        // 分页
        var _this = this
        if (_this.data.isHide && _this.data.isLoad) {
            console.log('load')
            _this.setData({
                isHide: false
            })
            var pgnu = _this.data.pgnu + 1
            request.GetBaikeFQAList(_this.data.id, pgnu, 10).then((result) => {
                var isOnlyOne = false;
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    data[i].content = util.getText(data[i].content)
                }
                var isLoad = true
                if (data.length < 10) {
                    isLoad = false
                }
                ///*如果只有一个结果的提示图片*/
                if (pgnu === 1 && data.length <= 2) {
                    isOnlyOne = true;
                }
                _this.setData({
                    isOnlyOne: isOnlyOne,
                    news_list: _this.data.news_list.concat(data),
                    pgnu: pgnu,
                    isHide: true,
                    isLoad: isLoad
                })
                var replyArr = []
                util.each(_this.data.news_list, (i, v) => {
                    replyArr.push(v.title)
                })
                for (let i = 0; i < replyArr.length; i++) {
                    WxParse.wxParse('reply' + i, 'html', replyArr[i], _this);
                    if (i === replyArr.length - 1) {
                        WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, _this)
                    }
                }
                /**
                * WxParse.wxParseTemArray(temArrayName,bindNameReg,total,that)
                * 1.temArrayName: 为你调用时的数组名称
                * 3.bindNameReg为循环的共同体 如绑定为reply1，reply2...则bindNameReg = 'reply'
                * 3.total为reply的个数
                */
                WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, _this)
            })
        }
    },
    goArticle: function (e) {
        // 跳到下一页
        var data = e.currentTarget.dataset
        wx.navigateTo({
            url: `/pages/article/article?title=${this.data.header.title}&id=${data.id}&type=${this.data.type}`
        })
    },
    goBack: function () {
        util.navigateBack()
    },
    goHome: function () {
        wx.reLaunch({
            url: '../index/index'
        })
    }
})
