const {
  formatTime,
} = require('../../utils/util')
// components/record/index.js
Component({
  /**
   * Component properties
   */
  properties: {

  },
  /**
   * Component initial data
   */
  data: {
    price: 0,
    customer: '',
    selectGoods: [],
    selectGoodsText: '',
    dateVisible: '',
    dateText: formatTime(new Date(), 'YYYY-MM-DD HH:mm'),
    date: new Date().getTime(), // 支持时间戳传入
    orderPrice: 0,
  },
  pageLifetimes: {},
  /**
   * Component methods
   */
  methods: {
    showPicker(e) {
      this.setData({
        dateVisible: true,
      });
    },
    hidePicker() {
      this.setData({
        dateVisible: false
      })
    },
    onConfirm(e) {
      const {
        value
      } = e?.detail;
      this.setData({
        dateText: value,
      });
      this.hidePicker();
    },

    selectCustomer() {
      wx.navigateTo({
        url: '/pages/customer/index',
      })
    },
    selectGoods() {
      wx.navigateTo({
        url: '/pages/goods/index',
        success: (res) => {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            data: this.data.selectGoods
          })
        }
      })
    },
    changePrice(data) {
      this.setData({
        price: data.detail
      })
    },
    submitPrice() {
      this.triggerEvent('submitBill')
      // 重置数据防止下次弹出存在旧数据
      this.setData({
        customer: '',
        selectGoods: [],
        selectGoodsText: '',
        dateText: formatTime(new Date(), 'YYYY-MM-DD HH:mm'),
        date: new Date().getTime(),
        orderPrice: 0,
        price: 0
      })
    },
  }
})