import dayjs from 'dayjs';

const {
  queryBillAmount,
  queryAllBill
} = require('../../api/index')
const {
  formatTime,
  formatArrayByKey
} = require('../../utils/util')
Page({
  data: {
    billId: '',
    payStatus: 0, // 0 未付款 1 已付款 2 已退货
    monthBillAmount: 0, // 月收益
    todayBillAmount: 0, // 今日收益
    totalBillAmount: 0, // 总收益
    yearBillAmount: 0, // 年收益
    yesterdayBillAmount: 0, // 昨日收益
    recordList: [], // 交易记录
    filterVisible: false,
    dateVisible: false,
    minDate: dayjs().subtract(1, 'year').valueOf(),
    defaultValue: [new Date().getTime(), dayjs().add(1, 'day').valueOf()],
    filters: {
      customer: {},
      startTime: '',
      endTime: ''
    },
    isRefresh: false,
    activeValues: ''
  },

  async init() {
    wx.showLoading({
      title: '加载中',
    })
    await this.initBillAmount()
    await this.initRecord()
    wx.hideLoading()
  },
  async initBillAmount() {
    const {
      data
    } = await queryBillAmount()
    const {
      monthBillAmount,
      todayBillAmount,
      totalBillAmount,
      yearBillAmount,
      yesterdayBillAmount
    } = data.data
    this.setData({
      monthBillAmount,
      todayBillAmount,
      totalBillAmount,
      yearBillAmount,
      yesterdayBillAmount,
    })
  },
  async initRecord() {
    const params = {
      "startTime": this.data.filters.startTime,
      "clientId": this.data.filters.customer.id,
      "endTime": this.data.filters.endTime,
      "payStatus": this.data.payStatus
    }
    const {
      data
    } = await queryAllBill(params)
    const result = formatArrayByKey(data.data.list, 'client_id')
    console.log(result)
    // 首页全部替换数据
    this.setData({
      recordList: result
    })
  },
  handleChangeCollapse(e) {
    this.setData({
      activeValues: e.detail.value,
    });
  },
  async onTabsChange(e) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      payStatus: Number(e.detail.value),
    })
    await this.initRecord()
    this.setData({
      activeValues: ''
    })
    wx.hideLoading()
  },
  openDatePicker() {
    this.setData({
      dateVisible: true
    })
  },
  closeDatePicker() {
    this.setData({
      dateVisible: false
    })
  },
  datePickerVisibleChange(e) {
    const visible = e.detail.visible
    this.setData({
      dateVisible: visible
    })
  },
  handleDateConfirm(e) {
    const times = e.detail.value;
    const startTime = formatTime(times[0], 'YYYY-MM-DD')
    const endTime = formatTime(times[1], 'YYYY-MM-DD')
    this.setData({
      filters: {
        ...this.data.filters,
        startTime,
        endTime
      }
    })
  },
  openFilter() {
    this.setData({
      filterVisible: true
    })
  },
  closeFilter() {
    this.setData({
      filterVisible: false,
    })
  },
  canncelFilter() {
    this.setData({
      filters: {
        customer: {},
        startTime: '',
        endTime: ''
      }
    })
    this.submitFilter()
  },
  filterVisibleChange(e) {
    const visible = e.detail.visible
    this.setData({
      filterVisible: visible
    })
  },
  selectCustomer() {
    wx.navigateTo({
      url: '/pages/customer/index?mode=select',
      events: {
        selectCallBack: (data) => {
          this.setData({
            filters: {
              ...this.data.filters,
              customer: data
            }
          })
        }
      }
    })
  },

  async submitFilter() {
    wx.showLoading({
      title: '加载中',
    })
    await this.initRecord()
    wx.hideLoading()
    this.closeFilter()
  },

  onLoad() {
    this.init()
  },
  onReady() {},

  /**
   * Lifecycle function--Called when page show
   */
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
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    await this.init()
    wx.stopPullDownRefresh()
  },

  async onReachBottom() {},

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})