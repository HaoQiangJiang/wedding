const {
  urlTobase64,
  checkSource
} = require('../../utils/util')
const {
  reduceScore
} = require('../../api/index')
const {
  aiExampleList,
  defaultPlaceholder,
  defaultPrompt
} = require('./data.js')
Page({
  data: {
    prompt: '',
    result: {},
    loading: false,
    imageProps: {
      mode: 'aspectFill'
    },
    rank: 0,
    gridConfig: {
      column: 1,
    },
    selectType: 'text',
    current: 0,
    list: aiExampleList,
    defaultPlaceholder,
    fileList: [],

  },
  onLoad() {

  },
  onInput(e) {
    const {
      value
    } = e.detail;
    this.setData({
      prompt: value,
    });
  },
  changeExample(e) {
    const item = this.data.list[e.detail.current]
    this.setData({
      prompt: item.config.prompt,
    })
  },
  openAiExample() {
    wx.navigateTo({
      url: '/pages/painting/example/index',
      events: {
        selectExample: (data) => {
          console.log(data)
          this.setData({
            current: data.index,
            autoplay: false,
            prompt: data.data.config.prompt,
          })
        }
      },
      success: (res) => {
        res.eventChannel.emit('acceptData', {
          data: this.data.list
        })
      }
    })
  },
  open(e) {
    const config = e.currentTarget.dataset.config
    this.setData({
      prompt: config.prompt,
    })
  },
  onTabsChange(e) {
    this.setData({
      selectType: e.detail.value
    })
  },
  handleRemove() {
    this.setData({
      fileList: []
    })
  },
  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;
    // 方法1：选择完所有图片之后，统一上传，因此选择完就直接展示
    this.setData({
      fileList: [...fileList, ...files], // 此时设置了 fileList 之后才会展示选择的图片
    });
  },
  async start() {
    wx.vibrateShort();
    const res = await checkSource()
    if (!res) return
    const {
      prompt,
      selectType,
      fileList
    } = this.data;
    if (!prompt && selectType === 'text') {
      return wx.showToast({
        title: '正向描述不能为空',
        icon: 'none'
      })
    }
    if (fileList.length === 0 && selectType === 'image') {
      return wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      })
    }
    this.setData({
      loading: true
    })
    let url = 'wss://ai.linktmd.com/api/ws/painting'
    // let url = 'wss://stabilityai-stable-diffusion-1.hf.space/queue/join'
    // let url = 'wss://stabilityai-stable-diffusion.hf.space/queue/join'
    if (selectType === 'image') {
      url = 'wss://ai.linktmd.com/api/ws/paintingb'
      // url = 'wss://hysts-controlnet.hf.space/queue/join'
    }
    wx.connectSocket({
      url,
      success: function () {
        console.log('WebSocket连接成功')
      },
    })
    wx.onSocketOpen(() => {
      console.log('WebSocket已打开')
      wx.sendSocketMessage({
        data: JSON.stringify({
          "session_hash": "90t0724m0hk",
          "fn_index": selectType === 'text' ? 3 : 1
        })
      })

      wx.onSocketMessage(async (res) => {
        const data = JSON.parse(res.data)
        if (data.msg === 'send_hash') {
          let params = {}
          if (selectType === 'text') {
            // 文生图
            params = {
              "fn_index": 3,
              "data": [defaultPrompt + prompt, 'low quality', 30],
              "session_hash": "90t0724m0hk"
            }
          } else {
            // 图生图
            const imageBase64 = await urlTobase64(fileList[0].url)
            params = {
              "fn_index": 1,
              "data": [imageBase64, defaultPrompt + prompt, "(An extremely delicate and beautiful work),(masterpiece),highly detailed,(8k, RAW photo, best quality, masterpiece:1.2), (realistic, photo-realistic:1.37),physically-based rendering", "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality", 1, 512, 30, 9, -1, 100, 200],
              "session_hash": "90t0724m0hk"
            }
          }
          wx.sendSocketMessage({
            data: JSON.stringify(params),
            success: () => {
              console.log('消息发送成功')
            }
          })
        }
        if (data.msg === 'estimation') {
          this.setData({
            rank: data.rank
          })
        }
        if (data.msg === 'process_starts') {
          this.setData({
            rank: 0
          })
        }
        if (data.msg === 'process_completed') {
          if (data.output.error || !data.output.data) {
            if (data.output.error === "'Unsafe content found. Please try again with different prompts.'") {
              return wx.showToast({
                title: '您的描述可能包含违规词汇, 换个描述吧',
                icon: 'none'
              })
            }
            return wx.showToast({
              title: '当前使用人数较多, 请稍后再试...',
              icon: 'none'
            })
          }
          // 生成完成
          reduceScore(1) // 减一B币
          const images = data.output.data[0].map(item => {
            if (selectType === 'text') {
              item = item.replace(/[\r\n]/g, "")
              return item
            } else {
              return 'https://hysts-controlnet.hf.space/file=' + item.name
            }
          })
          wx.navigateTo({
            url: '/pages/painting/outcome/index',
            success: (res) => {
              wx.vibrateShort();
              res.eventChannel.emit('acceptOutcome', {
                outcome: images
              })
              setTimeout(() => {
                this.setData({
                  loading: false
                })
              }, 200);
            }
          })

        }
      })
    })
    wx.onSocketClose((result) => {
      this.setData({
        loading: false,
      })
    })

    wx.onSocketError((result) => {
      this.setData({
        loading: false
      })
    })
  },
  onUnload() {
    wx.closeSocket({
      success: function () {
        console.log('WebSocket已关闭')
      }
    })
  },
  onShareAppMessage() {}
});