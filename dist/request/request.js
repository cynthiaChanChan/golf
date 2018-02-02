const util = require('../../utils/util');
// 获取用户openid
function GetSessionKey(dataObj) {
	return util.get('/KorjoApi/GetSessionKey', dataObj)
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

function GetGolfIntroList() {
	return util.get('/GolfApi/GetGolfIntroList');
}

function GetGolfMatchByDate(match_date, typename) {
	return util.get('/GolfApi/GetGolfMatchByDate', {
		match_date, typename
	});
}

function GetLatelyMatchByTypeName(typename) {
	return util.get('/GolfApi/GetLatelyMatchByTypeName', {typename});
}

function GetRestDateList(yearmonth) {
	//2018-01
	return util.get('/KorjoApi/GetRestDateList', {yearmonth});
	//rest_value:2 //2法定休息//1周末休
}

function GetGolfCurriculumInfo(id) {
	//https://www.korjo.cn/Admin/GolfCurriculum/Index
	return util.get('/GolfApi/GetGolfCurriculumInfo', {id});
}

function GetGolfCurriculumByDate(date) {
	//2018-1-25
	return util.get('/GolfApi/GetGolfCurriculumByDate', {date});
}

function SaveUserInfoCommon(data) {
	return util.post('/GolfApi/SaveUserInfoCommon',{dataJson: JSON.stringify(data)});
}

function GetUserInfoCommon(id) {
	return util.get('/GolfApi/GetUserInfoCommon', {id});
}

function PayCommon(order_pay_id) {
	return util.post('/PayApi/PayCommon', {order_pay_id});
}

function SaveLeaveMessageCommon(data) {
	return util.post('/GolfApi/SaveLeaveMessageCommon', {dataJson: JSON.stringify(data)});
}

function ValidateUserOpenid(unionid) {
    return util.get('/KorjoApi/ValidateUserOpenid', {unionid});
}

function GetMyGolfMakeAppointment(userid) {
	return util.get('/GolfApi/GetMyGolfMakeAppointment', {userid});
}

function SaveGolfMakeAppointment(userid, curriculum_id, wxpublic_id) {
	return util.post('/GolfApi/SaveGolfMakeAppointment', {
		dataJson: JSON.stringify({userid, curriculum_id, wxpublic_id})
	});
}

function SaveSendMsg(sendtime, param, sendtype, openid) {
	return util.post('/KorjoApi/SaveSendMsg', {
		jsonData: JSON.stringify({
			"messagejson": JSON.stringify(param),
			sendtime,
			"wxpublic_id": util.data.appid,
			sendtype,
			openid
		})
	});
}
//粉我吧科技介绍页
function GetFansIntro(wxpublic_id) {
	return util.get('/KorjoApi/GetFansIntro', {wxpublic_id});
}

module.exports = {
    GetSessionKey,
	upload,
	GetBaikeTypeList,
	GetBaikeTypeByParentID,
	GetBaikeFQAList,
	GetBaikeFQAInfo,
	GetGolfIntroList,
	GetGolfMatchByDate,
	GetLatelyMatchByTypeName,
	GetRestDateList,
	GetGolfCurriculumInfo,
	GetGolfCurriculumByDate,
	SaveUserInfoCommon,
	GetUserInfoCommon,
	PayCommon,
	SaveLeaveMessageCommon,
	ValidateUserOpenid,
	GetMyGolfMakeAppointment,
	SaveGolfMakeAppointment,
	SaveSendMsg,
	GetFansIntro
}
