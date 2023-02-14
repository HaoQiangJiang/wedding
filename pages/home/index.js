// pages/home/index.js
const {
  login,
} = require('../../utils/login.js')
Page({

  /**
   * Page initial data
   */
  data: {
    visible: false,
    refresh: false,

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (!res.data) {
          // 没有 token 登录
          login(this.backLoginPage)
        }
      }
    })
  },
  onPullDownRefresh() {
    setTimeout(() => {
      this.setData({
        'refresh': false
      });
    }, 1000);
  },
  onScroll(e) {
    const {
      scrollTop
    } = e.detail;

  },
  backLoginPage() {
    wx.redirectTo({
      url: '/pages/login/index.js',
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
    this.getTabBar().init();
  },
  // 提交账单
  closeBill() {
    this.setData({
      visible: false
    });
  },
  setRecord(data) {
    const pages = getCurrentPages();
    const recordComponent = pages[0].selectComponent('#record')
    console.log(recordComponent, data)
    recordComponent.setData({
      selectGoodsText: data.selectGoodsText || '',
      selectGoods: data.selectGoods || [],
      orderPrice: data.orderPrice || 0,
      price: data.price || 0
    })
  },
  // 记一笔
  addBill(event) {
    this.setData({
      visible: true,
    })
    wx.nextTick(() => {
      const {
        setData
      } = event.detail
      if (setData) {
        this.setRecord(setData)
      }
    })




  },
  closeRecord() {

  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
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
    console.log('pull')
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