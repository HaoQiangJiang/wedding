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
        family: 'AndreaBilarosaRegular',
        source: 'url("https://qnm.hunliji.com/sbft_AndreaBilarosaRegular_gwzWpq4zjJm-_RtrPWW-GQ.ttf")',
      });
      wx.loadFontFace({
        family: 'FZLTKHJW1',
        source: 'url("https://qnm.hunliji.com/sbft_FZLTKHJW--GB1-0_ogT6tWyf_QC2wiroX3zoog.ttf")',
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