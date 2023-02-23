const {
  logout,
} = require('../../utils/login')
const {
  diffTime
} = require('../../utils/util')
const {
  getUserInfo
} = require('../../api/index')
Page({
  data: {
    userInfo: {},
    createDay: 0,
    count:0
  },
  onShow() {
    this.getTabBar().init();
    this.updateUserInfo()
  },
  async updateUserInfo() {
    const resInfo = await getUserInfo()
    if (resInfo.data.code === 200) {
      const userInfo = resInfo.data.data
      // 将获取的用户信息保存
      wx.setStorageSync('userInfo', userInfo)
      this.setData({
        userInfo: {
          avatarUrl: userInfo.avatar_url,
          nickName: userInfo.name,
          phoneNumber: '',
        },
        count:userInfo.count,
        createDay: diffTime(userInfo.created_at)
      })
    }
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