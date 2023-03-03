const {
  formatArrayByKey,
} = require('../../utils/util')
const {
  queryAllBill,
  multiRepayment,
  getUnPayMoney
} = require('../../api/index')
Page({
  data: {
    visible: false,
    recordVisible: false,
    isRefresh: false,
    allBill: [], // 所有账单信息
    clientId: '', // 当前用户的 id
    repayVisible: false,
    fabButton: {
      disabled: false
    }
  },

  async init() {
    wx.showLoading({
      title: '加载中',
    })
    const params = {
      "clientId": this.data.clientId,
      "payStatus": -1 // -1 查全部
    }
    const {
      data
    } = await queryAllBill(params)
    const result = formatArrayByKey(data.data.list, 'created_at')
    console.log(result)
    this.setData({
      allBill: result,
    })
    await this.getNoPayMoney()
    wx.hideLoading()
  },
  async getNoPayMoney() {
    const {
      data
    } = await getUnPayMoney({
      "client_id": this.data.clientId
    })
    this.setData({
      maxPay: data.data.total_amount,
      fabButton: {
        disabled: data.data.total_amount <= 0
      }
    })
  },

  async onPullDownRefresh() {
    await this.init()
    wx.stopPullDownRefresh()
  },
  closeRepay() {
    this.setData({
      repayVisible: false,
    })
  },
  openRepay() {
    this.setData({
      repayVisible: true,
    })
  },
  async submitRepay(e) {
    const {
      partPay,
      remark,
    } = e.detail
    const params = {
      "client_id": this.data.clientId,
      "repayment_amount": Number(partPay),
      remark,
    }
    await multiRepayment(params)
    this.init()
    this.setPrevPageRefresh()
  },

  onLoad(options) {
    const id = options.id
    const name = options.name
    this.setData({
      clientId: id
    })
    wx.setNavigationBarTitle({
      title: name + '的账单详情'
    })
    this.init()
  },
  setPrevPageRefresh() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      isRefresh: true
    })
  },
  onReady() {},

  onShow() {
    if (this.data.isRefresh) {
      this.init()
      this.setData({
        isRefresh: false
      })
      this.setPrevPageRefresh()
    }
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
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})