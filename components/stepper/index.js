// components/stepper/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    uuid: String,
    value: Number,
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
    },
    close() {
      this.setData({
        isEdit: false
      })
    },
    changeCount(e) {
      wx.vibrateShort(); // 使手机震动15ms
      this.triggerEvent('changeGoodsCount', {
        uuid: this.properties.uuid,
        value: e.detail.value
      })
    },
  }
})