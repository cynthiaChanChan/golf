const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require("../../dist/request/request");
Page({
    data: {
        img: util.data.img,
        _tabbar_: {},
        isHintHidden: true,
        iscallBoxHidden: true,
        chosenIdx: ""
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
        this.setThisWeek(weekObj);
        const coach_id = wx.getStorageSync("golfLogin").id;
        const coach = wx.getStorageSync("golfLogin").name;
        this.setData({coach});
		this.GetGolfCurriculumByCoachID(coach_id, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(this.day)}`);

    },
    GetGolfCurriculumByCoachID: function(coach_id, date) {
        const coursesList = [];
        request.GetGolfCurriculumByCoachID(coach_id, date).then((res) => {
            //过滤课程时间不正确的课
            if (res.length > 0) {
                for (let course of res) {
                    let time = util.formatDate(`${date} ${course.what_time}:00`);
                    if (time.toString().indexOf('Invalid') === -1) {
                        coursesList.push(course);
                    }
                }
            }
            this.setData({
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
        let chosenIdx = "";
        let firstDay = "";
        for (let i = 0; i < 7; i += 1) {
            weekList[i].num = weekObj.weekdays[i].num;
            if (weekObj.weekdays[i].num == this.day && this.theMonth == this.month && this.theYear == this.year) {
                //标记今天
                weekList[i].mark = "today";
                weekList[i].title = '今天';
                weekList[i].chosen = 'active';
                chosenIdx = i;
            }
        }
        let date = `${this.year}年${this.month}月 第${weekObj.weekNum}周`;
        firstDay = weekList.find((elem) => {
            return elem.num
        })
        if (!chosenIdx) {
            firstDay.chosen = 'active';
            chosenIdx = weekList.findIndex((elem) => {
                return elem.num
            })
        }
        let isLeftHidden = this.hideLeft(firstDay);
        this.setData({weekList, date, isLeftHidden, chosenIdx});
        return firstDay;
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
        let firstDay = this.setThisWeek(this.WholeMonth[this.weekIdx]);
        const coach_id = wx.getStorageSync('golfLogin').id;
        const weekList = this.data.weekList;
        const chosenIdx = this.data.chosenIdx;
        this.GetGolfCurriculumByCoachID(coach_id, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[chosenIdx].num)}`);
    },
    hideLeft(firstDay) {
        let isLeftHidden = false;
        //无法点击去2018以前的时间
        const now = new Date(2018, 0, 1, 0, 1).getTime();
        const calenderTime = util.formatDate(`${this.year}-${this.month}-${firstDay.num} 00:00:00`);
        if (now > calenderTime.getTime()) {
          isLeftHidden = true;
        }
        return isLeftHidden;
    },
    checkCourses(e) {
        const index = e.currentTarget.dataset.index;
        const weekList = this.data.weekList;
        const coach_id = wx.getStorageSync('golfLogin').id;
        let chosenIdx = this.data.chosenIdx;
        if (!weekList[index].num) {
            return;
        }
        weekList[chosenIdx].chosen = "";
        weekList[index].chosen = "active";
        chosenIdx = index;
        this.setData({weekList, chosenIdx});
        const now = util.formatDate(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`);
        //不屏蔽往日课程
        this.GetGolfCurriculumByCoachID(coach_id, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[index].num)}`);
    },
    book(e) {
        const that = this;
        const coursesList = this.data.coursesList;
        const index = e.currentTarget.dataset.index;
        const weekList = this.data.weekList;
        const chosenIdx = this.data.chosenIdx;
        const course = coursesList[index];
        const date = this.data.date;
        course.weekday = weekList[chosenIdx].title;
        if (course.weekday != '今天') {
            course.weekday = `星期${course.weekday}`;
        }
        course.date = date.split(" ")[0] + weekList[chosenIdx].num + "日";
        this.setData({
            isHintHidden: false,
            course
        })
    },
    logout() {
        wx.removeStorageSync("golfLogin");
        wx.redirectTo({
            url: "../index/index"
        })
    },
    call(e) {
        const that = this;
        const makeappList = this.data.course.makeappList;
        const idx = e.currentTarget.dataset.idx;
        const phoneNumber = makeappList[idx].phone.replace(/(\w{3})(\w{4})(\w{4})/, "$1 $2 $3 ");
        this.setData({
            phoneNumber,
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
