const {
  chat,
  createChatRoom,
  updateRoom,
  watchAd
} = require('../../api/index')
const {
  generateUUID,
  lookAdModal,
  removeChatGPT
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
    });
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd) {
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-65a1e975a45a224d'
      })
      videoAd.onLoad(() => {
        console.log("广告加载成功")
      })
      videoAd.onError((err) => {
        console.log("广告加载失败", err);
      })
      videoAd.onClose((res) => {
        console.log("广告关闭", res)
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          wx.showToast({
            title: '奖励已到账',
            icon: 'success'
          });
          watchAd();
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '广告异常关闭，无法获取积分奖励',
            icon: 'error'
          })
        }
      })
    };
    // 在页面onLoad回调事件中创建插屏广告实例
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-48b2e163e612023f'
      })
      interstitialAd.onLoad(() => {
        console.log("插屏广告加载成功")
      })
      interstitialAd.onError((err) => {
        console.log("插屏广告加载失败")
      })
      interstitialAd.onClose(() => {
        console.log("插屏广告被关闭")
      })
    }
  },
  onShow() {
    // 在适合的场景显示插屏广告
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.log(err)
      })
    };
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
        title: 'AIBB正在飞速的运转大脑...',
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
      loading: true
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
      console.log(data)
      if (data.code === 10001) {
        //B币不足,提示看广告
        this.setData({
          loading: false
        });
        return wx.showModal({
          title: 'B币账户超支',
          content: 'AIBB小主,你的B币已经不足,分享邀请用户或观看广告奖励均可领B币',
          complete: (res) => {
            if (res.confirm) {
              wx.vibrateShort()
              // 用户触发广告后，显示激励视频广告
              if (videoAd) {
                videoAd.show().catch(() => {
                  // 失败重试
                  videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                      console.log('激励视频 广告显示失败');
                      wx.showToast({
                        title: '今日广告奖励已经全部用完,可明日再来',
                        icon: 'success'
                      })
                    })
                })
              }
            }
          }
        });
      } else if (data.code === 401) {
        return wx.showModal({
          title: 'B币账户超支',
          content: 'AIBB小主,你的B币已经不足,分享邀请用户或观看广告奖励均可领B币',
          complete: (res) => {
            if (res.confirm) {
              wx.vibrateShort()
              // 用户触发广告后，显示激励视频广告
              if (videoAd) {
                videoAd.show().catch(() => {
                  // 失败重试
                  videoAd.load()
                    .then(() => videoAd.show())
                    .catch(err => {
                      console.log('激励视频 广告显示失败');
                      wx.showToast({
                        title: '今日广告奖励已经全部用完,可明日再来',
                        icon: 'success'
                      })
                    })
                })
              }
            }
          }
        });
      } else {
        const messageText = data.data.choices[0].message.content.trimStart()
        chatResult = removeChatGPT(messageText)
      }
    } catch (err) {
      chatResult = '这个问题我好像思考的有点费劲,呜呜呜呜...'
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