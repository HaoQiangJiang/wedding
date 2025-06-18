// pages/painting/example/index.js
const {
  photoList
} = require('../../mock/photo.js')
Page({

  /**
   * Page initial data
   */
  data: {
    list: photoList
  },

  /**
   * Lifecycle function--Called when page load
   */


  open(e) {
    wx.vibrateShort()
    wx.previewImage({
      urls: photoList,
      current: e.target.dataset.index,
      showmenu: true
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