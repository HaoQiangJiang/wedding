// pages/home/index.js
const {
  login,
} = require('../../utils/login.js')
const {
  formatArrayByKey,
  mergeArrayByKey,
  formateBillDetailsToEditBill
} = require('../../utils/util')
const {
  queryAllBill,
  queryBillAmountAndCount
} = require('../../api/index')
Page({
  data: {
    visible: false,
    recordVisible: false,
    refresh: false,
    allBill: [], // 所有账单信息
    page: 1,
    size: 10,
    total: 0,
    noMore: false, // 没要更多了
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
    await this.initAllBill()
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
        allBill: mergeArrayByKey(this.data.allBill, result),
        total: data.data.total
      })
    }

  },
  async onPullDownRefresh() {
    // 下拉刷新的时候还原 page
    this.setData({
      page: 1,
      noMore: false
    })
    await this.init()
    wx.stopPullDownRefresh()
  },
  async onReachBottom() {
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
      page: page + 1,
    })
    this.initAllBill()
  },
  onPageScroll(e) {
    if (e.scrollTop <= 0) {
      this.setData({
        isFixed: false
      })
    } else {
      this.setData({
        isFixed: true,
      })
    }
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
  },
  setRecord(data) {
    const recordComponent = this.selectComponent('#record')
    recordComponent.setData(
      formateBillDetailsToEditBill(data)
    )
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