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
    wx.vibrateShort({
      type: 'medium',
    })
    const item = e.currentTarget.dataset.item
    console.log(this.data.list)
    const index = e.currentTarget.dataset.index
    wx.previewImage({
      current: item.image, // 当前显示图片的http链接
      urls: this.data.list.map(item => item.image)
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