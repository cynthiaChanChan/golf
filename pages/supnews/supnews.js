const $ = require('../../utils/common.js')
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
    onLoad(options) {
        // 页面初始化 options为页面跳转所带来的参数
        const _this = this
        wx.getSystemInfo({
            success(res) {
                $.extend(_this.data, options)
                _this.data.height = res.windowHeight
                _this.load()
            }
        })
    },
    load() {
        const _this = this
        this.GetBaikeTypeByParentID(this.data.id, (result) => {
            var isOnlyOne = false;
            if (result.length <= 2) {
               isOnlyOne = true;
            }
            _this.setData({
                isOnlyOne: isOnlyOne,
                title: this.data.title,
                news_list: result
            })
        })
    },
    goNext(e) {
        // 跳到下一页
        const data = e.currentTarget.dataset;
        //如果分类下面只有一个问题，则直接去答案，isone是问题id
        const isChildOne = this.data.news_list[data.idx].isone;
        let url = "";
        if (isChildOne && isChildOne != 0) {
            url = `/pages/article/article?title=${data.title}&id=${isChildOne}`;
        } else {
            url = `/pages/news/news?title=${data.title}&id=${data.id}&image=${data.image}`;
        }
        wx.navigateTo({
            url: url
        })
    },
    goBack() {
        getApp().goBack()
    },
    goSearch() {
        getApp().goHome()
    },
    /**
     * 接口
     */
    GetBaikeTypeByParentID(id, callback) {
        // 子分类接口
        $.get('KorjoApi/GetBaikeTypeByParentID', {
            parentid: id
        }, callback)
    },
    GetBaikeFQAList(pgnu, callback) {
        // 列表接口
        $.get('KorjoApi/GetBaikeFQAList', {
            baiketype: this.data.id,
            pgnu: pgnu,
            pgsize: 10
        }, (result) => {
            callback(result)
        })
    }
})