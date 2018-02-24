const util = require('../../utils/util.js');
const listUrl = "https://www.korjo.cn/KorjoApi/GetAssembleList";
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require("../../dist/request/request");
const calendar = require('../../calendar/calendar');
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
        this.typename = options.typename;
        new Tabbar();
        // 获取最近月份的比赛
        this.requestLateLyMatchData();

    },
    createDays: function(year, month, callback) {
        this.month = month;
        this.year = year;
        let dirs = {
            isLeftHidden: false,
            isRightHidden: false
        }
        //赛事日历限制为当年--
        dirs = calendar.restrictDate(this.year, this.month, dirs);
        this.setData({
            isLeftHidden: dirs.isLeftHidden,
            isRightHidden: dirs.isRightHidden,
            time: year + "年" + month + "月",
            typename: this.typename
        })
        this.getData(month, year, callback);
    },
    requestLateLyMatchData: function() {
        const that = this;
        request.GetLatelyMatchByTypeName(that.typename).then((res)=> {
            that.getResponse(res);
        })
    },
    GetGolfMatchByDate: function(match_date) {
        const that = this;
        request.GetGolfMatchByDate(match_date, that.typename).then((res)=> {
            that.getResponse(res);
        })
    },
    getResponse: function(res) {
        if (res.length == 0) {
            this.isMatchAvailable = false;
            this.setData({
                matchData: [],
                isWholeMonthNone: true
            })
            this.createDays(this.year, this.month);
            return;
        } else if (res.length > 0) {
            this.isMatchAvailable = true;
            const currentYearMonth = util.formatDate(res[0].match_date);
            console.log("currentYearMonth: ", currentYearMonth);
            var year = currentYearMonth.getFullYear();
            var month = currentYearMonth.getMonth() + 1;
            this.createDays(year, month, () => {
                this.populateData(res, year, month);
            });
        }
    },
    populateData: function(res, year, month) {
        const allDataArray = [];
        for (let value of res) {
            const date = util.formatDate(value.match_date);
            const obj = {
                day: date.getDate(),
                data: [{
                    stage: value.stage,
                    time: `${date.getMonth() + 1}月${date.getDate()}日`,
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
        //显示离当前最近的比赛日期，再根据选中当月标记赛事
        this.markDays(calendar.chooseTheLatest(this.year, this.month, allDataArray));
    },
    markDays: function(allDataArray) {
        const allDays = this.data.allDays;
        let matchData = calendar.Markthem(allDays, allDataArray);
        this.setData({allDays, matchData})
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
        //该月是否有赛事
        const isMatchAvailable = this.isMatchAvailable;
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
            isHintHidden,
            allDays,
            isMatchAvailable,
            matchData: allDays[dataset.index].data
        })
    },
    getData: function(mm, yyyy, callback){
        const that = this;
        var allDays = [];
        var daysOfMonth = util.checkDaysOfMonth(mm, yyyy);
        const yearMonth = yyyy + "-" + (mm > 9 ? mm: "0" + mm);
        calendar.GetRestDays(mm, yyyy).then((offDays) => {
            for (var i = 0; i < daysOfMonth; i +=1) {
                allDays[i] = {
                   id: i + 1,
                   data: []
                }
                for (let day of offDays) {
                    if (i + 1 == day) {
                        allDays[i].off = true;
                    }
                }
            }
            const weekDay = new Date(yyyy, mm - 1, 1).getDay();
            for (var v = 0; v < weekDay; v += 1) {
                allDays.unshift({});
            }
            var totalSpots = daysOfMonth + weekDay;
            allDays = calendar.getMoreSpots(totalSpots, allDays);
            this.setData({allDays});
            callback && callback();
        });
    },
    chooseDate: function(e) {
        var dir = e.currentTarget.dataset.dir;
        let dirs = {
            isLeftHidden: false,
            isRightHidden: false
        }
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
        //赛事日历限制为当年（2018）--
        dirs = calendar.restrictDate(this.year, this.month, dirs);
        this.GetGolfMatchByDate(this.year + "-" + util.formatNumber(this.month));
        this.setData({
          listArray: [],
          isHintHidden: true,
          isLeftHidden: dirs.isLeftHidden,
          isRightHidden: dirs.isRightHidden
        })
    },
    hideLightbox: function(e) {
        this.setData({
            isLightboxHidden: true
        })
    }
})
