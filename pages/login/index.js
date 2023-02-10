// pages/login/index.js
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

  },
  getUserInfo() {
    wx.login({
      success: (data) => {
        if (data.code) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              wx.setStorage('userInfo', res.userInfo)
              wx.switchTab({
                url: '/pages/home/index',
              })
            }
          })
        }
      }
    })
    // wx.switchTab({
    //   url: '/pages/home/index',
    // })
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