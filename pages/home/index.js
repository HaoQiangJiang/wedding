Page({
  data: {
    list: [{
      label: 'chatGPT 聊天',
      desc: '让人工智能解答你的困惑吧~',
      value: 'chatGPT',
      url: '/pages/chat/index'
    }, {
      label: 'Ai图片',
      desc: '聊天方式生成图片',
      value: 'painting',
      url: '/pages/chatToImage/index'
    }, {
      label: 'Ai插画',
      desc: '预选风格生成图片',
      value: 'painting',
      url: '/pages/painting/index'
    }, {
      label: 'Ai诗词',
      desc: '文字生成图片、图片生成图片',
      value: 'poetry',
      url: '/pages/poetry/index'
    }, ]
  },
  open(e) {
    const url = e.currentTarget.dataset.url
    if (url === '/pages/paint/index') return wx.showToast({
      title: '开发中,尽请期待',
      icon: 'none'
    })
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