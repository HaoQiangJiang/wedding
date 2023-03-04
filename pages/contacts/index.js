const {
  queryAllBill,
} = require('../../api/index')
const {
  formatTime
} = require('../../utils/util')
const Decimal = require('decimal.js');
import dayjs from 'dayjs';

Page({
  data: {
    isOverShare: true,
    client: '',
    list: [],
    totalPrice: 0,
    totalPaid:0, // 所有已付
    noMore: false,
    startTime: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endTime: formatTime(new Date(), 'YYYY-MM-DD'),
    dateVisible: false,
    minDate: dayjs().subtract(1, 'year').valueOf(),
    defaultValue: [dayjs().subtract(1, 'month').valueOf(), new Date().getTime()],
    activeValues: [],
    isRefresh: false,
  },
  onLoad(options) {
    // 接受上一页传来的客户 id
    const eventChannel = this.getOpenerEventChannel()
    if (!eventChannel) return;
    eventChannel.on('acceptBillData', (data) => {
      wx.setNavigationBarTitle({
        title: data.data.client.name + '的账单'
      })
      const submitData = {
        client: data.data.client,
      }
      let startTime = '',
        endTime = ''
      if (data.data.date) {
        startTime = data.data.date + '-01'
        endTime = dayjs(data.data.date).add(1, 'month').format('YYYY-MM-DD')
        submitData.startTime = startTime
        submitData.endTime = endTime
      }
      this.setData(submitData)

      this.init()
    })
  },
  handleChange(e) {
    this.setData({
      activeValues: e.detail.value,
    });
  },
  back() {
    wx.navigateBack()
  },
  async init() {
    // 根据客户查询所有账单
    wx.showLoading({
      title: '加载中',
    })
    const params = {
      "clientId": this.data.client.id,
      "payStatus": 0,
    }
    if (this.data.startTime && this.data.endTime) {
      params.startTime = this.data.startTime
      params.endTime = this.data.endTime
    }
    const {
      data
    } = await queryAllBill(params)
    let result = data.data.list
    let totalPrice = 0
    let totalPaid = 0
    const resultReverse = JSON.parse(JSON.stringify(result)).reverse()
    const resultLegnth = result.length - 1
    resultReverse.forEach((item, index) => {
      totalPrice = new Decimal(item.real_amount).add(totalPrice).toNumber()
      totalPaid = new Decimal(item.paid_amount).add(totalPaid).toNumber()
      const noReverseIndex = resultLegnth - index
      result[noReverseIndex].accumulate = totalPrice
    })
    this.setData({
      list: result,
      totalPrice,
      totalPaid
    })
    wx.hideLoading()
  },
  handleDateConfirm(e) {
    console.log(e)
    const times = e.detail.value;
    const startTime = formatTime(times[0], 'YYYY-MM-DD')
    let endTime = ''
    if (times.length === 1) {
      // 只选择了一个日期
      endTime = startTime
    } else {
      // 选择了两个如期
      endTime = formatTime(times[1], 'YYYY-MM-DD')
    }
    this.setData({
      startTime,
      endTime,
    })
    this.init()
  },
  closeDatePicker() {
    this.setData({
      dateVisible: false
    })
  },
  openDatePicker() {
    this.setData({
      dateVisible: true
    })
  },
  setPrevPageRefresh() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      isRefresh: true
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
    if (this.data.isRefresh) {
      this.init()
      this.setData({
        isRefresh: false
      })
      this.setPrevPageRefresh()
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
      title: this.data.client.name + '的账单请查收',
      path: `/pages/shareContacts/index?uid=${this.data.client.user_id}&cid=${this.data.client.id}&startTime=${this.data.startTime}&endTime=${this.data.endTime}`,
    }
  }
})