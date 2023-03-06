// pages/home/index.js
const {
  queryBillAmountAndCount,
  queryAllCustomer
} = require('../../api/index')

import {
  checkLogin
} from '../../utils/login'

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
    isRefresh: false, // 是的需要刷新
  },

  /**
   * Lifecycle function--Called when page load
   */

  async init() {
    await checkLogin()
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
    console.log(data)
    if (!data.data) return
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
    this.init()
  },

  onReady() {},

  onShow() {
    this.getTabBar().init();
    if (this.data.isRefresh) {
      // 需要刷新
      this.init()
      this.setData({
        isRefresh: false
      })
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