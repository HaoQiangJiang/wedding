Page({
  data: {
    list: [{
      label: 'ChatGPT 聊天',
      desc: '让人工智能解答你的困惑吧',
      value: 'chatGPT',
      url: '/pages/chat/index'
    }, {
      label: 'Ai图片',
      desc: '用聊天的方式生成图片',
      value: 'aiImage',
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
    }, ],
    bakList: [],
    isShowVideo: true, // 是否显示视频
    opacity: 1,
    searchKey: '',
  },
  onLoad() {
    this.setData({
      bakList: JSON.parse(JSON.stringify(this.data.list))
    })

  },
  onChangeSearchKey(e) {
    const list = this.data.bakList.filter(item => item.label.toLowerCase().includes(e.detail.value.toLowerCase()))
    this.setData({
      searchKey: e.detail.value,
      list
    })
  },
  open(e) {
    wx.vibrateShort(); // 使手机震动15ms
    const url = e.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  onScroll(e) {
    console.log(e)
  },
  onShow() {
    this.getTabBar().init()
  },
  onShareAppMessage() {},
  onPageScroll(e) {
    if (this.data.isShowVideo && e.scrollTop > 100) {
      this.setData({
        isShowVideo: false
      })
    } else if (!this.data.isShowVideo && e.scrollTop <= 100) {
      this.setData({
        isShowVideo: true
      })
    }
  },
});