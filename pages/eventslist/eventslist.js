const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const request = require("../../dist/request/request");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {},
        year: new Date().getFullYear(),
        listArray: [{
            title: "男子职业比赛"
        },{
            title: "女子职业比赛"
        },{
            title: "业余赛事"
        }]
    },
    onLoad() {
        new Tabbar();
    },
    goList(e) {
        const listArray = this.data.listArray;
        const index = e.currentTarget.dataset.index;
        wx.navigateTo({
            url: `../list/list?typename=${listArray[index].title}`
        })
    },
    onShareAppMessage: function(res) {
        const year = this.data.year;
        return {
            title: `${year}年中国高尔夫球比赛时间表`,
            path: "/pages/eventslist/eventslist",
			imageUrl: "../../images/share.jpg",
            success: function(res) {
            },
            fail: function(res) {
            // 转发失败
            }
        }
    }
})
