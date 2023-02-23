const {
  queryAllBill,
} = require('../../api/index')
const {
  formatTime
} = require('../../utils/util')
import dayjs from 'dayjs';
Page({

  /**
   * Page initial data
   */
  data: {
    isOverShare: true,
    page: 1,
    size: 10,
    total: 0,
    client: '',
    list: [],
    totalPrice: 0,
    noMore: false,
    startTime: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endTime: formatTime(new Date(), 'YYYY-MM-DD'),
    dateVisible: false,
    minDate: dayjs().subtract(1, 'year').valueOf(),
    defaultValue: [dayjs().subtract(1, 'month').valueOf(), new Date().getTime()],
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
  back() {
    wx.navigateBack()
  },
  async init() {
    // 根据客户查询所有账单
    wx.showLoading({
      title: '加载中',
    })
    const params = {
      "page": this.data.page,
      "size": this.data.size,
      "clientId": this.data.client.id,
      "payStatus": -1,
    }
    if (this.data.startTime && this.data.endTime) {
      params.startTime = this.data.startTime
      params.endTime = this.data.endTime
    }
    const {
      data
    } = await queryAllBill(params)
    const {
      list
    } = data.data
    let result = []
    if (this.data.page === 1) {
      result = data.data.list
    } else {
      result = [...this.data.list, ...data.data.list]
    }
    let totalPrice = 0
    result.forEach(item => {
      totalPrice += item.real_amount
      item.accumulate = totalPrice
    })
    this.setData({
      list: result,
      total: data.data.total,
      totalPrice
    })
    wx.hideLoading()
  },
  openDetails(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: '/pages/billDetails/index',
      success: (res) => {
        res.eventChannel.emit('acceptBillData', {
          data: item
        })
      }
    })
  },
  handleDateConfirm(e) {
    const times = e.detail.value;
    const startTime = formatTime(times[0], 'YYYY-MM-DD')
    const endTime = formatTime(times[1], 'YYYY-MM-DD')
    this.setData({
      startTime,
      endTime,
      page: 1
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
  deleteItem(e) {
    // 删除 item
    const operateData = e.detail.data
    this.data.list = this.data.list.filter(item => item.id !== operateData.id)
    this.setData({
      list: this.data.list
    })
  },
  updateItem(e) {
    const operateData = e.detail.data
    const listIndex = this.data.list.findIndex(item => item.id === operateData.id)
    this.data.list.splice(listIndex, 1, operateData)
    this.setData({
      list: this.data.list
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
    this.setData({
      page: 1,
      noMore: false
    })
    this.init()
    wx.stopPullDownRefresh()
  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {
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
    this.init()
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