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

function GetBaikeTypeList(id) {
	// 百科一级分类接口
	return util.get('/KorjoApi/GetBaikeTypeAndImageList', { projectid: id });
}

function GetBaikeTypeByParentID(parentid) {
    // 子分类接口
    return util.get('/KorjoApi/GetBaikeTypeByParentID', { parentid });
}

function GetBaikeFQAList(id, pgnu, pgsize) {
    // 列表接口
    return util.get('/KorjoApi/GetBaikeFQAList', {
        baiketype: id,
        pgnu,
        pgsize
    });
}

function GetBaikeFQAInfo(id) {
	// 文章接口
	return util.get('/KorjoApi/GetBaikeFQAInfo', {
		id: id
	});
}

module.exports = {
    GetSessionKey,
    saveUserInfo,
	upload,
	GetBaikeTypeList,
	GetBaikeTypeByParentID,
	GetBaikeFQAList,
	GetBaikeFQAInfo
}
