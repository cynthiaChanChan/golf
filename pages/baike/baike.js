const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {}
    },
    onLoad() {
        new Tabbar();
        const question_list = [];
        for (let i = 0; i < 10; i += 1) {
            question_list.push({
                baike_type: "国内球场"
            })
        }
        this.setData({question_list});
    }
})
