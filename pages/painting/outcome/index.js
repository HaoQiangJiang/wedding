// 
Page({
  data: {
    outcome: [],
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptOutcome', (data) => {
      console.log(data)
      this.setData({
        outcome: data.outcome
      })
    })
  },
  previewImage(e) {
    const {
      image
    } = e.currentTarget.dataset
    console.log(e)
    wx.previewImage({
      urls: [image],
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