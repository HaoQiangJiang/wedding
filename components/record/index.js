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
    goods:'',
    dateVisible: '',
    dateText: '',
    date: new Date('2021-12-23').getTime(), // 支持时间戳传入
    // 指定选择区间起始值
    start: '2000-01-01 00:00:00',
    end: '2030-09-09 12:12:12',
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
      })
    },
    changePrice(data) {
      this.setData({
        price: data.detail
      })
    },
    submitPrice() {
      console.log('submit')
    },
  }
})