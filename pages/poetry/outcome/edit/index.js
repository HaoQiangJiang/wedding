// pages/poetry/outcome/edit/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    colorMap: ['#000000', '#242823', '#505462', '#7f818a', '#afb1b8', '#e9eaef', '#f3f4f7', '#ffffff', '#5560f7'],
    outcome: '',
    customColor: '#505462'
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.setData({
      outcome: options.outcome,
      customColor: options.customColor
    })
  },
  onInput(e) {
    this.setData({
      outcome: e.detail.value
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('setEditResult', {
      data: e.detail.value
    })

  },
  selectColor(e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      customColor: item
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('setEditColor', {
      data: item
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