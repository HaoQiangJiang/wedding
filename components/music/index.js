// components/music/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  lifetimes: {
    attached() {
      this.setData({
        isPlay: getApp().globalData.isPlay
      });
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    isPlay: true, // 页面初始化时的音频播放状态

  },

  /**
   * 组件的方法列表
   */
  methods: {
    toggleMusic() {
      wx.vibrateShort({
        type: 'medium',
        complete: () => {
          this.setData({
            isPlay: !this.data.isPlay
          }, () => {
            if (this.data.isPlay) {
              getApp().playMusic();
            } else {
              getApp().pauseMusic();
            }
          })
        }
      })

    }
  }
})