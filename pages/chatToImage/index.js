const {
  chatToImage,
  createChatRoom,
  updateRoom,
  watchAd
} = require('../../api/index')
const {
  lookAdModal
} = require('../../utils/util');
// 在页面中定义插屏广告
let interstitialAd = null;
// 广告
let videoAd = null;
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
        interstitialAd.show()
      })
      interstitialAd.onError((err) => {
        console.log("插屏广告加载失败")
      })
      interstitialAd.onClose(() => {
        console.log("插屏广告被关闭")
      })
    }
  },
  onUnload() {
    if(videoAd){
      videoAd.offLoad()
      videoAd.offError()
      videoAd.offClose()
      videoAd = null
    }
    if (interstitialAd) {
      interstitialAd.offLoad()
      interstitialAd.offError()
      interstitialAd.offClose()
      interstitialAd = null
    }
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
      });
      console.log(data);
      if (data.code === 10001) {
        chatResult = 'AIBB小主,你的B币已经不足,分享邀请用户或观看广告奖励均可领B币'
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
      }else if (data.code === 401) {
        // B币不足,提示看广告
        this.setData({
          loading: false
        })
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
      } else if (data.code === 400) {
        if (data.data === 'error, status code: 400, message: Your request was rejected as a result of our safety system. Your prompt may contain text that is not allowed by our safety system.') {
          this.setData({
            loading: false
          })
          return wx.showToast({
            title: '您的问题可能包含违规词汇, 换个问题吧',
            icon: 'none'
          })
        }
      } else {
        chatResult = {
          role: 'assistant',
          content: data.data.data[0].url
        }
      }
    } catch (err) {
      chatResult = {
        role: 'assistant',
        content: '这个问题我好像思考的有点费劲,呜呜呜呜...'
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