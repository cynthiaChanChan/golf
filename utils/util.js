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
}

function hideLoading() {
		if (wx.showLoading) {
			wx.hideLoading()
		} else {
			wx.hideToast()
		}
}

function alert(content, callback) {
	// 提示弹层
	wx.showModal({
		title: '提示',
		content,
		showCancel: false,
		success: function (res) {
			callback && callback()
		}
	})
}

function formatDate(time) {
    var arr = time.split(/[-T:\/\s]/);
    var date = new Date(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]);
    return date;
}

function formatTime(date) {
		var year = date.getFullYear()
		var month = date.getMonth() + 1
		var day = date.getDate()
		var hour = date.getHours()
		var minute = date.getMinutes()
		var second = date.getSeconds()
		return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function getYyMmDd(date) {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}年${month}月${day}日`;
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function request(url, dataObj, method) {
  loading();
  return new Promise((resolve, reject) => {
    wx.request({
      url: url.indexOf("https://") > -1 ? url : data.host + url,
      data: dataObj,
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

function navigateBack() {
  wx.navigateBack({
    delta: 1
  })
}

function goPage(e) {
	const data = e.currentTarget.dataset,
		{page, openType = 'navigate'} = data,
		param = data.param ? `${data.param}` : '',
		url = `/pages/${page}/${page}${param}`,
		obj = {
			navigate() {
				wx.navigateTo({ url })
			},
			redirect() {
				wx.redirectTo({ url })
			},
			reLaunch() {
				wx.reLaunch({ url })
			},
			back() {
				wx.navigateBack({ delta: 1 })
			}
		};
	obj[openType]();
}

function get(url, dataObj) {
  return request(url, dataObj, 'GET');
}

function post(url, dataObj) {
  return request(url, dataObj, 'POST');
}

function checkList(index, listArray, listActiveIdx) {
	listArray[index].active = 'active';
	listArray[listActiveIdx].active = '';
	listActiveIdx = index;
	return {listArray, listActiveIdx};
}

function checkDaysOfMonth(mm, yyyy) {
    var daysofmonth;
    if ((mm == 4) || (mm ==6) || (mm ==9) || (mm == 11)){
        daysofmonth = 30;
    } else {
        daysofmonth = 31;
        if (mm == 2){
            if (yyyy/4 - parseInt(yyyy/4, 10) != 0){
                daysofmonth = 28;
            } else {
                if (yyyy/100 - parseInt(yyyy/100, 10) != 0) {
                    daysofmonth = 29;
                }else{
                    if (yyyy/400 - parseInt(yyyy/400, 10) != 0) {
                        daysofmonth = 28;
                    }else{
                        daysofmonth = 29;
                    }
                }
            }
        }
    }
    return daysofmonth;
}

function weeksCount(year, month_number) {
  var firstOfMonth = new Date(year, month_number - 1, 1);
  var day = firstOfMonth.getDay() || 6;
  day = day === 1 ? 0 : day;
  if (day) { day-- }
  var diff = 7 - day;
  var lastOfMonth = new Date(year, month_number, 0);
  var lastDate = lastOfMonth.getDate();
  if (lastOfMonth.getDay() === 1) {
  	diff--;
  }
  var result = Math.ceil((lastDate - diff) / 7);
  return result + 1;
};

function templateList() {
	const arr = ["一", "二", "三", "四", "五", "六", "日"];
	const templateList = [];
	arr.forEach(function(ele) {
		templateList.push({
			title: ele
		})
	});
	return templateList;
}

function each(object, callback) {
	var name, i = 0,
		length = object.length,
		isObj = length === undefined

	if (isObj) {
		for (name in object) {
			if (callback.call(object[name], name, object[name]) === false) {
				break
			}
		}
	} else {
		for (var value = object[0]; i < length && callback.call(value, i, value) !== false; value = object[++i]) { }
	}
	return object
}

function getText(str) {
    // html提取纯文本
    // return str.replace(/<\/?div.*?>|<\/?section.*?>|<\/?p.*?>|<img.*?>|<br.*?\/>|&nbsp;|<\/?span.*?>|<\/?a.*?>|<\/?em.*?>|<\/?strong.*?>|<\/?ul.*?>|<\/?li.*?>|<\/?dl.*?>|<\/?dt.*?>|<\/?dd.*?>|<\/?b.*?>|<\/?h\d.*?>/gi, '').replace(/&#39;/ig, "'")
    return str.replace(/<style>.*?<\/style>/gi, "").replace(/&#39;/ig, "'").replace(/<\/?[^>]*>|&[^;]*;/ig, '');
}

function url2abs(str) {
    // img链接转换为绝对路径
    return str.replace(/<img.*?src="\//gi, '<img src="https://www.korjo.cn//').replace(/&#39;/gi, "'").replace(/<video.*?src="\//gi, '<video src="https://www.korjo.cn//').replace(/<source.*?<\/video>/gi, "</video>").replace(/<style>.*?<\/style>/gi, "");
}

function extend(target, options) {
	for (let name in options) {
		target[name] = options[name]
	}
	return target
}

function addHost(url) {
	if (url.indexOf("http") > -1) {
		return url;
	} else {
		return data.host + url;
	}
}

function toast(title, callback) {
	wx.showToast({
		title,
		icon: 'success',
		mask: true,
		success() {
			callback && callback()
		}
	})
}

module.exports = {
	navigateBack,
  	data,
  	get,
  	post,
  	formatNumber,
  	formatDate,
	getYyMmDd,
  	loading,
  	hideLoading,
	alert,
  	formatTime,
	goPage,
	checkList,
	checkDaysOfMonth,
	weeksCount,
	templateList,
	each,
	url2abs,
	getText,
	extend,
	addHost,
	toast
}
