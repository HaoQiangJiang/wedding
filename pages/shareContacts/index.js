const {
  getShareBill,
} = require('../../api/index')
Page({

  /**
   * Page initial data
   */
  data: {
    list: [],
    totalPrice: 0,
    uid: '',
    cid: '',
    startTime: '',
    endTime: '',
    user:{}
  },

  onLoad(options) {
    // 接受上一页传来的客户 id
    console.log(options)

    this.init(options)
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
    } = params
    const {
      data
    } = await getShareBill(uid, cid, startTime, endTime)
    let totalPrice = 0
    data.data.list.forEach(item => {
      totalPrice += item.real_amount
    })
    wx.setNavigationBarTitle({
      title: data.data.list[0].client.name + '的账单'
    })
    // 首页全部替换数据
    this.setData({
      list: data.data.list,
      totalPrice,
      uid,
      cid,
      startTime,
      endTime,
      user:data.data.user
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
  onPullDownRefresh() {},

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