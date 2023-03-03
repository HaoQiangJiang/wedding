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
    remark: '', // 支付备注
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
        partPay: this.data.partPay,
        remark: this.data.remark
      })
      this.closeRepay()
    },
    closeRepay() {
      this.triggerEvent('cancel')
      // 还原数据
      setTimeout(() => {
        this.setData({
          isAllPay: true,
          partPay: '',
          remark: ''
        })
      }, 250)
    },
    changePayStatus(e) {
      this.setData({
        isAllPay: e.detail.value
      });
    },
    changePartPay(e) {
      let {
        value
      } = e.detail
      const result = isNumber(e.detail.value);
      if (!result) {
        return this.setData({
          priceError: !result,
        });
      }
      // 超出最大还款金额,提示
      const isCorrect = value <= this.properties.maxValue
      if (!isCorrect) {
        return this.setData({
          maxValueError: true,
          partPay: value
        });
      }
      this.setData({
        priceError: false,
        maxValueError: false,
        partPay: value
      })
    },
    changeRemark(e) {
      this.setData({
        remark: e.detail.value
      })
    }
  }
})