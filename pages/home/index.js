Page({
  data: {
    list: [{
      label: 'ChatGPT 聊天',
      desc: '让人工智能解答你的困惑吧~',
      value: 'chatGPT',
      url: '/pages/chat/index'
    }, {
      label: 'Ai图片',
      desc: '用聊天的方式生成图片',
      value: 'painting',
      url: '/pages/chatToImage/index'
    }, {
      label: 'Ai插画',
      desc: '文字生成图片、图片生成图片',
      value: 'painting',
      url: '/pages/painting/index'
    }, {
      label: 'Ai诗词',
      desc: '用古人的方式表达你的想法',
      value: 'poetry',
      url: '/pages/poetry/index'
    }, ]
  },
  open(e) {
    wx.vibrateShort(); // 使手机震动15ms
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  onShow() {
    this.getTabBar().init()
  },
  onShareAppMessage() {}

});