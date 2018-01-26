const util = require('../../utils/util.js');
const listUrl = "https://www.korjo.cn/KorjoApi/GetAssembleList";
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require("../../dist/request/request");
Page({
    data: {
        isLightboxHidden: true,
        isHintHidden: true,
        time: "",
        listArray: [],
        img: util.data.img,
        _tabbar_: {}
    },
    onLoad: function(options) {
        const that = this;
        new Tabbar();
        //默认日期
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        this.month = month;
        this.year = year;
        this.typename = options.typename;
        this.setData({
            time: year + "年" + (month < 10 ? "0" + month : month) + "月"
        })
        this.getData(month, year);
        authorize.useUserInfo({
          success: () => {
              that.requestLateLyMatchData();
          },
          fail: () => {
              console.log("Fail to useUserInfo");
          }
        })
    },
    requestLateLyMatchData: function() {
        const that = this;
        const allDataArray = [];
        request.GetLatelyMatchByTypeName(that.typename).then((res)=> {
            if (res.length == 0) {
                return;
            }
            for (let value of res) {
                const date = util.formatDate(value.match_date);
                const obj = {
                    day: date.getDate(),
                    data: [{
                        stage: value.stage,
                        time: `${date.getMonth() + 1}月${date.getDate()}`,
                        name: value.name,
                        address: value.address,
                        number: value.number
                    }]
                }
                // 同一天数据放在一起
                const matchedObj = allDataArray.find(function(oneDataObj) {
                    return oneDataObj.day == obj.day
                })
                if (matchedObj) {
                    matchedObj.data.push(obj.data[0]);
                } else {
                    allDataArray.push(obj);
                }
            }
            console.log("allDataArray: ", allDataArray);
            that.markDays(that.chooseTheLatest(allDataArray));
        })
    },
    chooseTheLatest: function(allDataArray) {
        //默认显示最近一天比赛
        const daysArray = [];
        for (let one of allDataArray) {
            daysArray.push(one.day);
        }
        daysArray.sort((a, b) => {
            return a -b;
        })
        for (let item of allDataArray) {
            if (item.day == daysArray[0]) {
                item.chosen = "chosen";
            }
        }
        return allDataArray;
    },
    markDays: function(allDataArray) {
        const that = this;
        const allDays = that.data.allDays;
        let matchData = "";
        //标记上有赛事的天
        for (let i of allDataArray){
            for (let ii of allDays) {
                if (i.day == ii.id) {
                    ii.marked = "marked";
                    ii.data = i.data;
                    ii.chosen = i.chosen;
                }
                if (ii.chosen) {
                    matchData = ii.data;
                }
            }
        }

        that.setData({allDays, matchData})
    },
    goResult: function(e) {
        wx.redirectTo({
            url: "../result/result?id=" + e.currentTarget.dataset.id
        })
    },
    goTimeline: function(e) {
        wx.redirectTo({
            url: "../timeline/timeline"
        })
    },
    goList: function(e) {
        const that = this;
        const allDays = this.data.allDays;
        const dataset = e.currentTarget.dataset;
        const listArray = [];
        let isHintHidden = false;
        if (!allDays[dataset.index].id) {
            return;
        }
        for (let one of allDays) {
            if (one.chosen) {
                one.chosen = "";
            }
        }
        allDays[dataset.index].chosen = "chosen";
        this.setData({
            isHintHidden: isHintHidden,
            allDays: allDays,
            matchData: allDays[dataset.index].data
        })
    },
    getData: function(mm, yyyy){
        const that = this;
        var allDays = [];
        var daysOfMonth = util.checkDaysOfMonth(mm, yyyy);
        const yearMonth = yyyy + "-" + (mm > 9 ? mm: "0" + mm);
        for (var i = 0; i < daysOfMonth; i +=1) {
            allDays[i] = {
               id: i + 1,
               data: []
            }
        }
        //highlight today
        if (yyyy === new Date().getFullYear() && mm === new Date().getMonth() + 1) {
            allDays[new Date().getDate() - 1].theDay = "theDay";
            that.today = new Date().getDate();
        }
        const weekDay = new Date(yyyy, mm - 1, 1).getDay();
        for (var v = 0; v < weekDay; v += 1) {
            allDays.unshift({});
        }
        var totalSpots = daysOfMonth + weekDay;
        allDays = that.getMoreSpots(totalSpots, allDays);
        this.setData({
           allDays: allDays
        })
    },
    getMoreSpots: function(totalSpots, allDays) {
        if (totalSpots > 28 && totalSpots <= 35) {
            var moreContainerNum = 35 - totalSpots;
            for (var ii = 0; ii < moreContainerNum; ii += 1) {
              allDays.push({});
            }
        } else if (totalSpots > 35) {
            var moreContainerNum = 42 - totalSpots;
            for (var ii = 0; ii < moreContainerNum; ii += 1) {
              allDays.push({});
            }
        }
        return allDays;
    },
    chooseDate: function(e) {
        var dir = e.currentTarget.dataset.dir;
        var isLeftHidden = false;
        var isRightHidden = false;
        //往左减少日期，vice versa
        if (dir == "left") {
          if (this.month === 1) {
            this.month = 12;
            this.year -= 1;
          } else {
            this.month -= 1;
          }
        } else {
          if (this.month === 12) {
            this.month = 1;
            this.year += 1;
          } else {
            this.month += 1;
          }
        }
        //日历限制为2017年--2018年
        if (this.year === 2017 && this.month === 1) {
          isLeftHidden = true;
        }
        if (this.year === 2018 && this.month === 12) {
          isRightHidden = true;
        }
        this.getData(this.month, this.year);
        this.setData({
          listArray: [],
          isHintHidden: true,
          isLeftHidden: isLeftHidden,
          isRightHidden: isRightHidden,
          time: this.year + "年" + (this.month < 10 ? "0" + this.month : this.month) + "月"
        })
        if (this.allDataArray.length > 0) {
            this.markDays(this.allDataArray);
        }
    },
    hideLightbox: function(e) {
        this.setData({
            isLightboxHidden: true
        })
    }
})
