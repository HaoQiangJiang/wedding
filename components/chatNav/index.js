// components/chatNav/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    title: String
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
    back() {
      wx.navigateBack()
    },
    onOpen() {
      wx.vibrateShort()
      this.triggerEvent('open')
    }
  }
})