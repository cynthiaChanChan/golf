// pages/news/news.js
var $ = require('../../utils/common.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        img: getApp().globalData.img,
        img1: 'https://www.korjo.cn/',
        title: '',
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
                    title: options.title,
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
            _this.GetBaikeFQAList(pgnu, function (result) {
                var isOnlyOne = false;
                var data = result.data
                for (var i = 0; i < data.length; i++) {
                    data[i].content = $.getText(data[i].content)
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
                $.each(_this.data.news_list, (i, v) => {
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
            url: `/pages/article/article?title=${this.data.title}&id=${data.id}`
        })
    },
    goBack: function () {
        getApp().goBack()
    },
    goSearch: function () {
        getApp().goHome()
    },
    /**
     * 接口
     */
    GetBaikeFQAList: function (pgnu, callback) {
        // 列表接口
        $.get('KorjoApi/GetBaikeFQAList', {
            baiketype: this.data.id,
            pgnu: pgnu,
            pgsize: 10
        }, function (result) {
            callback(result)
        })
    }
})