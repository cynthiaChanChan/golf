const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const request = require('../../dist/request/request');
const WxParse = require('../../dist/wxParse/wxParse.js');
Page({
    data: {
        img: util.data.img,
        introImg: [],
        textContainer: false,
        introImgUnclicked: true,
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
        this.fetchGolfIntroData();
    },
    fetchGolfIntroData() {
        const that = this;
        const introImg = [];
        let video = ""
        request.GetGolfIntroList().then((res) => {
            const golfIntroData = res[0]
            if (golfIntroData.imagejson) {
                const imagesArray = JSON.parse(golfIntroData.imagejson);
                for (let imageObj of imagesArray) {
                    introImg.push(util.addHost(imageObj.silderImg));
                }
            }
            if (golfIntroData.videojson) {
                const videosArray = golfIntroData.videojson.split(",");
                video = util.addHost(videosArray[0]);
            }
            const article = util.url2abs(golfIntroData.content);
            WxParse.wxParse('article', 'html', article, that, 5);
            that.setData({introImg, video});
        });
    },
    checkList(e) {
        const index = e.currentTarget.dataset.index;
        const listArray = this.data.listArray;
    	let listActiveIdx = this.data.listActiveIdx;
        const dataObj = util.checkList(index, listArray, listActiveIdx);
        dataObj.textContainer = index != 0 ? true : false;
        dataObj.introImgUnclicked = !dataObj.textContainer;
        this.videoContext = wx.createVideoContext('myVideo');
        if (index == 2) {
            //播放视频
            this.videoContext.play();
        } else {
            //关掉视频
            this.videoContext.pause();
        }
        this.setData(dataObj);
    },
    onShareAppMessage: function(res) {
        return {
            title: "室内高尔夫介绍",
            path: "/pages/indoor/indoor",
			imageUrl: "../../images/share.jpg",
            success: function(res) {
            },
            fail: function(res) {
            // 转发失败
            }
        }
    }
})
