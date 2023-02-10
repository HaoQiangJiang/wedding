// pages/billDetails/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    billData: {},
    deleteVisible: false,
    isEdit: false, // 是否为编辑态
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

  openEdit() {
    this.setData({
      isEdit: true
    })
  },
  closeEdit() {
    this.setData({
      isEdit: false
    })
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
  submitDelete() {

  },
  edit() {

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