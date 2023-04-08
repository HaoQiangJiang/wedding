// components/homeBox/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    item: Object
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
    open(e) {
      wx.vibrateShort(); // 使手机震动15ms
      const url = e.currentTarget.dataset.url
      wx.navigateTo({
        url: url,
      })
      return false;
    }
  }
})