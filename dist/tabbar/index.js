const util = require('../../utils/util');

const _tabbar_ = {
  home: {
		icon: 'i-home',
		text: '首页',
		page: 'index',
	},
	personal: {
		icon: 'i-personal',
		text: '我的',
		page: 'personal',
	},
	contact: {
		icon: 'i-contact',
		text: '客服',
	},
    appid: util.data.appid
}

function goPage(e) {
	const { page } = e.currentTarget.dataset
	if (this.data._tabbar_.current == page) {
    return;
  }
	util.goPage(e)
}

function noop() {
	return
}


function setTabs() {
  const tabs = ['home', 'personal', 'contact'];
  const arr = [];
  for (let value of tabs) {
    const tab = _tabbar_[value];
    if (_tabbar_.current == tab.page) {
      tab.active = _tabbar_.current;
      tab.img = `../../images/${tab.icon}-active.png`;
    } else {
      tab.active = "";
      tab.img = `../../images/${tab.icon}.png`;
    }
    arr.push(tab);
  }
  _tabbar_.tabs = arr;
}

function Tabbar() {
  const pages = getCurrentPages();
	const _this = pages[pages.length - 1];
  _this.goPage = goPage;
  _this.noop = noop;
  _tabbar_.current = _this.route.split('/')[2];
  setTabs();
  _this.setData({ _tabbar_ });
}


module.exports = {Tabbar};
