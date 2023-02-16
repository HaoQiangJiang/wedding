const {
  queryBillAmount,
  queryAllBill
} = require('../../api/index')
Page({
  data: {
    isRefresh: true,
    billId: '',
    payStatus: 1, // 0 未付款 1 已付款 2 已退货
    monthBillAmount: 0, // 月收益
    todayBillAmount: 0, // 今日收益
    totalBillAmount: 0, // 总收益
    yearBillAmount: 0, // 年收益
    yesterdayBillAmount: 0, // 昨日收益
    page: 1,
    size: 10,
    total: 0,
    recordList: [], // 交易记录
    refresh: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {},
  async init() {
    wx.showLoading({
      title: '加载中',
    })
    await this.initBillAmount()
    await this.initRecord()
    wx.hideLoading()
  },
  async initBillAmount() {
    const {
      data
    } = await queryBillAmount()
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
  async initRecord() {
    const params = {
      "page": this.data.page,
      "size": this.data.size,
      "searchKey": "",
      "payStatus": this.data.payStatus
    }
    const {
      data
    } = await queryAllBill(params)
    if (this.data.page === 1) {
      // 首页全部替换数据
      this.setData({
        recordList: data.data.list,
        total: data.data.total
      })
    } else {
      this.setData({
        recordList: [...this.data.recordList, ...data.data.list],
        total: data.data.total
      })
    }

  },
  deleteItem(e) {
    // 删除 item
    const operateData = e.detail.data
    this.data.recordList = this.data.recordList.filter(item => item.id !== operateData.id)
    this.setData({
      recordList: this.data.recordList
    })
  },
  openFilter() {

  },
  async onTabsChange(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      payStatus: Number(e.detail.value),
      page: 1,

    })
    await this.initRecord()
    wx.hideLoading()
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
    if (!this.data.isRefresh) return
    this.init()
    this.setData({
      isRefresh: false
    })
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
  async onPullDownRefresh() {
    // 下拉刷新的时候还原 page
    this.setData({
      page: 1,
      noMore: false
    })
    await this.initRecord()
    await this.initBillAmount()
    this.setData({
      'refresh': false
    });
  },

  async onScrollTolower() {
    const {
      total,
      size,
      page
    } = this.data
    if (Math.ceil(total / size) <= page) {
      // 没要更多了
      this.setData({
        noMore: true,
      })
      return
    }
    this.setData({
      page: page + 1
    })
    this.initRecord()

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