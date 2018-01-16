const util = require('../../utils/util');
// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
}

function saveUserInfo(dataObj) {
		return utilpost('/KorjoApi/SaveUserInfo', { jsonData: JSON.stringify(dataObj) })
}

module.exports = {
  GetSessionKey,
  saveUserInfo
}
