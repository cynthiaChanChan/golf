const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
Page({
  data: {
    _tabbar_: {}
  },
  onLoad() {
    new Tabbar();
  }
})
