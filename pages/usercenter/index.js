import Dialog from 'tdesign-miniprogram/dialog/index';
const {
  checkIn
} = require('../../api/index')
const {
  logout
} = require('../../utils/login');
const {
  getUserInfo
} = require('../../api/index');

Page({
  data: {
    userInfo: {},
    score: 0,
    invite_count: 0,
  },
  onShow() {
    this.getTabBar().init();
    this.updateUserInfo();
  },
  async updateUserInfo() {
    const resInfo = await getUserInfo();
    if (resInfo.data.code === 200) {
      const userInfo = resInfo.data.data;
      // 将获取的用户信息保存
      wx.setStorageSync('userInfo', userInfo);
      this.setData({
        userInfo: {
          avatarUrl: userInfo.avatar_url,
          nickName: userInfo.name,
          phoneNumber: '',
        },
        score: userInfo.score,
        invite_count: userInfo.invite_count
      });
    }
  },
  acceptNotice() {
    wx.requestSubscribeMessage({
      tmplIds: ['JHT5ozDk1RGZcgkW8QmJV0zAJJfN8ubWNxMpDwqiXyw'],
      success: (res) => {
        console.log(res);
      },
      fail: (error) => {
        console.log(error);
      },
    });
  },
  share() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  async onCheckIn() {
    const {
      data
    } = await checkIn()
    wx.showToast({
      title: data.msg,
      icon: "none"
    })
  },
  logoutFn() {
    const dialogConfig = {
      context: this,
      title: '退出登录',
      content: '确定退出登录吗?',
      confirmBtn: '确定',
      cancelBtn: '取消',
    };

    Dialog.confirm(dialogConfig)
      .then(() => logout())
      .catch(() => console.log('点击了取消'))
      .finally(() => Dialog.close());
  },
  navigate(e) {
    const url = e.currentTarget.dataset.key;
    wx.navigateTo({
      url,
    });
  },
  navigatePay() {
    wx.navigateTo({
      url: '/pages/payConfig/index',
    });
  },
});