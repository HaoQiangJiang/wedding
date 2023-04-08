// pages/painting/example/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    list: []
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad() {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptData', (data) => {
      this.setData({
        list: data.data
      })
    })
  },

  open(e) {
    wx.vibrateShort()
    const item = e.currentTarget.dataset.item
    const index = e.currentTarget.dataset.index
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectExample', {
      data: item,
      index
    })
    wx.navigateBack()
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