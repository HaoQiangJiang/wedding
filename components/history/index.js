// components/history/index.js
const {
  getChatRecod,
} = require('../../api/index')
Component({
  /**
   * Component properties
   */
  properties: {
    type: String
  },

  /**
   * Component initial data
   */
  data: {
    userInfo: {},
    list: []
  },
  async attached() {
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.data
        })
      }
    })
    const {
      data
    } = await getChatRecod(this.properties.type)
    this.setData({
      list: data.data
    })
  },
  /**
   * Component methods
   */
  methods: {
    new() {
      wx.vibrateShort()
      this.triggerEvent('new')
    },
    select(e) {
      wx.vibrateShort()
      const item = e.currentTarget.dataset.item
      this.triggerEvent('select', item)
    },
    delete(e) {
      console.log(e)
    }
  }
})