// pages/login/index.js
const {
  login,
} = require('../../utils/login.js')
Page({

  /**
   * Page initial data
   */
  data: {

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    // 获取 userInfo, 如果存在则直接跳到首页
    wx.getStorage({
      key: 'userInfo',
      success: (userInfo) => {
        if (userInfo.data.id) {
          wx.switchTab({
            url: '/pages/home/index',
          })
        }
      }
    })

  },
  getUserInfo() {
    login(this.loginFail)
  },
  loginFail() {
    wx.showToast({
      title: '登录失败,请重试',
    })
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})