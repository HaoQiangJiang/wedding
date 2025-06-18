const {
  info
} = require('../../mock/index')
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached() {
      wx.loadFontFace({
        family: 'Doppelganger',
        source: 'url("https://qnm.hunliji.com/sbft_Doppelganger%20Display_lQjYOTc_37ZuWecve7S74g.ttf")',
      });
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    info
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})