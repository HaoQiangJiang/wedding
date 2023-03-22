const {
  chat,
  createChatRoom,
  updateRoom
} = require('../../api/index')
const {
  generateUUID,
  lookAdModal
} = require('../../utils/util')
Page({
  data: {
    defaultChat: {
      content: `Hello～我是灵犀AI智能问答机器人AIBB，请开始提问吧！当我输出内容不完整时，请发送“继续“。温馨提示：回答内容由Ai自主生成，请注意辦别回答的正确和真实性。

      例如，你可以这么问我：
       
      ·春天到了，生成描写玉兰花的诗词，需要出现春天，花开等关键词。
      
      ·你现在是一个英语老师，请帮我讲解一下 as for 的意思和用法，并给出一些例句。
      
      ·我是一名资深的法律顾问,请帮我起草一份服务协议。
      
      我可以帮助人类完成很多任务，例如语音识别、图像识别、自然语言处理等。我还可以与人类进行交互，解答问题、提供建议和服务等。希望我能够为人类带来便利和智慧。`,
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
    roomId: '', // 房间 id
  },
  async onLoad() {
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
      loading
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
    const params = chatList.concat([{
      "role": "user",
      "content": inputValue
    }])
    this.setData({
      chatList: params,
      inputValue: '',
      loading: true,
    });
    this.toViewBottomFun()
    if (!this.data.roomId) {
      // 第一次创建房间
      const room = await createChatRoom({
        title: inputValue,
        type: 'text',
        messages: []
      })
      this.setData({
        roomId: room.data.data,
      })
    }
    let chatResult = ''
    try {
      const {
        data
      } = await chat({
        id: this.data.roomId,
        params
      })
      if (data.code === 401) {
        // 积分不足,提示看广告
        this.setData({
          loading: false
        })
        return lookAdModal()
      } else {
        const messageText = data.data.choices[0].message.content.trimStart()
        chatResult = messageText
      }
    } catch (err) {
      chatResult = '当前使用人数较多,请稍后再试...'
    }
    const thinkUUID = generateUUID()
    const assistantReply = {
      id: thinkUUID,
      role: "assistant",
      content: ''
    }
    const newChatList = params.concat([assistantReply]);
    const newChatListBak = JSON.parse(JSON.stringify(newChatList))
    newChatListBak[newChatListBak.length - 1].content = chatResult
    // 更新聊天记录
    updateRoom(this.data.roomId, {
      type: 'text',
      messages: newChatListBak
    })
    // 拿到了结果,替换正在思考的 uuid 的 content
    let thinkDataIndex = newChatList.findIndex(item => item.id === thinkUUID)
    const intervalTime = 50; // 每隔 100ms 加载一次
    let index = 0;
    let result = ''
    const intervalId = setInterval(() => {
      if (index >= chatResult.length) {
        clearInterval(intervalId);
        return;
      }
      result += chatResult[index];
      newChatList[thinkDataIndex] = {
        ...newChatList[thinkDataIndex],
        ...{
          content: result
        }
      }
      this.setData({
        loading: false,
        chatList: newChatList,
      })
      this.toViewBottomFun()
      index++;
    }, intervalTime);

  },
  copy(e) {
    const {
      content
    } = e.currentTarget.dataset
    wx.setClipboardData({
      data: content,
      success(res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        })
      }
    })
  },
  keyboardheightchange(e) {
    const {
      height,
      duration
    } = e.detail
    this.setData({
      scrollTop: 99999999,
      topHeight: height === 0 ? 0 : height - 20,
      duration,
    });
    height !== 0 && this.toViewBottomFun()

  },

  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible
    })
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
  newChat() {
    // 开启新对话
    this.setData({
      chatList: [],
      roomId: '', // 清空房间号
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
  onShareAppMessage() {}

});