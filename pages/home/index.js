// pages/home/index.js
const {
  login,
} = require('../../utils/login.js')
const {
  formatArrayByKey
} = require('../../utils/util')
const {
  queryAllBill,
  queryBillAmountAndCount
} = require('../../api/index')
Page({

  /**
   * Page initial data
   */
  data: {
    visible: false,
    recordVisible: false,
    refresh: false,
    allBill: [], // 所有账单信息
    page: 1,
    size: 20,
    total: 0,
    noMore: false, // 没要更多了
    todayBillAmount: 0, // 今日销售额
    todayBillCount: 0, // 今日订单数
    yesterdayBillAmount: 0, // 昨日销售额
    yesterdayBillCount: 0, // 昨日订单数
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
        } else {
          this.init()
        }
      }
    })
  },
  init() {
    this.initAllBill()
    this.initBillAmountAndCount()
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
  async initAllBill() {
    const params = {
      "page": this.data.page,
      "size": this.data.size,
      "payStatus": -1 // -1 查全部
    }
    const {
      data
    } = await queryAllBill(params)
    const result = formatArrayByKey(data.data.list, 'created_at')
    if (this.data.page === 1) {
      // 首页全部替换数据
      this.setData({
        allBill: result,
        total: data.data.total
      })
    } else {
      this.setData({
        allBill: [...this.data.allBill, ...result],
        total: data.data.total
      })
    }

  },
  async onPullDownRefresh() {
    // 下拉刷新的时候还原 page
    console.log('refreshBill')
    this.setData({
      page: 1,
      noMore: false
    })
    await this.initAllBill()
    await this.initBillAmountAndCount()
    setTimeout(() => {
      this.setData({
        'refresh': false
      });
    }, 500);
  },
  async onScrollTolower() {
    const {
      total,
      size,
      page
    } = this.data
    if (Math.ceil(total / size) <= page) {
      // 没要更多了
      this.setData({
        noMore: true,
      })
      return
    }
    this.setData({
      page: page + 1
    })
    this.initAllBill()

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
    const recordComponent = this.selectComponent('#record')
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
  closeRecord() {},
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