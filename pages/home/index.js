const {
  imageList,
} = require('./data.js')

Page({
  data: {
    imageProps: {
      mode: 'aspectFit'
    },
    current: 0,
    list: imageList,
  },
  onLoad() {

  },
  onUnload() {

  },

  changeExample(e) {
    const item = this.data.list[e.detail.current]

  },
  openAiExample() {
    wx.navigateTo({
      url: '/pages/home/picture/index',
      success: (res) => {
        res.eventChannel.emit('acceptData', {
          data: this.data.list
        })
      }
    })
  },
  onShareAppMessage() {}
});