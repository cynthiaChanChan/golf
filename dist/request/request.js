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
				resolve(res.data);
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

function GetGolfCurriculumByDate(userid, date) {
	//2018-1-25
	return util.get('/GolfApi/GetGolfCurriculumByDate', {userid, date});
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
    return util.get('/KorjoApi/ValidateUserOpenid', {unionid, wxpublic_id: util.data.appid});
}

function GetMyGolfMakeAppointment(userid) {
	return util.get('/GolfApi/GetMyGolfMakeAppointment', {userid});
}

function SaveGolfMakeAppointment(userid, curriculum_id, wxpublic_id) {
	return util.post('/GolfApi/SaveGolfMakeAppointment', {
		dataJson: JSON.stringify({userid, curriculum_id, wxpublic_id})
	});
}

//定时消息推送
function SaveSendMsg(sendtime, param, sendtype, openid) {
	const jsonData = JSON.stringify({
		messagejson: JSON.stringify(param),
		sendtime,
		wxpublic_id: util.data.appid,
		sendtype,
		openid
	});
	console.log("SaveSendMsg: ", jsonData);
	return util.post('/KorjoApi/SaveSendMsg', {jsonData});
}

//实时消息推送
function WxMessageSend(param) {
	return util.post('/KorjoApi/WxMessageSend', {id: util.data.appid, param: JSON.stringify(param)});
}

//粉我吧科技介绍页
function GetFansIntro(wxpublic_id) {
	return util.get('/KorjoApi/GetFansIntro', {wxpublic_id});
}

function UpdateOrderPayStatus(id, status) {
	return util.post('/GolfApi/UpdateOrderPayStatus', {id, status});
}

function RunCommon(order_pay_id) {
	return util.post('/PayApi/RunCommon', {order_pay_id});
}
// 保存公众号关注链接
function SaveDataJsonCommon(wxpublic_id, data) {
	return util.post('/KorjoApi/SaveDataJsonCommon', {
		dataJson: JSON.stringify({wxpublic_id, datajson: JSON.stringify(data)})
	});
}

function GetGolfMakeAppointment(id) {
	return util.get('/GolfApi/GetGolfMakeAppointment', {id});
}

function GetMakeAppointmentCount(openid, year_month) {
	return util.get('/GolfApi/GetMakeAppointmentCount', {openid, year_month});
}

function GetAdminCoach(username, password) {
	return util.get('/GolfApi/GetAdminCoach', {username, password});
}

function GetGolfCurriculumByCoachID(coach_id, date) {
	//coach_id=759&date=2018-02-07
	return util.get('/GolfApi/GetGolfCurriculumByCoachID', {coach_id, date});
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
	GetFansIntro,
	UpdateOrderPayStatus,
	RunCommon,
	SaveDataJsonCommon,
	WxMessageSend,
	GetGolfMakeAppointment,
	GetMakeAppointmentCount,
	GetAdminCoach,
	GetGolfCurriculumByCoachID
}
