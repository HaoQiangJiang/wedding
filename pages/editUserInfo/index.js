// pages/editUserInfo/index.js
const {
  updateUserInfo
} = require('../../api/index')
const {
  urlTobase64
} = require('../../utils/util')
Page({

  /**
   * Page initial data
   */
  data: {
    userInfo: {},
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    wx.getStorage({
      key: 'userInfo',
      success: (userInfo) => {
        console.log(userInfo)
        this.setData({
          userInfo: userInfo.data
        })
      }
    })
  },
  changeName(e) {
    this.setData({
      test: JSON.stringify(e.detail)
    })
    this.updateInfo('name', e.detail.value)
  },
  async changeAvatar(e) {
    const image = await urlTobase64(e.detail.avatarUrl)
    this.updateInfo('avatar_url', image)
  },
  async updateInfo(key, value) {
    // 更新 userInfo 数据
    const newData = {
      [key]: value
    }
    const newUserInfo = {
      ...this.data.userInfo,
      ...newData
    }

    // 将数据保存到接口
    await updateUserInfo(newData)
    this.setData({
      userInfo: newUserInfo
    })
    // 替换本地缓存
    wx.setStorageSync('userInfo', newUserInfo)
  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

  },

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

  }
})