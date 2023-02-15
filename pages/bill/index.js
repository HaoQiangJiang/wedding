const {
  queryBillAmount
} = require('../../api/index')
Page({

  /**
   * Page initial data
   */
  data: {
    billId: '',
    payStatus: 1, // 0 未付款 1 已付款 2 已退货
    monthBillAmount: 0, // 月收益
    todayBillAmount: 0, // 今日收益
    totalBillAmount: 0, // 总收益
    yearBillAmount: 0, // 年收益
    yesterdayBillAmount: 0, // 昨日收益
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.initData()
  },
  async initData() {
    const {
      data
    } = await queryBillAmount()
    console.log(data)
    const {
      monthBillAmount,
      todayBillAmount,
      totalBillAmount,
      yearBillAmount,
      yesterdayBillAmount
    } = data.data
    this.setData({
      monthBillAmount,
      todayBillAmount,
      totalBillAmount,
      yearBillAmount,
      yesterdayBillAmount,
    })
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