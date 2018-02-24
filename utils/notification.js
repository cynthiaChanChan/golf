const request = require('../dist/request/request');
const util = require("./util");

function getType(time, openid, unionid) {
    var now = new Date().getTime();
    var sendtime = util.formatDate(time).getTime();
    //七天前移1小时
    if ((sendtime - now) < 7 * 24 * 60 * 60 * 1000 - 60 * 60 * 1000) {
        return { sendtype: 1, id: openid}
    } else {
        return { sendtype: 2, id: unionid}
    }
}

function conformSendType(sendtime, openid, unionid) {
    const sendtype = getType(sendtime, openid, unionid).sendtype;
    return sendtype;
}

function sendMessageUsingPlatform(course) {
    let param = {
        "touser": "",
        "template_id": "caoXojNBLpxErXpu-s9fo8i7mIxvGaWrj5zoT2iTj88",
        "miniprogram": {
            "appid": util.data.appid,
            "pagepath": "/pages/index/index"
        },
        "data": {
            "first": {
                "value": "您预约的课程即将开始！",
                "color": "#12898a"
            },
            "keyword1": {
                "value": course.content,
                "color": "#000"
            },
            "keyword2": {
                "value": `${course.date} ${course.what_time}`,
                "color": "#12898a"
            },
            "remark": {
                "value": "请现场出示验证码给工作人员",
                "color": "#000"
            }
        }
    }
    return param;
}

function CourseStartMessage(course, form_id, touser) {
    const data = {
        "keyword1": {
            "value": course.content,
            "color": "#40425d"
        },
        "keyword2": {
            "value": `${course.date} ${course.what_time}`,
            "color": "#12898a"
        },
        "keyword3": {
            "value": "请现场出示验证码给工作人员",
            "color": "#12898a"
        }
    };
    const param = {
        touser,
        template_id: "O7-SAdn0pSLOc3iQ968l_IdJFi_3h2PmLhfKOgu9xes",
        page: "/pages/index/index",
        form_id,
        data
    }
    return param
}

function bookedMessage(course, form_id, touser) {
    const data = {
        "keyword1": {
            "value": course.content,
            "color": "#40425d"
        },
        "keyword2": {
            "value": `${course.date} ${course.what_time}`,
            "color": "#12898a"
        },
        "keyword3": {
            "value": course.coach_name,
            "color": "#40425d"
        },
        "keyword4": {
            "value": '您已成功预约，请现场出示验证码给工作人员',
            "color": "#12898a"
        }
    };
    const param = {
        touser,
        template_id: "KKmG4EcPEkAMlBkWqZOJfsInD9saLi0RMcyOPQ9J6OQ",
        page: "/pages/index/index",
        form_id,
        data
    }
    return param
}

module.exports = {
    conformSendType,
    sendMessageUsingPlatform,
    CourseStartMessage,
    bookedMessage
};
