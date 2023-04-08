const {
  chat,
  createChatRoom,
  updateRoom,
  watchAd
} = require('../../api/index');
const {
  checkSource
} = require('../../utils/util')
// 在页面中定义插屏广告
let interstitialAd = null;
// 广告
let videoAd = null;
Page({
  data: {
    content: '',
    result: {},
    loading: false,
    tag: '任意',
    tagMap: ['任意', '古诗', '现代诗', '打油诗', '词', '文言文', '民谣', '顺口溜', '小说', '散文']
  },
  onLoad() {
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
    wx.vibrateShort();
    const res = await checkSource()
    if (!res) {
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
    };
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
        title: '这个问题我好像思考的有点费劲,呜呜呜呜...',
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