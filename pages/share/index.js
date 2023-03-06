const {
  getShareBillDetails
} = require('../../api/index')
const {
  checkLogin
} = require('../../utils/login')
Page({

  /**
   * Page initial data
   */
  data: {
    billData: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  async onLoad(options) {
    await checkLogin()
    this.init(options.id)
  },

  async init(id) {
    const {
      data
    } = await getShareBillDetails(id)
    this.setData({
      billData: data.data
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