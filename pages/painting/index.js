const {
  urlTobase64,
  checkSource
} = require('../../utils/util')
const {
  reduceScore
} = require('../../api/index')
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
    list: [{
        label: '寺庙雪山',
        height: 218,
        image: 'https://gd-hbimg.huaban.com/0c16202e79a1088a5bc36e272ad3810b9f1de94840f2c-iKRxU4_fw1200webp',
        config: {
          prompt: 'In a fantasy setting, you arrive in front of a temple on top of a mountain during winter, with snow falling around you. You sense a mysterious aura, as if something unusual is about to happen.',
        }
      }, {
        label: '梦幻毛绒',
        image: 'https://baai-flagstudio.ks3-cn-beijing.ksyuncs.com/web/42e1ec1d55584baa953f4edd2c772a49/generated/20230311144158-bf88e170142847638989973c4e5869da/0@base@tag=imgScale',
        height: 280,
        config: {
          prompt: 'mdjrny-v4 style, The fluffiest little fuzzbutts in the world, huggy wuggy from poppy playtime video game, fullbody, ultra high detailed, glowing lights, oil painting, Greg Rutkowski, Charlie Bowater, Beeple, unreal 5, DAZ, hyperrealistic, octane render, RPG portrait, dynamic lighting, fantasy art, beautiful face',
        }
      },
      {
        label: '火星上的老鼠',
        height: 200,
        image: 'https://baai-flagstudio.ks3-cn-beijing.ksyuncs.com/web/95853b57eaba4a8da143f2608f09e9dd/generated/20221229093101-9e83eccaa6f041aeaba8f68f7866177d/0@base@tag=imgScale',
        config: {
          prompt: 'mdjrny-v4 style, The fluffiest little fuzzbutts in the world, huggy wuggy from poppy playtime video game, fullbody, ultra high detailed, glowing lights, oil painting, Greg Rutkowski, Charlie Bowater, Beeple, unreal 5, DAZ, hyperrealistic, octane render, RPG portrait, dynamic lighting, fantasy art, beautiful face',
        }
      },
      {
        label: '仙岛',
        height: 300,
        image: 'https://baai-flagstudio.ks3-cn-beijing.ksyuncs.com/web/95853b57eaba4a8da143f2608f09e9dd/generated/20221228154941-9684ae1db09041969a2ab3e8227506bc/0@base@tag=imgScale',
        config: {
          prompt: 'waterfall village shaped like a frog, by benoit mandelbrot, filip hodas, vincent callebaut, mike campau and studio ghibli',
        }
      },
      {
        label: '戴帽子的猪',
        height: 190,
        image: 'https://baai-flagstudio.ks3-cn-beijing.ksyuncs.com/web/95853b57eaba4a8da143f2608f09e9dd/generated/20221226171428-e14c2e2000b54112afbcfbad57e8c5d8/0@base@tag=imgScale',
        config: {
          prompt: 'A winter full of regrets, blowing snow, a super cute baby Pixar-style white fairy pig, shiny white fluffy, big bright eyes, fluffy tail, smile, delicate, fairy tale, incredibly high detail, Pixar-style, bright colors, natural light, simple background with solid colors, Octane render, popular on art station, gorgeous, ultra wide Angle, 8K, HD realistic, 8K HD',
        }
      }, {
        label: '梦幻森林蘑菇',
        height: 250,
        image: "https://gd-hbimg.huaban.com/3cc7dea059505427cfbc9b66ec86cfb5845ef17ffcac5-FVCPBs_fw1200webp",
        config: {
          prompt: 'mushrooms, fantasy, cinematic lighting, ((stains and splashes of paint)), dark background, dramatic lighting, (((digital painting))), sharp '
        }
      }, {
        label: '梦幻树',
        height: 300,
        image: "https://gd-hbimg.huaban.com/3eba08bb31e5d9e3d38175b96e1717d9f1c626f2e8bef-yV4SPA_fw1200webp",
        config: {
          prompt: 'beautiful tree, 8k, trending, highly detailed hyper realistic,dreamlikeart tree of live,grass, waterfalls, sky, floating island, fantasy'
        }
      },
      {
        label: '皮克斯小猫',
        height: 150,
        image: "https://gd-hbimg.huaban.com/0b3cd4d0080a8db11793f43fa192cacca49f76339894-XW4ob3",
        config: {
          prompt: 'Pixar Style, 3d, Tiny cute and adorable cat, chibi, floating through space, jean - baptiste monge , anthropomorphic , dramatic lighting'
        }
      },
      {
        label: '池城堡垒',
        height: 220,
        image: "https://gd-hbimg.huaban.com/7602ec575ae4eedb3049ccc4d8f443bf1f13a2a1110f0-9yn90a_fw1200webp",
        config: {
          prompt: 'masterpiece, best quality, high quality, extremely detailed CG unity 8k wallpaper, medieval castles kingdom. scenery, amsterdam, autumn, outdoors, rainbow, sky, cloud, day, landscape, water, tree, blue sky, waterfall, nature, lake, river, cloudy sky,award winning photography, Bokeh, Depth of Field, HDR, bloom, Chromatic Aberration ,Photorealistic,extremely detailed, trending on artstation, trending on CGsociety, Intricate, High Detail, dramatic, art by midjourney'
        }
      },
      {
        label: '荒芜沙漠',
        height: 150,
        image: "https://gd-hbimg.huaban.com/0e9073e1cde4fdfb3d9a122bbd968b82b939daeeaf82-W5LHC3_fw1200webp",
        config: {
          prompt: 'masterpiece, best quality, high quality, extremely detailed CG unity 8k wallpaper,high contrast,Distinctive,(deer in the center,1.3),Empty desert with rare cacti,Hyperdetailed, HDR, bloom, Photorealistic, hyperdetailed'
        }
      }
    ],
    defaultPlaceholder: `请输入提示词，如：beautiful tree, 8k, trending, highly detailed hyper realistic,dreamlikeart tree of live,grass, waterfalls, sky, floating island, fantasy。尽量使用英文,描述的细节越多,生成的图片越好看。`,
    fileList: []
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
      fileList,
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
          "session_hash": "n5o285axw9",
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
              "data": ['fantasy, cinematic lighting,(raw photo 8K:1.3),extremely detailed CG unity 8k,(best quality:1.3), (ultra high res:1.2), (masterpiece:1.2), (realistic), physically-based rendering, (photo-realistic:1.37),' + prompt, '(nude:2),(NSFW:2).paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, normal quality, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, (outdoor:1.6), glans, paintings, sketches, (worst quality:2), (low quality:2), (normal quality:2), lowres, ((monochrome)), ((grayscale)), skin spots, acnes, skin blemishes, age spot, glan, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry, bad feet, hand, palm hand', 30],
              "session_hash": "n5o285axw9"
            }
          } else {
            // 图生图
            const imageBase64 = await urlTobase64(fileList[0].url)
            params = {
              "fn_index": 1,
              "data": [imageBase64, prompt, "(An extremely delicate and beautiful work),(masterpiece),highly detailed,(8k, RAW photo, best quality, masterpiece:1.2), (realistic, photo-realistic:1.37),physically-based rendering", "longbody, lowres, bad anatomy, bad hands, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality", 1, 512, 30, 9, -1, 100, 200],
              "session_hash": "n5o285axw9"
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
        if (data.msg === 'process_completed') {
          // 生成完成
          // reduceScore(1) // 减一积分
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