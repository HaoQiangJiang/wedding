const {
  getAllBills
} = require('../../api/index')
Page({

  /**
   * Page initial data
   */
  data: {
    billId: '',
    payStatus: 1, // 0 未付款 1 已付款 2 已退货
    filter: {
      searchKey: '',
      startTime: '',
      endTime: '',
      page: 1,
      size: 100,
      payStatus: "0"
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.queryAllBills()
  },
  async queryAllBills() {
    const data = await getAllBills(this.filter)
    console.log(data)
  },
  openFilter() {

  },
  onTabsChange(e) {
    console.log(e)
    this.setData({
      payStatus: e.detail.value
    })
    this.queryAllBills()
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
    this.getTabBar().init();
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