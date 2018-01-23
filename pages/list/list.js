const util = require('../../utils/util.js');
const app = getApp();
const listUrl = "https://www.korjo.cn/KorjoApi/GetAssembleList";
const {Tabbar} = require("../../dist/tabbar/index");
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
        new Tabbar();
        //默认日期
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        this.month = month;
        this.year = year;
        this.setData({
            time: year + "年" + (month < 10 ? "0" + month : month) + "月"
        })
        this.getData(month, year);
        app.getUser(this.requestGatherData);
    },
    requestGatherData: function() {
        const that = this;
        app.loading();
        util.getRequest(listUrl, {userid: wx.getStorageSync('gatheringUser')}, function(response) {
            wx.hideToast();
            const resultList = response.data;
            const listArray = [];
            const allDataArray = [];
            if (resultList.length > 0) {
                for (let list of resultList) {
                    const gatheringData = JSON.parse(list.assemblejson);
                    const obj = {
                        day: gatheringData.day,
                        id: list.id,
                        time: gatheringData.time,
                        title: gatheringData.title
                    }
                    //按照月份保存数据,月份相同放一起
                    if (allDataArray.length > 0) {
                        const matchedObj = allDataArray.find(function(oneDataObj) {
                            return oneDataObj.yearMonth == gatheringData.yearMonth
                        })
                        if (matchedObj) {
                            matchedObj.infoArray.push(obj)
                        } else {
                            allDataArray.push({
                                yearMonth: gatheringData.yearMonth,
                                infoArray: [obj]
                            })
                        }
                    } else {
                        allDataArray.push({
                            yearMonth: gatheringData.yearMonth,
                            infoArray: [obj]
                        })
                    }
                }
            }
            that.allDataArray = allDataArray;
            if (allDataArray.length > 0) {
                that.markDays(allDataArray);
            }
            //今日是否有集合点
            that.getTodayData();
        })
    },
    markDays: function(array) {
        const that = this;
        const allDays = that.data.allDays;
        //标记上有集合点的天
        const thisYearMonthData = array.find(that.findYearMonth);
        if (thisYearMonthData) {
            for (let i of thisYearMonthData.infoArray){
                for (let ii of allDays) {
                    if (i.day == ii.id) {
                        ii.marked = true;
                    }
                }
            }
            that.setData({
                allDays: allDays
            })
        }
    },
    findYearMonth: function(gather) {
        return gather.yearMonth == this.data.time;
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
    getTodayData: function() {
        const listArray = [];
        let isHintHidden = false;
        const that = this;
        const matchedYearMonth = this.allDataArray.find(function(oneDataObj) {
            return oneDataObj.yearMonth == that.data.time;
        });
        if (matchedYearMonth) {
            for (let ii of matchedYearMonth.infoArray) {
                if (ii.day == that.today) {
                    listArray.push(ii);
                }
            }
        }
        if (listArray.length > 0) {
            isHintHidden = true;
        }
        this.setData({
            isHintHidden: isHintHidden,
            listArray: listArray
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
            if (one.choosen) {
                one.choosen = "";
            }
        }
        allDays[dataset.index].choosen = "choosen";
        const matchedYearMonth = this.allDataArray.find(function(oneDataObj) {
            return oneDataObj.yearMonth == that.data.time;
        });
        if (matchedYearMonth) {
            for (let ii of matchedYearMonth.infoArray) {
                if (ii.day == allDays[dataset.index].id) {
                    listArray.push(ii);
                }
            }
        }
        if (listArray.length > 0) {
            isHintHidden = true;
        }
        this.setData({
            isHintHidden: isHintHidden,
            allDays: allDays,
            listArray: listArray
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
               gatherings: []
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
