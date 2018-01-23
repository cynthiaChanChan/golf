const util = require("../../utils/util");
const {authorize} = require('../../dist/authorize/authorize');
const request = require('../../dist/request/request');
const {Dialog} = require('../../dist/dialog/index');
Page(Object.assign({}, Dialog, {
	data: {
		img: util.data.img,
		_tabbar_: {},
		status: {
			'0': { text: '已提交', showBtn: true, btn: '取消订单' },
			'1': { text: '协商中', showBtn: false },
			'2': { text: '已完成', showBtn: true, btn: '删除订单' },
			'3': { text: '已取消', showBtn: false },
		},
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
		const userid = wx.getStorageSync('userid')
		const list = [];
        for (let i = 0; i < 3; i += 1) {
            list.push({

            })
        }
        this.setData({list});
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
			return request.UpdateOrderStatus(data)
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
}))