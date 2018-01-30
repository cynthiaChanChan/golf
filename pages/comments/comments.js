const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
const request = require('../../dist/request/request');
Page({
	data: {
		img: util.data.img,
	},
	onLoad(options) {
	},
	formSubmit(e) {
		const { username, phone, content } = e.detail.value
		if (!username) {
			util.alert('请输入留言人！')
			return
		}
		if (phone.length < 7 || phone[0] != 1) {
			util.alert('请输入正确的电话号码！')
			return
		}
		if (!content) {
			util.alert('请输入反馈内容！')
			return
		}
		// 授权
		authorize.useUserInfo({
			success: () => {
				this.submit(e.detail.value)
			},
			fail: () => {
				util.alert('授权失败！')
			}
		})
	},
	submit({ username, phone, content }) {
		const data = {
			people: username,
			phone,
			content,
			wxpublic_id: util.data.appid
		}
		request.SaveLeaveMessageCommon(data).then(res => {
			util.toast('提交成功', () => {
				wx.redirectTo({
					url: "../personal/personal"
				})
			})
		})
	},
})
