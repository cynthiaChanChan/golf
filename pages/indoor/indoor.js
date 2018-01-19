const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
Page({
    data: {
        img: util.data.img,
        listActiveIdx: 0,
        listArray: [{
            title: "文字介绍",
            icon: "i-text",
            active: "active"
        },{
            title: "图片介绍",
            icon: "i-pic"
        },{
            title: "视频介绍",
            icon: "i-video"
        }],
        _tabbar_: {}
    },
    onLoad() {
        new Tabbar();
    },
    checkList(e) {
        const index = e.currentTarget.dataset.index;
        const listArray = this.data.listArray;
    	let listActiveIdx = this.data.listActiveIdx;
        this.setData(util.checkList(index, listArray, listActiveIdx));
    }
})
