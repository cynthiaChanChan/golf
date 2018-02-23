const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require("../../dist/request/request");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {},
        isHintHidden: true,
        iscallBoxHidden: true
    },
    onLoad() {
        const today = new Date();
        this.year = today.getFullYear();
        this.theYear = this.year;
        this.month = today.getMonth() + 1;
        this.theMonth = this.month;
        this.day = today.getDate();
        //确认年月周：2018年1月 第一周
        const weekday = today.getDay();
        this.setWholeMonth();
        let weekObj = "";
        let weekIdx = "";
        //找到今日
        for (let i = 0; i < this.WholeMonth.length; i += 1) {
            for (let one of this.WholeMonth[i].weekdays) {
                if (one.num == this.day) {
                    weekObj = this.WholeMonth[i];
                    this.weekIdx = i;
                }
            }
        }
        console.log("This week: ", weekObj);
        this.setThisWeek(weekObj);
        const coach_id = wx.getStorageSync("golfLogin").id;
        const coach = wx.getStorageSync("golfLogin").name;
		this.GetGolfCurriculumByCoachID(coach, coach_id, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(this.day)}`);

    },
    GetGolfCurriculumByCoachID: function(coach, coach_id, date) {
        const coursesList = [];
        request.GetGolfCurriculumByCoachID(coach_id, date).then((res) => {
            //过滤课程时间不正确的；已经过去的课
            if (res.length > 0) {
                for (let course of res) {
                    let time = util.formatDate(`${date} ${course.what_time}:00`);
                    const now = new Date();
                    if (time.toString().indexOf('Invalid') === -1 && now.getTime() < time.getTime()) {
                        coursesList.push(course);
                    }
                }
            }
            this.setData({
                coach,
                coursesList,
                isHistory: false
            })
        });
    },
    setWholeMonth: function() {
        const chineseWeekday = ["一","二","三","四","五","六", "日"];
        //每月周数weeks
        this.weeks = util.weeksCount(this.year, this.month);
        let WholeMonth = [];
        for (let i = 0; i < this.weeks; i += 1) {
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
        this.WholeMonth = this.createMonthData(WholeMonth);
        console.log(this.WholeMonth);
    },
    createMonthData(WholeMonth) {
        //确认每月天数DaysOfMonth
        let DaysOfMonth = util.checkDaysOfMonth(this.month, this.year);
        const firstOfMonth = new Date(this.year, this.month - 1, 1);
        let firstWeekday = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay();
        console.log('first week is from: ', firstWeekday);
        for (let iii = 0; iii < DaysOfMonth; iii += 1) {
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
        return WholeMonth
    },
    setThisWeek: function(weekObj) {
        let weekList = util.templateList();
        for (let i = 0; i < 7; i += 1) {
            weekList[i].num = weekObj.weekdays[i].num;
            if (weekObj.weekdays[i].num == this.day && this.theMonth == this.month && this.theYear == this.year) {
                //标记今天
                weekList[i].mark = "today";
                weekList[i].title = '今天';
            }
        }
        let date = `${this.year}年${this.month}月 第${weekObj.weekNum}周`;
        let isLeftHidden = this.hideLeft(weekList);
        this.setData({weekList, date, isLeftHidden});
        console.log("weekList", weekList)
    },
    chooseDate(e) {
        const dir = e.currentTarget.dataset.dir;
        let isRightHidden = false;
        const weeks = this.weeks;
        //往左减少日期，vice versa
        if (dir == "left") {
            if (this.weekIdx > 0) {
                this.weekIdx -= 1;
            } else {
                if (this.month == 1) {
                    this.month = 12;
                    this.year -= 1;
                } else {
                    this.month -= 1;
                }
                this.setWholeMonth();
                this.weekIdx = this.weeks - 1;
            }
        } else {
            if (this.weekIdx < this.weeks - 1) {
                this.weekIdx += 1;
            } else {
                this.weekIdx = 0;
                if (this.month == 12) {
                    this.month = 1;
                    this.year += 1;
                } else {
                    this.month += 1;
                }
                this.setWholeMonth();
            }
        }
        this.setThisWeek(this.WholeMonth[this.weekIdx]);
    },
    hideLeft(weekList) {
        let isLeftHidden = false;
        //无法点击去过去的时间
        const now = new Date().getTime();
        const calenderTime = util.formatDate(`${this.year}-${this.month}-${weekList[0].num} 00:00:00`);
        if (now > calenderTime) {
          isLeftHidden = true;
        }
        console.log('isLeftHidden: ', isLeftHidden);
        return isLeftHidden;
    },
    book(e) {
        this.setData({
            isHintHidden: false
        })
    },
    logout() {
        wx.removeStorageSync("golfLogin");
        wx.redirectTo({
            url: "../index/index"
        })
    },
    call() {
        this.setData({
            iscallBoxHidden: false
        })
    },
    cancelPhoneCall() {
        this.setData({
            iscallBoxHidden: true
        })
    },
    makePhoneCall() {
        wx.makePhoneCall({
            phoneNumber: '15013320137'
        })
    },
    remove() {
        this.setData({
            isHintHidden: true
        })
    }
})
