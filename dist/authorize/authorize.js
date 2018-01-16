const util = require('../../utils/util');

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

function getOpenId() {
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
		  useUserInfo();
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
  if (wx.getStorageSync(util.data.userInfoStorage)) {
    // 打开授权设置
    openSetting().then((res) => {
      if (res.authSetting["scope.userInfo"]) {
        return getUserInfo();
      } else {
        obj.fail();
      }
    }).then(res => {
      obj.success();
    }, error => {
      obj.fail();
    });

  } else {
    // 获取用户信息
    getUserInfo().then((res) => {
      wx.setStorageSync(util.data.userInfoStorage, res);
      obj.success();
    }, (error) => {
      obj.fail();
      wx.setStorageSync("userInfoRefused", true);
    })
  }
}

function useUserInfo(obj) {
  if (wx.getStorageSync(util.data.userInfoStorage)) {
    obj.success();
  } else {
    checkUserInfo(obj);
  }
}

function getUserInfoSuccess(obj, userInfo) {
	// 保存用户信息
	const data = {
		wxpublic_id: util.data.appid,
		openId: wx.getStorageSync(util.data.openIdStorage),
		nickName: userInfo.nickName,
		avatarUrl: userInfo.avatarUrl,
	}
	// 获取userid
	request.SaveUserInfo(data).then(res => {
		wx.setStorageSync(userIdStorage, res.data)
		wx.removeStorageSync(openIdStorage)
		wx.removeStorageSync('userInfoRefused')
		obj.success();
	})
}

const authorize = {useUserInfo};

module.exports = {authorize};
