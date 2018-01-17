// pages/baike/baike.js
var $ = require('../../utils/common.js')
Page({
    data: {
        img: getApp().globalData.img,
        prePage: '',
        question_list: [],
        height: '',
        isHide: []
    },
    onLoad: function (options) {
         $.loading()
        // 页面初始化 options为页面跳转所带来的参数
        this.setData({
            prePage: options.prePage
        })
        // 设置页面高度
        var _this = this;
        wx.getSystemInfo({
            success: function (res) {
                _this.setData({
                    height: res.windowHeight
                })
            }
        })
        // 请求
        this.GetBaikeTypeList(function (result) {
            // 设置隐藏状态
            $.hideLoading()
            var arr = [];
            for (var i = 0; i < result.length; i++) {
                if (result[i].id != 1342 && result[i].id != 1341) {
                    arr.push(result[i]);
                }
            }
            _this.setData({ question_list: arr, isHide: arr })
        })
    },
    goNews: function (e) {
        // 跳到下一页
        $.loading()
        var data = e.currentTarget.dataset
        this.GetBaikeTypeByParentID(data.id, (result) => {
            $.hideLoading()
            if (result.length > 0) {
                wx.navigateTo({
                    url: `/pages/supnews/supnews?title=${data.title}&id=${data.id}`
                })
            } else {
                wx.navigateTo({
                    url: `/pages/news/news?title=${data.title}&id=${data.id}&image=${data.image}`
                })
            }
        })
    },
    goBack: function () {
        wx.reLaunch({
            url: "../list/list"
        })
    },
    goList: function () {
        wx.reLaunch({
            url: "../list/list"
        })
    },
    /**
     * 接口
     */
    GetBaikeTypeList: (callback) => {
        // 百科一级分类接口
        $.get('KorjoApi/GetBaikeTypeAndImageList', { projectid: 18 }, (result) => {
            callback(result)
        })
    },
    GetBaikeTypeByParentID: (parentid, callback) => {
        // 子分类接口
        $.get('KorjoApi/GetBaikeTypeByParentID', { parentid }, callback)
    },
    GetBaikeFQAList({ id, pgnu, pgsize }, callback) {
        // 列表接口
        $.get('KorjoApi/GetBaikeFQAList', {
            baiketype: id,
            pgnu,
            pgsize
        }, callback)
    }
})