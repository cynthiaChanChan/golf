const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
const request = require('../../dist/request/request');
const notification = require("../../utils/notification");
const {addSpaces} = require("../../utils/payment");
Page({
	data: {
		img: util.data.img,
		_tabbar_: {},
		status: {
			'0': { text: '已提交', showBtn: true, btn: '取消订单' },
			'1': { text: '协商中', showBtn: false },
			'2': { text: '已完成', showBtn: true, btn: '删除订单' },
			'3': { text: '已取消', showBtn: false },
		},
		isHintHidden: true,
		isBookingFormHidden: true
	},
	onLoad(options) {
		// 授权
		authorize.useUserInfo({
			success: () => {
				this.init()
			},
			fail: () => {
				util.alert('授权失败！')
			}
		})
	},
	init() {
		const userid = wx.getStorageSync(util.data.userIdStorage)
		request.GetMyGolfMakeAppointment(userid).then((res) => {
			const list = [];
			if (res.length > 0) {
				for (let li of res) {
                    // 每四个数字加个空格
					li.identifying_code = addSpaces(li.identifying_code);
					const addtime = li.addtime;
					const chineseWeekday = ["一","二","三","四","五","六", "日"];
					let weekday = util.formatDate(li.schooltime).getDay();
					if (weekday == 0) {
						weekday = 7;
					}
					li.addtime = addtime.split("T")[0] + ' ' + addtime.split("T")[1];
					//2018年1月2日 星期二 18:00
					li.schooltime = li.schooltime.split("T")[0] + ' 星期' + chineseWeekday[weekday] + ' ' + li.what_time;
					const statusArray = ["已付费", "已退费", "退款中"];
					li.orderStatus = statusArray[li.status - 1];
					list.push(li);
				}
			}
	        this.setData({list});
		})
	},
	cancelOrder(e) {
		const dataset = e.currentTarget.dataset;
		const openid = wx.getStorageSync(util.data.openIdStorage);
		const course = this.data.list[dataset.idx];
		request.GetMakeAppointmentCount(openid, new Date().getFullYear() + "-" + util.formatNumber(new Date().getMonth() + 1)).then((res) => {
			//如离开课时间不到两个小时，则不让取消
			const backTwoHours = util.formatDate(course.schooltime.split(" ")[0] + " " + course.what_time + ":00").getTime() - 120 * 60 * 1000;
			const now = new Date().getTime();
			if (now > backTwoHours) {
				util.alert("上课前两个小时后无法取消");
				return;
			}
			//如已满取消次数，则不让取消
			if (Number(res.data) <= 0) {
				util.alert("本月取消次数已满，无法再取消");
				return;
			}
			this.setData({
				isBookingFormHidden: false,
				course
			})
		});
	},
	send(e) {
		const that = this;
		const dataset = e.detail.target.dataset;
		//如果用户不接受推送
		if (wx.getStorageSync("deniedGolfMessages")) {
			that.cancel(dataset.payid, 3);
			return;
		}
		//接受推送
		const form_id = e.detail.formId;
		const course = this.data.course;
		//消息模板id
		const template_id = "QNEjNoHRsd7mBvydWl4yRlgIaWs7WyFgRK2M5ypAEVM";
		const touser = wx.getStorageSync(util.data.openIdStorage);//openid
		const page = "/pages/myOrder/myOrder";
		const data = {
			"keyword1": {
	            "value": course.content,
	            "color": "#40425d"
	        },
	        "keyword2": {
	            "value": `${course.cost}元/时`,
	            "color": "#12898a"
	        },
	        "keyword3": {
	            "value": course.schooltime,
	            "color": "#40425d"
	        },
			"keyword4": {
	            "value": '所交费用将在3个工作日内原路返还',
	            "color": "#12898a"
	        }
		};
		const param = {
			touser,
			template_id,
			page,
			form_id,
			data
		}
		request.WxMessageSend(param).then((res) => {
			console.log(res);
			//status为3， 是表示取消订单，待退款成功
			that.cancel(dataset.payid, 3);
		})
	},
	cancel(order_pay_id, status) {
		const that = this;
		const openid = wx.getStorageSync(util.data.openIdStorage);//openid
		request.UpdateOrderPayStatus(order_pay_id, status).then(() => {
			request.RunCommon(order_pay_id).then((res) => {
				if(res.status == 200) {
					request.GetMakeAppointmentCount(openid, new Date().getFullYear() + "-" + util.formatNumber(new Date().getMonth() + 1)).then((res) => {
						that.setData({
							isBookingFormHidden: true,
							remainCount: "",
							isHintHidden: false
						});
						that.init();
					});
				} else {
					util.alert('如退款失败，请联系商家！')
				}
			})
		})
	},
	goBooking() {
		wx.redirectTo({
			url: "../booking/booking"
		})
	},
	hideLightBox() {
		this.setData({
			isHintHidden: true
		})
	},
	remove() {
        this.setData({
            isHintHidden: true,
            isBookingFormHidden: true
        })
    }
})
