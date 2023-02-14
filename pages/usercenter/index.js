const {
  logout
} = require('../../utils/login')
Page({
  data: {
    userInfo: {},
  },
  onShow() {
    this.getTabBar().init();
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        this.setData({
          userInfo: {
            avatarUrl: res.data.avatar_url,
            nickName: res.data.name,
            phoneNumber: '',
          },
          currAuthStep: 3
        })
      }
    })
  },
  logoutFn() {
    logout()
  },
  navigate(e) {
    const url = e.currentTarget.dataset.key
    wx.navigateTo({
      url,
    })

  }

});