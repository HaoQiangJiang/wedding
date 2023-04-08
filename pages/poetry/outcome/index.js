const {
  collectPoetry,
  share
} = require('../../../api/index')

Page({

  /**
   * Page initial data
   */
  data: {
    isOverShare: true,
    content: '',
    loading: false,
    customImage: 'https://gd-hbimg.huaban.com/1cb026c75a5564413b658daf54787c483921ad4ba78e7-Uj53hJ_fw1200webp',
    customColor: '#505462',
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    const {
      chatResult,
      customImage,
      customColor
    } = options
    if (chatResult) {
      return this.setData({
        chatResult,
        customImage,
        customColor: customColor || "#505462"
      })
    }
  },
  async onCollect() {
    const parms = {
      content: this.data.outcome
    }
    await collectPoetry(parms)
    wx.showToast({
      title: '收藏成功',
      icon: 'none'
    })
  },
  onEdit() {
    const {
      chatResult,
      customImage,
      customColor
    } = this.data
    wx.navigateTo({
      url: `/pages/poetry/outcome/edit/index?outcome=${chatResult}&customImage=${customImage}&customColor=${customColor}`,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        setEditResult: (data) => {
          this.setData({
            chatResult: data.data
          })
        },
        setEditColor: (data) => {
          this.setData({
            customColor: data.data
          })
        }
      },
    })
  },
  download() {

  },
  showChangeImage() {
    // 替换图片
    wx.chooseImage({
      sizeType: ["original", "compressed"],
      sourceType: ['album'], //类型
      count: 1,
      success: (a) => {
        if (a.tempFiles[0].size > 2097152) {
          wx.showModal({
            title: "提示",
            content: "选择的图片过大，请上传不超过2M的图片",
            showCancel: !1,
            success: function (a) {
              a.confirm;
            }
          })
        } else {
          //把图片上传到服务器
          console.log(a.tempFilePaths[0])
          this.setData({
            customImage: a.tempFilePaths[0]
          })
        }
      }
    });
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {},

  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    share()
    const {
      chatResult,
      customImage,
      customColor
    } = this.data
    return {
      title: '快来看我写的诗',
      path: `/pages/poetry/outcome/index?invite_code=1111&chatResult=${chatResult}&customImage=${customImage}&customColor=${customColor}`,
      imageUrl: 'https://weixin.linktmd.com/public/Share.png'
    }


  }
})