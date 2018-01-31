const request = require('../dist/request/request');
const util = require("./util");

function isUserFollowed(unionid) {
    request.ValidateUserOpenid(unionid).then((res) => {

    })
}

module.exports = {
    isUserFollowed
};
