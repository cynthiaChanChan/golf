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
		isHintHidden: true
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
					list.push(li);
				}
			}
	        this.setData({list});
		})
	},
	processOrder(e) {
		const { id, status } = e.currentTarget.dataset
		const data = {
			id,
			status: status == 0 ? 3 : -1
		}
		this.showZanDialog({
			content: `确认要util{status == 0 ? '取消' : '删除'}该订单吗？`,
			showCancel: true,
		}).then(() => {
			// return request.UpdateOrderStatus(data)
		}).then(res => {
			const list = this.data.list
			let idx = -1
			util.each(list, (i, v) => {
				v.id == data.id && (v.status = data.status)
				v.status == -1 && (idx = i)
			})
			idx > -1 && list.remove(idx)
			this.setData({ list })
		}).catch(()=>{
			util.log('cancel')
		})
	},
	send(e) {
		const dataset = e.currentTarget.dataset;
		const form_id = e.detail.formId;
		//消息模板id
		const template_id = "QNEjNoHRsd7mBvydWl4yRlgIaWs7WyFgRK2M5ypAEVM";
		const touser = wx.getStorageSync(util.data.openIdStorage);//openid
		const page = "/pages/myOrder/myOrder";
		const data = {
			"keyword1": {
	            "value": "推杆切杆",
	            "color": "#40425d"
	        },
	        "keyword2": {
	            "value": "300元",
	            "color": "#12898a"
	        },
	        "keyword3": {
	            "value": '2018-02-01 13：15：26',
	            "color": "#40425d"
	        },
			"keyword4": {
	            "value": '所交费用将在3个工作日内原路返还',
	            "color": "#12898a"
	        }
		};
		const sendtime = util.formatTime(new Date(new Date().getTime() + 1000 * 60 * 1));
		const sendtype = 1;
		const openid = wx.getStorageSync(util.data.openIdStorage);
		console.log("sendtime: ", sendtime);
		const param = {
			touser,
			template_id,
			page,
			form_id,
			data
		}
		request.SaveSendMsg(sendtime, param, sendtype, openid).then((res) => {
			console.log(res)
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
	}
})
