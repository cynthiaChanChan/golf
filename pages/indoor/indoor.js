const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
Page({
  data: {
    img: util.data.img,
    listArray: [{
      title: "文字介绍",
      icon: "i-text"
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
  }
})
