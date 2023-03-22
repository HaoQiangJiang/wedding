const {
  chatToImage,
  createChatRoom,
  updateRoom
} = require('../../api/index')
const {
  lookAdModal
} = require('../../utils/util')
Page({
  data: {
    defaultChat: {
      content: `      Hello～我是灵犀AI下具备生成图片功能的AIPainting！

      我使用深度学习和神经网络技术，可以生成各种类型的图片，例如人物肖像、风景画、抽象艺术等。我可以通过输入一些关键词或者样本图片，来生成符合要求的图片。
      
      例如你可以这么问我：
      
      ·海边晒太阳的美女。
      
      ·希望我能够为人类带来更多的创造力和想象力。`,
      role: 'assistant',
    },
    meAvatar: '',
    aiAvatar: '../../assets/logo.png',
    chatList: [],
    inputValue: '',
    loading: false,
    topHeight: 0,
    duration: 0,
    visible: false,
    roomId: '',
  },
  onLoad() {
    this.toViewBottomFun()
    wx.getStorage({
      key: 'userInfo',
      success: (userInfo) => {
        this.setData({
          meAvatar: userInfo.data.avatar_url
        })
      }
    })
  },
  toViewBottomFun() {
    // 设置屏幕自动滚动到最后一条消息处
    this.setData({
      scrollTop: 9999999999
    });
  },
  onInput(e) {
    const {
      value
    } = e.detail;
    this.setData({
      inputValue: value,
      textareaHeight: 0
    });
  },
  onFocus() {
    this.toViewBottomFun()
  },
  async onSend() {
    const {
      chatList,
      inputValue,
      loading,
    } = this.data;
    if (!inputValue) {
      return;
    }
    if (loading) {
      return wx.showToast({
        title: 'Ai正在思考中, 请稍等...',
        icon: 'none'
      })
    }
    const newChatList = chatList.concat([{
      "role": "user",
      "content": inputValue
    }]);
    this.setData({
      chatList: newChatList,
      inputValue: '',
      loading: true,
    });
    this.toViewBottomFun()
    if (!this.data.roomId) {
      // 第一次创建房间
      const room = await createChatRoom({
        title: inputValue,
        type: 'image',
        messages: []
      })
      this.setData({
        roomId: room.data.data,
      })
    }
    let chatResult = {}
    try {
      const {
        data
      } = await chatToImage({
        id: this.data.roomId,
        params: {
          "prompt": inputValue
        }
      })
      if (data.code === 401) {
        // 积分不足,提示看广告
        this.setData({
          loading: false
        })
        return lookAdModal()
      } else {
        chatResult = {
          role: 'assistant',
          content: data.data.data[0].url
        }
      }
    } catch (err) {
      chatResult = {
        role: 'assistant',
        content: '当前使用人数较多,请稍后再试...'
      }
    }
    this.data.chatList.push(chatResult)
    // 更新聊天记录
    updateRoom(this.data.roomId, {
      type: 'image',
      messages: this.data.chatList
    })
    this.setData({
      loading: false,
      chatList: this.data.chatList,
    })
    this.toViewBottomFun()
  },
  keyboardheightchange(e) {
    const {
      height,
      duration
    } = e.detail
    this.setData({
      topHeight: height === 0 ? 0 : height - 20,
      duration,
    });
    height !== 0 && this.toViewBottomFun()
  },
  closeHistory() {
    this.setData({
      visible: false
    })
  },
  openHistory() {
    this.setData({
      visible: true
    })
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    })
  },
  newChat() {
    // 开启新对话
    this.setData({
      chatList: [],
      roomId: ''
    })
    this.closeHistory()
  },
  select(item) {
    const {
      messages,
      id
    } = item.detail
    this.setData({
      chatList: messages,
      roomId: id
    })
    this.closeHistory()
  },
  previewImage(e) {
    const {
      image
    } = e.currentTarget.dataset
    console.log(e)
    wx.previewImage({
      urls: [image],
    })
  },
  onShareAppMessage() {}

});