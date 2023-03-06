const {
  getShareBill,
} = require('../../api/index')
const {
  checkLogin
} = require('../../utils/login')
const Decimal = require('decimal.js');
Page({
  data: {
    list: [],
    totalPrice: 0,
    totalPaid: 0,
    uid: '',
    cid: '',
    startTime: '',
    endTime: '',
    user: {},
    activeValues: []
  },

  async onLoad(options) {
    await checkLogin()
    this.init(options)
  },
  handleChange(e) {
    this.setData({
      activeValues: e.detail.value,
    });
  },
  async init(params) {
    // 根据客户查询所有账单
    wx.showLoading({
      title: '加载中',
    })
    const {
      uid,
      cid,
      startTime,
      endTime
    } = params || this.data
    const {
      data
    } = await getShareBill(uid, cid, startTime, endTime)
    let totalPrice = 0
    let totalPaid = 0
    const resultReverse = JSON.parse(JSON.stringify(data.data.list)).reverse()
    const resultLegnth = data.data.list.length - 1
    resultReverse.forEach((item, index) => {
      totalPrice = new Decimal(item.real_amount).add(totalPrice).toNumber()
      totalPaid = new Decimal(item.paid_amount).add(totalPaid).toNumber()
      const noReverseIndex = resultLegnth - index
      data.data.list[noReverseIndex].accumulate = totalPrice
    })

    const {
      list
    } = data.data
    if (list.length > 0) {
      wx.setNavigationBarTitle({
        title: list[0]?.client.name + '的账单'
      })
    }

    // 首页全部替换数据
    this.setData({
      list: data.data.list,
      totalPrice,
      totalPaid,
      uid,
      cid,
      startTime,
      endTime,
      user: data.data.user
    })
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
    this.init()
    wx.stopPullDownRefresh()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    return {
      title: this.data.client.name + '的账单请查收',
      path: `/pages/shareContacts/index?uid=${this.data.uid}&cid=${this.data.cid}&startTime=${this.data.startTime}&endTime=${this.data.endTime}`,
    }

  }
})