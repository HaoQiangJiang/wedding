const {
  formatTime,
} = require('../../utils/util')
const {
  createBill,
} = require('../../api/index')
import Toast from 'tdesign-miniprogram/toast/index';

Component({
  /**
   * Component properties
   */
  properties: {},

  /**
   * Component initial data
   */
  data: {
    price: 0,
    customer: '',
    selectGoods: [],
    selectGoodsText: '',
    dateVisible: '',
    dateText: formatTime(new Date(), 'YYYY-MM-DD HH:mm:ss'),
    date: new Date().getTime(), // 支持时间戳传入
    orderPrice: 0,
    recordTypeMap: [{
      label: '记账',
      value: 'record'
    }, {
      label: '退货',
      value: 'returnGoods'
    }],
    recordType: 'record',
  },
  pageLifetimes: {},
  /**
   * Component methods
   */
  methods: {
    changeRecordType(e) {
      const item = e.currentTarget.dataset.item
      this.setData({
        recordType: item.value
      })
    },
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
        url: '/pages/customer/index?mode=select',
      })
    },
    handleSelectGoods() {
      wx.navigateTo({
        url: '/pages/goods/index?mode=select',
        success: (res) => {
          res.eventChannel.emit('acceptDataFromOpenerPage', {
            data: this.data.selectGoods
          })
        }
      })
    },
    changePrice(data) {
      this.setData({
        price: Number(data.detail)
      })
    },
    closeBill() {
      this.triggerEvent('closeBill')
    },
    toastShow(message) {
      Toast({
        context: this,
        selector: '#t-toast',
        message
      })
    },
    async submitPrice() {
      // 提交账单
      const selectGoodsValues = Object.values(this.data.selectGoods)
      const products = selectGoodsValues.map(item => {
        return {
          id: item.id,
          number: item.count,
          price: item.isFactoryPrice ? item.factory_price : item.store_price
        }
      })
      const params = {
        "client_id": this.data.customer.id,
        "amount": this.data.orderPrice,
        "real_amount": this.data.recordType === 'record' ? this.data.price : -this.data.price,
        "pay_status": this.data.recordType === 'record' ? (this.data.price ? 1 : 0) : 2,
        "create_at": this.data.dateText,
        "remark": "",
        products
      }
      if (!params.client_id) {
        return this.toastShow("请选择客户")
      }
      if (params.products.length === 0) {
        return this.toastShow("请选择商品")
      }
      await createBill(params)
      this.triggerEvent('refreshBill')
      this.closeBill()
      // 刷新订单数
    },
  }
})