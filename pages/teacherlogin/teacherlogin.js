const util = require("../../utils/util");
const request = require('../../dist/request/request');
Page({
    data: {
        img: util.data.img,
        userInput: "",
        passwordInput: "",
        isHintHidden: true
    },
    onLoad() {

    },
    init() {

    },
    goIntro() {
        wx.navigateTo({
        url: "../faq/faq"
        })
    },
    openLoginBox() {
        this.setData({
            isHintHidden: false
        })
    },
    userInput(e) {
        this.setData({
            userInput: e.detail.value
        })
    },
    passwordInput(e) {
        this.setData({
            passwordInput: e.detail.value
        })
    },
    login() {
        const name = this.data.userInput.trim();
        const password = this.data.passwordInput.trim();
        if(this.checkEmpty(name, password)) {
            return;
        }
        // 缓存登录数据
        request.GetAdminCoach(name, password).then((res) => {

        })
        wx.setStorageSync('golfLogin', {name, password});
        wx.redirectTo({
            url: "../cms/cms"
        })
    },
    checkEmpty(name, password) {
        let hintText = "";
        if (!name && !password) {
            hintText = "请填写用户名与密码";
        } else if (!name) {
            hintText = "请填写用户名";
        } else if (!password) {
            hintText = "请填写密码";
        }
        if (hintText) {
            util.alert(hintText);
            return true;
        }
    }
})
