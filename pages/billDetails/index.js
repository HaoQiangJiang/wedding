const {
  deleteBill,
  queryBillById,
  updateBill
} = require("../../api/index");
const {
  formateBillDetailsToEditBill
} = require('../../utils/util')
import Dialog from 'tdesign-miniprogram/dialog/index';

Page({

  /**
   * Page initial data
   */
  data: {
    isOverShare: true,
    billData: {},
    deleteVisible: false,
    visible: false,
    isShowRecord: true,

  },
  // 刷新订单
  async refreshBill() {
    wx.showLoading({
      title: '修改中',
    })
    const {
      data
    } = await queryBillById(this.data.billData.id)
    this.setData({
      billData: data.data
    })
    wx.hideLoading()
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    // await deleteBill(this.data.billData.id)
    prevPage.updateItem({
      detail: {
        data: this.data.billData
      }
    })
  },

  // 提交账单
  closeBill() {
    this.setData({
      visible: false
    });
  },
  // 转为已付
  async transformPay() {
    this.data.billData.pay_status = 1
    await updateBill(this.data.billData.id, this.data.billData)
    this.refreshBill()
  },
  // 记一笔
  addBill() {
    this.setData({
      visible: true,
    })
    this.setRecord(this.data.billData)

  },
  setRecord(data) {
    const recordComponent = this.selectComponent('#record')
    recordComponent.setData(formateBillDetailsToEditBill(data))
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },

  openDelete() {
    this.setData({
      deleteVisible: true
    })
  },
  closeDelete() {
    this.setData({
      deleteVisible: false
    })
  },
  // 确定删除
  async submitDelete() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    await deleteBill(this.data.billData.id)
    prevPage.deleteItem({
      detail: {
        data: this.data.billData
      }
    })
    wx.navigateBack()
  },

  onLoad(option) {
    const eventChannel = this.getOpenerEventChannel()
    if (!eventChannel) return;
    eventChannel.on('acceptBillData', (data) => {
      this.setData({
        billData: data.data
      })
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
    return {
      title: '您有一份新账单请注意查收',
      path: '/pages/share/index?id=' + this.data.billData.id,
    }
  }
})