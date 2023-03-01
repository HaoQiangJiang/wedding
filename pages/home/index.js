// pages/home/index.js
const {
  login,
} = require('../../utils/login.js')
const {
  formateBillDetailsToEditBill
} = require('../../utils/util')
const {
  queryBillAmountAndCount,
  queryAllCustomer
} = require('../../api/index')
Page({
  data: {
    visible: false,
    recordVisible: false,
    allCustomer: [], // 所有账单信息
    todayBillAmount: 0, // 今日销售额
    todayBillCount: 0, // 今日订单数
    yesterdayBillAmount: 0, // 昨日销售额
    yesterdayBillCount: 0, // 昨日订单数
    isShowRecord: true, // 是否显示记录组件
  },

  /**
   * Lifecycle function--Called when page load
   */

  async init() {
    wx.showLoading({
      title: '加载中',
    })
    await this.initAllCustomer()
    await this.initBillAmountAndCount()
    wx.hideLoading()
  },
  async initBillAmountAndCount() {
    const {
      data
    } = await queryBillAmountAndCount()
    const {
      todayBillAmount,
      todayBillCount,
      yesterdayBillAmount,
      yesterdayBillCount
    } = data.data
    this.setData({
      todayBillAmount,
      todayBillCount,
      yesterdayBillAmount,
      yesterdayBillCount,
    })
  },
  async initAllCustomer() {
    const {
      data
    } = await queryAllCustomer()
    this.setData({
      allCustomer: data.data,
    })
  },
  onSelect(e) {
    const customerItem = e.currentTarget.dataset.item
    console.log(customerItem)
    wx.navigateTo({
      url: '/pages/customerBill/index?id=' + customerItem.id + '&name=' + customerItem.name,
    })
  },
  async onPullDownRefresh() {
    await this.init()
    wx.stopPullDownRefresh()
  },
  async onReachBottom() {},

  backLoginPage() {
    wx.redirectTo({
      url: '/pages/login/index',
    })
  },
  // 提交账单
  closeBill() {
    this.setData({
      visible: false
    });
    // 解决组件不重新渲染导致内容还在的问题
    setTimeout(() => {
      this.setData({
        isShowRecord: false
      })
    }, 240);
    setTimeout(() => {
      this.setData({
        isShowRecord: true
      })
    }, 241)
  },
  // 记一笔
  addBill(event) {
    this.setData({
      visible: true,
    })
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
    // 解决组件不重新渲染导致内容还在的问题
    setTimeout(() => {
      this.setData({
        isShowRecord: false
      })
    }, 240);
    setTimeout(() => {
      this.setData({
        isShowRecord: true
      })
    }, 241)
  },
  onLoad(options) {
    const retryLogin = async () => {
      const result = await login(this.backLoginPage)
      if (result) {
        this.init()
      }
    }
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (!res.data) {
          // 没有 token 登录
          retryLogin()
        } else {
          this.init()
        }
      },
      fail: () => {
        retryLogin()
      }
    })
  },

  onReady() {},

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
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})