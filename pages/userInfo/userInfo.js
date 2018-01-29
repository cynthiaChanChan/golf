const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
const request = require('../../dist/request/request');
Page({
	data: {
		img: util.data.img,
		sex: { idx: 0, arr: ['男', '女'], value: '未知' },//gender值为1时是男性，值为2时是女性，值为0时是未知
		date: util.getYyMmDd(new Date()),
	},
	onLoad(options) {
		this.init()
	},
	init() {
		// 授权
		authorize.useUserInfo({
			success: () => {
				this.setInfo()
			},
			fail: () => {
				util.alert('获取不到您的个人信息！')
			}
		})
	},
	setInfo() {
		const userid = wx.getStorageSync(util.data.userIdStorage)
		request.GetUserInfoCommon(userid).then(res => {
			let { sex, date } = this.data
			sex.value = res.sex || sex.value
			date = res.birthday || date
			if (res.username) {
				res.wxname = res.username
				res.photo = res.headImgUrl
			}
			this.setData({ info: res, sex, date })
		})
	},
	sexChange(e) {
		const idx = e.detail.value
		const { sex } = this.data
		sex.idx = idx
		sex.value = sex.arr[idx]
		this.setData({
			sex
		})
	},
	dateChange(e) {
		this.setData({
			date: e.detail.value
		})
	},
	selectImg(e) {
		wx.chooseImage({
			count: 1, // 默认9
			sizeType: ['original', 'compressed'],
			sourceType: ['album', 'camera'],
			success: res => {
				const tempFilePaths = res.tempFilePaths
				// 上传
				request.upload(tempFilePaths[0]).then(res => {
					this.setData({ 'info.photo': util.data.host + res.data })
				})
			}
		})
	},
	formSubmit(e) {
		const { username, contactname, phone, email, wx_id } = e.detail.value
		if (!contactname) {
			util.alert('联系人不能为空！')
			return
		}
		if (phone.length < 7 || phone[0] != 1) {
			util.alert('请输入正确的联系电话！')
			return
		}
		const { sex, date, info } = this.data
		const data = {
			id: info.id,
			photo: info.photo,
			wxname: info.wxname,
			sex: sex.value,
			birthday: date,
			contact: contactname,
			phone,
			email,
			weixin_id: wx_id,
			wxpublic_id: util.data.appid
		}
		request.SaveUserInfoCommon(data).then(res => {
			this.showTip()
		})
	},
	showTip() {
		util.toast('修改成功', () => {
			setTimeout(() => {
				const pages = getCurrentPages()
				const prePage = pages[pages.length - 2]
				wx.reLaunch({
					url: `/util{prePage.route}util{prePage.options.id ? '?id=' + prePage.options.id : ''}`
				})
			}, 1500)
		})
	},
})
