const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const request = require("../../dist/request/request");
Page({
    data: {
        img: util.data.img,
        host: util.data.host,
        _tabbar_: {}
    },
    onLoad() {
        new Tabbar();
        this.getTypeList();
    },
    getTypeList() {
        request.GetBaikeTypeList(29).then((res) => {
            const question_list = res;
            this.setData({question_list});
        })
    },
    goNews: function (e) {
        // 跳到下一页
        var data = e.currentTarget.dataset;
        request.GetBaikeTypeByParentID(data.id).then((result) => {
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
})
