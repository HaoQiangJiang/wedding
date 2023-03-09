Page({
  data: {
    list: [{
      label: 'chatGPT 聊天',
      image: 'https://www.linktmd.com/static/link_official/images/testimonial/tx3.png',
      value: 'chatGPT',
      url: '/pages/chat/index'
    }, {
      label: '解梦',
      image: 'https://www.linktmd.com/static/link_official/images/testimonial/tx3.png',
      value: 'dram',
      url: '/pages/dram/index'
    }, {
      label: '朋友圈文案',
      image: 'https://www.linktmd.com/static/link_official/images/testimonial/tx3.png',
      value: 'copywriting',
      url: '/pages/copywriting/index'
    }, {
      label: '广告语生成',
      image: 'https://www.linktmd.com/static/link_official/images/testimonial/tx3.png',
      value: 'ad',
      url: '/pages/ad/index'
    }, {
      label: '男友道歉专用',
      image: 'https://www.linktmd.com/static/link_official/images/testimonial/tx3.png',
      value: 'apologize',
      url: '/pages/apologize/index'
    }, {
      label: '诗词生成',
      image: 'https://ai.linktmd.com/static/poetry_cover.png',
      value: 'poetry',
      url: '/pages/poetry/index'
    }]
  },
  open(e) {
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  onShow() {
    this.getTabBar().init()
  },
  onShareAppMessage() {

  }

});