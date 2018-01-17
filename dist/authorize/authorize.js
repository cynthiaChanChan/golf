const util = require('../../utils/util');
const request = require('../request/request');

function getUserInfo() {
  return  new Promise((resolve, reject) => {
      wx.getUserInfo({
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
  })
}

function login() {
  return  new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
  })
}

function getOpenId(obj) {
   // 获取code
   login().then((res) => {
      // 获取openid
      const data = {
        id: util.data.appid,
        js_code: res.code
      }
      return request.GetSessionKey(data);
   }).then(res => {
      const openId = JSON.parse(res).openid;
      wx.setStorageSync(util.data.openIdStorage, openId);
      // 获取用户信息
		  checkUserInfo(obj);
   })
}

function openSetting() {
  return  new Promise((resolve, reject) => {
      wx.openSetting({
        success: (res) => {
          resolve(res)
        },
        fail: (res) => {
          reject(res)
        }
      })
  })
}

function checkUserInfo(obj) {
  if (wx.getStorageSync("userInfoRefused")) {
    // 打开授权设置
    openSetting().then((res) => {
      if (res.authSetting["scope.userInfo"]) {
        return getUserInfo();
      } else {
        obj.fail();
      }
    }).then(res => {
      getUserInfoSuccess(res.userInfo, obj);
    }, error => {
      obj.fail();
    });

  } else {
    // 获取用户信息
    getUserInfo().then((res) => {
      getUserInfoSuccess(res.userInfo, obj);
    }, (error) => {
      obj.fail();
      wx.setStorageSync("userInfoRefused", true);
    })
  }
}

function useUserInfo(obj) {
  if (wx.getStorageSync(util.data.userIdStorage)) {
    obj.success();
  } else if (wx.getStorageSync(util.data.openIdStorage)){
    checkUserInfo(obj);
  } else {
    getOpenId(obj);
  }
}

function getUserInfoSuccess(userInfo, obj) {
	// 保存用户信息
	const data = {
		wxpublic_id: util.data.appid,
		openId: wx.getStorageSync(util.data.openIdStorage),
		nickName: userInfo.nickName,
		avatarUrl: userInfo.avatarUrl,
	}
	// 获取userid
	 request.saveUserInfo(data).then(res => {
		 wx.setStorageSync(util.data.userIdStorage, res.data)
		 wx.removeStorageSync(util.data.openIdStorage);
		 wx.removeStorageSync('userInfoRefused')
		 obj.success();
	})
}

const authorize = {useUserInfo};

module.exports = {authorize};
