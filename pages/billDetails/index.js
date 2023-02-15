const {
  deleteBill
} = require("../../api/index");

Page({

  /**
   * Page initial data
   */
  data: {
    billData: {},
    deleteVisible: false,
    visible: false,
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
  // 提交账单
  closeBill() {
    this.setData({
      visible: false
    });
  },
  // 记一笔
  addBill() {
    this.setData({
      visible: true,
    })
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
    await deleteBill(this.data.billData.id)
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    wx.navigateBack({
      success: () => {
        prevPage.init()
      }
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