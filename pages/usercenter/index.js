const {
  getUserInfo
} = require('../../api/index');

Page({
  data: {
    userInfo: {},
    score: 0,
    invite_count: 0,
    share_count: 0,
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
        invite_count: userInfo.invite_count,
        share_count: userInfo.share_count
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
  openAD() {
    wx.showToast({
      title: '广告开发中...',
      icon: 'none'
    })
  },
  logoutFn() {
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

    // Dialog.confirm(dialogConfig)
    //   .then(() => logout())
    //   .catch(() => console.log('点击了取消'))
    //   .finally(() => Dialog.close());
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
  onShareAppMessage() {}
});