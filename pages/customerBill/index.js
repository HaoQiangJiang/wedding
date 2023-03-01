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
    refresh: false,
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
  // 删除 item
  deleteItem(e) {
    const operateData = e.detail.data
    const index = this.data.allBill.findIndex(item => item.date === operateData.created_at.split(' ')[0])
    const operateList = this.data.allBill[index]
    if (!operateList) return
    operateList.list = operateList.list.filter(item => item.id !== operateData.id)
    if (operateList.list.length === 0) {
      this.data.allBill.splice(index, 1)
    }
    this.setData({
      allBill: this.data.allBill
    })
  },
  // 更新 item
  updateItem(e) {
    const operateData = e.detail.data
    const index = this.data.allBill.findIndex(item => item.date === operateData.created_at.split(' ')[0])
    const operateList = this.data.allBill[index]
    if (!operateList) return
    const listIndex = operateList.list.findIndex(item => item.id === operateData.id)
    operateList.list.splice(listIndex, 1, operateData)
    this.setData({
      allBill: this.data.allBill
    })
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
      partPay
    } = e.detail
    const params = {
      "client_id": this.data.clientId,
      "repayment_amount": Number(partPay)
    }
    await multiRepayment(params)
    this.init()
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

  onReady() {},

  onShow() {},
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