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
  acceptNotice() {
    wx.requestSubscribeMessage({
      tmplIds: [
        "JHT5ozDk1RGZcgkW8QmJV2GEbih53tSvAnYJWwm8sjg"
      ],
      success: (res) => {
        console.log(res)
      },
      fail: (error) => {
        console.log(error)
      },
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
  },
  navigatePay() {
    wx.navigateTo({
      url: '/pages/payConfig/index'
    })
  }

});