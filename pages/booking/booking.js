const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {}
    },
    onLoad() {
        new Tabbar();
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth() + 1;
        const day = today.getDate();
        let weekList = util.data.weekList;
        //确认每月天数DaysOfMonth
        this.DaysOfMonth = util.checkDaysOfMonth(month, year);
        console.log(`${year}年${month}月$共{this.DaysOfMonth}天`);
        //确认年月周：2018年1月 第一周
        const weekday = today.getDay();
        const weekNum = '';
        let WholeMonth = this.setWholeMonth(year, month);
        console.log(WholeMonth);
        let weekObj = "";
        for (let vv of WholeMonth) {
            for (let one of vv.weekdays) {
                if (one.num == day) {
                    return weekObj = vv;
                }
            }
        }
        this.setThisWeek(weekObj,day);
        // //标记今天
        // if (weekday == 0) {
        //     weekList[6].mark = "today";
        //     weekList[6].title = '今天';
        // } else {
        //     weekList[weekday - 1].mark = "today";
        //     weekList[weekday - 1].title = '今天';
        // }
        // for (let v of weekList) {
        //     if (v.mark) {
        //         v.num = day;
        //     }
        // }
        let date = `${year}年${month}月 第${weekNum}周`;
        this.setData({
            date,
            weekList,
            coursesList: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}]
        })
    },
    setWholeMonth: function(year, month) {
        const chineseWeekday = ["一","二","三","四","五","六", "日"];
        //每月周数weeks
        const weeks = util.weeksCount(year, month);
        console.log("weeks: ", weeks);
        const firstOfMonth = new Date(year, month - 1, 1);
        let firstWeekday = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
        console.log('first week is from: ', firstWeekday);
        let WholeMonth = [];
        for (let i = 0; i < weeks; i += 1) {
            let weekdays = [];
            for (let ii = 0; ii < 7; ii += 1) {
                weekdays.push({
                    num: ""
                })
            }
            WholeMonth.push({
                weekNum: chineseWeekday[i],
                weekdays
            })
        }
        for (let iii = 0; iii < this.DaysOfMonth; iii += 1) {
            //第一周占据几天
            let firstWeekAllDays = 7 - firstWeekday + 1;
            if (iii < firstWeekAllDays) {
                WholeMonth[0].weekdays[firstWeekday + iii - 1].num = iii + 1;
            } else if (iii < firstWeekAllDays + 7 * 1 && iii >= firstWeekAllDays) {
                WholeMonth[1].weekdays[iii - firstWeekAllDays].num = iii + 1;
            } else if (iii < firstWeekAllDays + 7 * 2 && iii >= firstWeekAllDays + 7 * 1) {
                WholeMonth[2].weekdays[iii - firstWeekAllDays - 7 * 1].num = iii + 1;
            } else if (iii < firstWeekAllDays + 7 * 3 && iii >= firstWeekAllDays + 7 * 2) {
                WholeMonth[3].weekdays[iii - firstWeekAllDays - 7 * 2].num = iii + 1;
            } else if (iii < firstWeekAllDays + 7 * 4 && iii >= firstWeekAllDays + 7 * 3) {
                WholeMonth[4].weekdays[iii - firstWeekAllDays - 7 * 3].num = iii + 1;
            } else if (iii < firstWeekAllDays + 7 * 5 && iii >= firstWeekAllDays + 7 * 4) {
                WholeMonth[5].weekdays[iii - firstWeekAllDays - 7 * 4].num = iii + 1;
            }
        }
        return WholeMonth;

    },
    setThisWeek: function(weekObj,day) {
        let weekList = util.data.weekList;
        for (let i = 0; i < 7; i += 1) {
            weekList[0].num = weekObj[0].num
        }
        this.setData({weekList})
    },
    chooseDate(e) {
        const dir = e.currentTarget.dataset.dir;
        const isLeftHidden = false;
        const isRightHidden = false;
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
    }
})
