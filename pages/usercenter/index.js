const {
  isMoreThan24Hours
} = require('../../utils/util');
const {
  checkIn,
  getUserInfo
} = require('../../api/index');

Page({
  data: {
    userCardConfig: {
      name: '',
      avatar: '',
      isSign: false,
    },
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    id: '',
    score: 0,
    invite_count: 0,
    share_count: 0
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
      this.setData({
        userCardConfig: {
          name: userInfo.name,
          avatar: userInfo.avatar_url,
          enabledSign: isMoreThan24Hours(userInfo.sign_time)
        },
        id: userInfo.id,
        score: userInfo.score,
        invite_count: userInfo.invite_count,
        share_count: userInfo.share_count
      });
    }
  },
  share() {
    wx.vibrateShort()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  openAD() {
    wx.vibrateShort()
    wx.showToast({
      title: '广告开发中...',
      icon: 'none'
    })
  },
  copyId() {
    wx.setClipboardData({
      data: this.data.id,
    })
  },
  logoutFn() {
    wx.vibrateShort()
    wx.showModal({
      title: '退出登录',
      content: '确定退出登录吗',
      complete: (res) => {
        if (res.confirm) {
          wx.setStorageSync('token', '')
          wx.setStorageSync('userInfo', {})
          wx.navigateTo({
            url: '/pages/login/index',
          })
        }
      }
    })
  },
  gotoUserEditPage() {
    wx.navigateTo({
      url: '/pages/editUserInfo/index',
    })
  },
  async onCheckIn() {
    wx.vibrateShort()
    const {
      data
    } = await checkIn()
    wx.showToast({
      title: data.code === 200 ? '签到成功' : data.msg,
      icon: "none"
    })
    this.setData({
      userCardConfig: {
        ...this.properties.userCardConfig,
        enabledSign: false
      }
    })
    // 刷新个人信息
    getUserInfo()
  },
  onShareAppMessage() {}
});