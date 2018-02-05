const util = require("../../utils/util");
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require("../../dist/request/request");
const {makeAPayment} = require("../../utils/payment");
const calendar = require('../../calendar/calendar');
Page({
    data: {
        img: util.data.img,
        _tabbar_: {},
        isHintHidden: true,
        isBookingFormHidden: true,
        chosenIdx: ""
    },
    onLoad(options) {
        new Tabbar();
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
        this.GetGolfCurriculumByDate(`${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(this.day)}`);
    },
    GetGolfCurriculumByDate: function(date) {
        const coursesList = [];
        request.GetGolfCurriculumByDate(date).then((res) => {
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
        this.WholeMonth = calendar.createMonthData(WholeMonth, this.month, this.year);
        console.log(this.WholeMonth);
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
        console.log("weekList", weekList)
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
        this.GetGolfCurriculumByDate(`${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(firstDay.num)}`);
    },
    hideLeft(firstDay) {
        let isLeftHidden = false;
        //无法点击去过去的时间
        const now = new Date().getTime();
        const calenderTime = util.formatDate(`${this.year}-${this.month}-${firstDay.num} 00:00:00`);
        if (now > calenderTime.getTime()) {
          isLeftHidden = true;
        }
        return isLeftHidden;
    },
    book(e) {
        const that = this;
        const coursesList = this.data.coursesList;
        const index = e.currentTarget.dataset.index;
        // 授权
		authorize.useUserInfo({
			success: () => {
				that.GetUserInfoCommon(index);
			},
			fail: () => {
				util.alert('授权失败！')
			}
		})
    },
    GetUserInfoCommon(index) {
        const that = this;
        const coursesList = this.data.coursesList;
        const weekList = this.data.weekList;
        const chosenIdx = this.data.chosenIdx;
        const date = this.data.date;
        const userid = wx.getStorageSync(util.data.userIdStorage)
		request.GetUserInfoCommon(userid).then(res => {
            //如果联系人信息里没有电话，则让用户提交个人信息（教练管理平台用到电话）
            if (!res.phone) {
                util.alert('请先添加您的个人信息', () => {
                    wx.redirectTo({
                        url: "../userInfo/userInfo?from=book"
                    })
                });
            } else {
                let course = coursesList[index];
                course.weekday = weekList[chosenIdx].title;
                if (course.weekday != '今天') {
                    course.weekday = `星期${course.weekday}`;
                }
                course.date = date.split(" ")[0] + weekList[chosenIdx].num + "日";
                that.setData({
                    course,
                    isHintHidden: false
                })
            }
		})
    },
    pay(e) {
        const id = e.currentTarget.dataset.id;
        const userid = Number(wx.getStorageSync(util.data.userIdStorage));
        request.SaveGolfMakeAppointment(userid, id, util.data.appid).then((res) => {
            console.log('保存订单：', res);
            if (res.status != 200) {
                util.alert('确认订单失败，请重新确认！');
                return;
            }
            //data第二个数字是支付id
            request.PayCommon(res.data.split(",")[1]).then((res) => {
                const payData = JSON.parse(res.data);
                return makeAPayment(payData);
            }).then((res) => {
                console.log("支付成功：", res)
                this.setData({
                    isBookingFormHidden: false
                })
            }).catch((error) => {
                util.alert('订单支付失败，请重新确认并支付！');
                console.log("支付失败：", error)
            });
        });
    },
    checkCourses(e) {
        const index = e.currentTarget.dataset.index;
        const weekList = this.data.weekList;
        let chosenIdx = this.data.chosenIdx;
        if (!weekList[index].num) {
            return;
        }
        weekList[chosenIdx].chosen = "";
        weekList[index].chosen = "active";
        chosenIdx = index;
        this.setData({weekList, chosenIdx});
        const now = util.formatDate(`${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()} 00:00:00`);
        //屏蔽往日课程
        const chosenTime = util.formatDate(`${this.year}-${this.month}-${weekList[index].num} 00:00:00`);
        if (now.getTime() > chosenTime.getTime()) {
          this.setData({
              coursesList: [],
              isHistory: true
          })
          return;
        } else {
          this.setData({
              isHistory: false
          })
        }
        this.GetGolfCurriculumByDate(`${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[index].num)}`);
    },
    remove() {
        this.setData({
            isHintHidden: true,
            isBookingFormHidden: true
        })
    }
})
