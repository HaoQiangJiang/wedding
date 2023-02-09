// components/stepper/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    item: Object,
    value: Number,
    isShowMask: Boolean
  },
  observers: {
    'isShowMask': function (newVal) {
      !newVal && this.setData({
        isEdit: false
      })
    }
  },
  /**
   * Component initial data
   */
  data: {
    isEdit: false,
  },

  /**
   * Component methods
   */
  methods: {
    open() {
      this.setData({
        isEdit: true
      })
      this.triggerEvent('showMask', true)
    },
    close() {
      this.setData({
        isEdit: false
      })
      this.triggerEvent('showMask', false)
    },
    changeCount(e) {
      wx.vibrateShort(); // 使手机震动15ms
      const currentValue = e.detail.value
      const data = {
        goods: this.properties.item,
        updateData: {
          count: currentValue
        }
      }
      this.triggerEvent('replaceGoodsCount', data)
    },
  }
})