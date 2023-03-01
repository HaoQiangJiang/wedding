// components/repayDialog/index.js
const {
  isNumber
} = require('../../utils/util')
Component({
  /**
   * Component properties
   */
  properties: {
    visible: Boolean,
    type: String,
    maxValue: Number,
  },

  /**
   * Component initial data
   */
  data: {
    isAllPay: true, // 还款类型 是否全款
    partPay: '', // 部分款金额
    priceError: false,
    maxValueError: false,
  },

  /**
   * Component methods
   */
  methods: {
    submitRepay() {
      if (this.data.priceError) {
        return wx.showToast({
          title: '请输入正确金额',
          icon: 'none'
        })
      }
      if (this.data.maxValueError) {
        return wx.showToast({
          title: '超出最大还款金额' + this.properties.maxValue + '元',
          icon: 'none'
        })
      }
      this.triggerEvent('confirm', {
        isAllPay: this.properties.type === 'multi' ? false : this.data.isAllPay,
        partPay: this.data.partPay
      })
      this.closeRepay()
    },
    closeRepay() {
      this.triggerEvent('cancel')
      // 还原数据
      setTimeout(() => {
        this.setData({
          isAllPay: true,
          partPay: ''
        })
      }, 250)
    },
    changePayStatus(e) {
      this.setData({
        isAllPay: e.detail.value
      });
    },
    changePartPay(e) {
      const {
        value
      } = e.detail
      const {
        priceError,
        maxValueError
      } = this.data;
      const result = isNumber(e.detail.value);
      if (priceError === result) {
        return this.setData({
          priceError: !result,
        });
      }
      // 超出最大还款金额,提示
      const isCorrect = value <= this.properties.maxValue
      if (maxValueError === isCorrect) {
        return this.setData({
          maxValueError: !isCorrect,
        });
      }
      this.setData({
        partPay: value
      })
    },
  }
})