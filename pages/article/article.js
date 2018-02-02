// pages/article/article.js
const WxParse = require('../../dist/wxParse/wxParse.js');
const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const request = require("../../dist/request/request");
Page({
    data: {
        img: util.data.img,
        host: util.data.host,
        id: 0,
        title: '',
        content: ''
    },
    onLoad: function(options) {
        var _this = this;
        let imagePadding = 10;
        // 页面初始化 options为页面跳转所带来的参数
        request.GetBaikeFQAInfo(options.id).then((result) => {
            _this.pageTitle = util.getText(result.title);
            let content = "";
            // 如果是这两类图片路径不一样
            if (options.type == "球场大全" || options.type == "球星名人") {
                content = result.content.replace(/<img.*?src=.*?uploads/gi, '<img src="http://www.golfbaike.com/uploads').replace(/&#39;/gi, "'").replace(/<video.*?src="\//gi, '<video src="https://www.korjo.cn//').replace(/<source.*?<\/video>/gi, "</video>").replace(/<style>.*?<\/style>/gi, "").replace(/style=\"WIDTH: .*?px\"/gi, "");
            } else {
                content = util.url2abs(result.content)
            }
            _this.setData({
                header: {
                    title: options.title
                },
                id: options.id,
                content
            })
            var article = content;
            /**
             * WxParse.wxParse(bindName , type, data, target,imagePadding)
             * 1.bindName绑定的数据名(必填)
             * 2.type可以为html或者md(必填)
             * 3.data为传入的具体数据(必填)
             * 4.target为Page对象,一般为this(必填)
             * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
             */

             //0.2是因为css的padding设置了5%
             let imagePadding = wx.getSystemInfoSync().windowWidth * 0.05;
             console.log("imagePadding ", imagePadding)
            WxParse.wxParse('article', 'html', article, _this, imagePadding);
            WxParse.wxParse('title1', 'html', result.title, _this, imagePadding);
        })

    },
    onShareAppMessage: function(res) {
        const that = this;
        return {
           title: that.pageTitle,
           path: "/pages/article/article?id=" + that.data.id + "&title=" + that.data.header.title,
           success: function(res) {
           },
           fail: function(res) {
            // 转发失败
           }
        }
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
