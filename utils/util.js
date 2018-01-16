const data = getApp().data;

function loading() {
		if (wx.showLoading) {
			wx.showLoading({
				title: '加载中',
				mask: true
			})
		} else {
			wx.showToast({
				title: "加载中...",
				icon: "loading",
				duration: 100000
			})
		}
	},

function hideLoading() {
		if (wx.showLoading) {
			wx.hideLoading()
		} else {
			wx.hideToast()
		}
	},

function formatDate(time) {
    var arr = time.split(/[-T:\/\s]/);
    var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    return date;
}

formatTime(date) {
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var day = date.getDate()

		var hour = date.getHours()
		var minute = date.getMinutes()
		var second = date.getSeconds()

		return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(url, dataObj, method) {
  loading();
  return new Promise((resolv, reject) => {
    wx.request({
      url: url.indexOf("https://") ? url : data.host + url,
      dataObj,
      method,
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      success: (res) => {
        hideLoading();
        resolve(res.data);
      },
      fail: (res) => {
        console.error('request fail:' + url)
				console.error(res)
      }
    })
  });
}

function get(url, dataObj) {
  return request(url, dataObj, 'GET');
}

function post(url, dataObj) {
  return request(url, dataObj, 'POST');
}

module.exports = {
  data,
  get,
  post,
  formatNumber,
  formatDate,
  loading,
  hideLoading,
  formatTime
}
