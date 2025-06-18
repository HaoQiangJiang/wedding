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
        family: 'loveStoryFont',
        source: 'url("https://qnm.hunliji.com/sbft_FZYingBiXingShu-S16S_7OlvXS32PdD2_TJO7HipgA.ttf")',
      });
      wx.loadFontFace({
        family: 'loveStoryFont1',
        source: 'url("https://qnm.hunliji.com/sbft_BillySmith_Vs0ZkY81i-4NNdECGpJwzQ.ttf")',
      });
      wx.loadFontFace({
        family: 'loveStoryFont2',
        source: 'url("https://qnm.hunliji.com/sbft_AndreaBilarosaRegular_ikHiW-uhlFqjK9LcUcK0Sg.ttf")',
      });
      wx.loadFontFace({
        family: 'fz',
        source: 'url("https://qnm.hunliji.com/sbft_FZYingBiXingShu-S16S_FzFM8mD4AchfuuKdCjhh9w.ttf")',
      });
      wx.loadFontFace({
        family: 'fzfsjw',
        source: 'url("https://qnm.hunliji.com/sbft_fzfsjw--gb1-0_B-a9LR1nNzgMMt6ULeYA7w.ttf")',
      });
    },
   
  },

  /**
   * 组件的初始数据
   */
  data: {
    info,
  },

  /**
   * 组件的方法列表
   */
  methods: {
   
  }
})