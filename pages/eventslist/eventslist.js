const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {}
    },
    onLoad() {
        new Tabbar();
    }
})
