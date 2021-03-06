const util = require("../../utils/util");
const notification = require("../../utils/notification");
const {Tabbar} = require("../../dist/tabbar/index");
const {authorize} = require('../../dist/authorize/authorize');
const request = require("../../dist/request/request");
const {makeAPayment} = require("../../utils/payment");
const calendar = require('../../calendar/calendar');
const {addSpaces} = require("../../utils/payment");
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
        const that = this;
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
        // 授权
		authorize.useUserInfo({
			success: () => {
                const userid = wx.getStorageSync(util.data.userIdStorage);
				that.GetGolfCurriculumByDate(userid, `${that.year}-${util.formatNumber(that.month)}-${util.formatNumber(that.day)}`);
			},
			fail: () => {
				util.alert('授权失败！')
			}
		})
    },
    GetGolfCurriculumByDate: function(userid, date) {
        const coursesList = [];
        request.GetGolfCurriculumByDate(userid, date).then((res) => {
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
        const userid = wx.getStorageSync(util.data.userIdStorage);
        const weekList = this.data.weekList;
        const chosenIdx = this.data.chosenIdx;
        this.GetGolfCurriculumByDate(userid, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[chosenIdx].num)}`);
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
        if (coursesList[index].status == 2) {
            //预约人数已满
            return;
        }
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
        const userid = wx.getStorageSync(util.data.userIdStorage);
        const openid = wx.getStorageSync(util.data.openIdStorage);
        let isfollowButtonHidden = true;
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
                // 提前两个小时通知上课，如没关注公众号，在预约单里关注
                const sendmillis = util.formatDate(course.schooltime.split("T")[0] + " " + course.what_time + ":00").getTime() - 120 * 60 * 1000;
                const sendtime = util.formatTime(new Date(sendmillis));
                const sendtype = notification.conformSendType(sendtime, openid, wx.getStorageSync(util.data.unionIdStorage));
                if (sendtype == 1) {
                  that.setData({
                      isHintHidden: false,
                      identity: wx.getStorageSync(util.data.openIdStorage),
                      followHint: "我们将会在开课前两小时微信通知您。\n"
                  })
                } else {
                    request.ValidateUserOpenid(wx.getStorageSync(util.data.unionIdStorage)).then((response) => {
                        if (response == 0) {
                            isfollowButtonHidden = false;
                            that.setData({
                                isHintHidden: false,
                                isfollowButtonHidden,
                                identity:  wx.getStorageSync(util.data.unionIdStorage),
                                followHint: "关注粉我吧科技公众号，我们将会在开课前两小时微信通知您。\n"
                            })
                        } else {
                            that.setData({
                                isHintHidden: false,
                                identity:  wx.getStorageSync(util.data.unionIdStorage),
                                followHint: "我们将会在开课前两小时微信通知您。\n"
                            })
                        }
                    })

                }
                that.setData({
                    sendtype,
                    course,
                    sendtime
                })
            }
		})
    },
    follow(e) {
    },
    pay(e) {
        const id = e.currentTarget.dataset.id;
        const userid = Number(wx.getStorageSync(util.data.userIdStorage));
        const openid = wx.getStorageSync(util.data.openIdStorage);
        const sendtype = this.data.sendtype;
        const identity = this.data.identity;
        const weekList = this.data.weekList;
        const chosenIdx = this.data.chosenIdx;
        const requestDate = `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[chosenIdx].num)}`;
        let param = "";
        request.SaveGolfMakeAppointment(userid, id, util.data.appid).then((res) => {
            console.log('保存订单：', res);
            if (res.status != 200) {
                const failHint = res.status == 201 ? '预约人数已满，请选其他时间！' : '确认订单失败，请重新确认！';
                util.alert(failHint);
                if (res.status == 201) {
                    this.GetGolfCurriculumByDate(userid, requestDate);
                    this.setData({
                        isHintHidden: true
                    })
                }
                return;
            }
            //data第二个数字是支付id//第一个是预约id
            const appointmentId = res.data.split(",")[0];
            request.PayCommon(res.data.split(",")[1]).then((res) => {
                const payData = JSON.parse(res.data);
                console.log(payData)
                this.prepay_id = payData.package.split("=")[1];
                return makeAPayment(payData);
            }).then((res) => {
                console.log("支付成功：", res)
                const course = this.data.course;
        		if (wx.getStorageSync("deniedGolfMessages")) {
                    //如果用户不接受推送
                    request.GetGolfMakeAppointment(appointmentId).then((res) => {
                        this.setData({
                            isBookingFormHidden: false,
                            code: addSpaces(res.identifying_code)
                        })
                    })

        		} else {
            		//接受推送
                    if (sendtype == 2) {
                        //上课通知--公众号
                        param = notification.sendMessageUsingPlatform(course);
                    } else {
                        //上课通知--小程序
                        param = notification.CourseStartMessage(course, this.prepay_id, openid);
                    }
                    request.SaveSendMsg(this.data.sendtime, param, sendtype, identity).then((res) => {
                        console.log("保存上课通知消息", res)
                    });
                    const paramForBooking = notification.bookedMessage(course, this.prepay_id, openid);
                    request.WxMessageSend(paramForBooking).then((res) => {
                        console.log("保存预约成功消息", res)
                    });
                    request.GetGolfMakeAppointment(appointmentId).then((res) => {
                        this.setData({
                            isBookingFormHidden: false,
                            code: addSpaces(res.identifying_code)
                        })
                    })
                }
            }, (error) => {
                util.alert('订单支付失败，请重新确认并支付！');
                console.log("支付失败：", error);
            });
        });
    },
    checkCourses(e) {
        const index = e.currentTarget.dataset.index;
        const weekList = this.data.weekList;
        const userid = Number(wx.getStorageSync(util.data.userIdStorage));
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
        this.GetGolfCurriculumByDate(userid, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[index].num)}`);
    },
    remove(e) {
        const type = e.currentTarget.dataset.type;
        const userid = Number(wx.getStorageSync(util.data.userIdStorage));
        const chosenIdx = this.data.chosenIdx;
        const weekList = this.data.weekList;
        if (type == 2) {
            //支付成功，关闭预约单，则重新获取课程
            this.GetGolfCurriculumByDate(userid, `${this.year}-${util.formatNumber(this.month)}-${util.formatNumber(weekList[chosenIdx].num)}`);
        }
        this.setData({
            isHintHidden: true,
            isBookingFormHidden: true
        })
    },
    onShareAppMessage: function(res) {
        return {
            title: "室内高尔夫训练预约",
            path: "/pages/booking/booking",
			imageUrl: "../../images/share.jpg",
            success: function(res) {
            },
            fail: function(res) {
            // 转发失败
            }
        }
    }
})
