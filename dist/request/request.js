const util = require('../../utils/util');
// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
}

function saveUserInfo(dataObj) {
	return util.post('/KorjoApi/SaveUserInfo', {jsonData: JSON.stringify(dataObj)})
}

//上传图片
function upload(filePath) {
	// util.loading();
	return new Promise((resolve, reject) => {
		wx.uploadFile({
			url: `${util.data.host}/KorjoApi/AdminUpload`,
			name: 'file',
			formData: { "path": "golf", "type": "image" },
			filePath,
			success: (res) => {
				util.hideLoading();
				resolve(res);
			},
			fail: (error) => {
				reject(error);
			}
		})
	});
}

module.exports = {
  GetSessionKey,
  saveUserInfo,
	upload
}
