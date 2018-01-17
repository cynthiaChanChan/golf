// pages/article/article.js
var $ = require('../../utils/common.js')
var WxParse = require('../../wxParse/wxParse.js');
Page({
    data: {
        img: getApp().globalData.img,
        id: 0,
        title: '',
        content: ''
    },
    onLoad: function(options) {
        // 页面初始化 options为页面跳转所带来的参数
        var _this = this;
        _this.GetBaikeFQAInfo(options.id, function(result) {
            _this.pageTitle = $.getText(result.title);
            _this.setData({
                title: options.title,
                id: options.id,
                content: $.url2abs(result.content)
            })
            var article = $.url2abs(result.content);
            /**
             * WxParse.wxParse(bindName , type, data, target,imagePadding)
             * 1.bindName绑定的数据名(必填)
             * 2.type可以为html或者md(必填)
             * 3.data为传入的具体数据(必填)
             * 4.target为Page对象,一般为this(必填)
             * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
             */
            WxParse.wxParse('article', 'html', article, _this, 5);
            WxParse.wxParse('title1', 'html', result.title, _this, 5);
        })

    },
    onShareAppMessage: function(res) {
        const that = this;
        return {
           title: that.pageTitle,
           path: "/pages/result/result?id=" + that.id + "&share=y",
           success: function(res) {
           },
           fail: function(res) {
            // 转发失败
           }
        }
    },
    goBack: function() {
        getApp().goBack()
    },
    goSearch: function() {
        getApp().goHome()
    },
    /**
     * 接口
     */
    GetBaikeFQAInfo: function(id, callback) {
        // 文章接口
        $.get('KorjoApi/GetBaikeFQAInfo', {
            id: id
        }, function(result) {
            callback(result)
        })
    }
})