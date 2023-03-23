const {
  chat,
  createChatRoom,
  updateRoom
} = require('../../api/index')
Page({
  data: {
    content: '',
    result: {},
    loading: false,
    tag: '任意',
    tagMap: ['任意', '古诗', '现代诗', '打油诗', '词', '文言文', '民谣', '顺口溜', '小说', '散文']
  },
  onInput(e) {
    const {
      value
    } = e.detail;
    this.setData({
      content: value,
    });
  },
  onChangeTag(e) {
    this.setData({
      tag: e.detail.value
    });
  },
  async start() {
    wx.vibrateShort()
    const {
      content,
      tag
    } = this.data;
    if (!content) {
      return wx.showToast({
        title: '文案不能为空',
        icon: 'none'
      })
    }
    this.setData({
      loading: true
    })
    const params = [{
      "role": "user",
      content: `请根据我输入的内容: ${content} 写一首${tag==='任意'?'题材任意的诗':tag}`
    }]
    const room = await createChatRoom({
      title: content,
      type: 'poetry',
      messages: []
    })
    let chatResult = ''
    try {
      const {
        data
      } = await chat({
        id: room.data.data,
        params
      })
      if (data.code === 10001) {
        wx.showModal({
          title: 'B币不足',
          content: data.data,
          complete: (res) => {
            if (res.cancel) {}
            if (res.confirm) {}
          }
        })
        chatResult = data.data
      } else {
        chatResult = data.data.choices[0].message.content
      }
    } catch (err) {
      this.setData({
        loading: false
      })
      return wx.showToast({
        title: '当前使用人数较多, 请稍后再试...',
        icon: 'none'
      })
    }
    // 更新聊天记录
    updateRoom(room.data.data, {
      type: 'poetry',
      messages: [params.concat({
        role: "assistant",
        content: chatResult
      })]
    })
    wx.navigateTo({
      url: `/pages/poetry/outcome/index?chatResult=${chatResult}`,
      success: () => {
        this.setData({
          loading: false
        })
      }
    })
  },
  onShareAppMessage() {}
});