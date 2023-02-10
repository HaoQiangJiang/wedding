// components/billItem/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    item: Object,
    readonly: Boolean
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    openDetails() {
      // 只读不执行点击
      if (this.properties.readonly) return;
      wx.navigateTo({
        url: '/pages/billDetails/index',
        success: (res) => {
          res.eventChannel.emit('acceptBillData', {
            data: this.properties.item
          })
        }
      })

    }
  },
  
})