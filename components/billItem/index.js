// components/billItem/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    item: Object,
    bigPrice: Boolean,
    url: String,
    isHiddenAvatar: {
      type: Boolean,
      value: false
    },
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
      console.log(this.properties.url)
      wx.navigateTo({
        url: this.properties.url,
        success: (res) => {
          res.eventChannel.emit('acceptBillData', {
            data: this.properties.item
          })
        }
      })

    }
  },

})