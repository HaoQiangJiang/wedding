const {
  info
} = require('../../mock/index')
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes:{
    attached(){
      wx.loadFontFace({
        family: 'FZBYSK',
        source: 'url("https://qnm.hunliji.com/sbft_FZBYSK--GBK1-0_-A9DrTwwXYQ-fQ7sQYrUFA.ttf")',
      
      });
  
      wx.loadFontFace({
        family: 'ClassicoBold',
        source: 'url("https://qnm.hunliji.com/FuAF4-Z8nXwBWJ3UjOQNR5ucmQrU")',
      
      });
      wx.loadFontFace({
        family: 'BillySmith',
        source: 'url("https://qnm.hunliji.com/sbft_BillySmith_7OlvXS32PdD2_TJO7HipgA.ttf")',
    
      });
      wx.loadFontFace({
        family: 'FZBYSK1',
        source: 'url("https://qnm.hunliji.com/sbft_FZBYSK--GBK1-0_fUic555FdRfxz-5bARXNOQ.ttf")',
       
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