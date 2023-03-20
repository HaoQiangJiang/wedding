import updateManager from './common/updateManager';
const {
  checkLogin
} = require('./utils/login')
const {
  share
} = require('./api/index')
let userId = ''
App({
  onLaunch: function () {
    this.onShareAppMessage()
    wx.getSystemInfo({
      success: function (res) {
        if (res.platform === 'ios') {
          // iOS 系统
        } else if (res.platform === 'android') {
          // Android 使用 dark
          wx.setBackgroundTextStyle({
            textStyle: 'dark'
          })
        }
      }
    })
  },
  onShow: function (options) {
    console.log(options)
    const {
      invite_code
    } = options.query
    console.log(invite_code)
    updateManager();
    checkLogin(invite_code)
    wx.getStorage({
      key: 'userInfo',
      success: (userInfo) => {
        userId = userInfo.data.id
      }
    })
  },

  onShareAppMessage() {
    wx.onAppRoute(() => {
      const pages = getCurrentPages() //获取加载的页面
      const view = pages[pages.length - 1] //获取当前页面的对象
      if (!view) return false //如果不存在页面对象 则返回
      // 若想给个别页面做特殊处理 可以给特殊页面加isOverShare为true 就不会重写了
      const data = view.data
      if (!data.isOverShare) {
        data.isOverShare = true
        view.onShareAppMessage = () => { //重写分享配置
          // 调用分享接口
          share()
          return {
            title: '探索未知领域，开启未来之旅。',
            path: '/pages/home/index?invite_code=' + userId, //若无path 默认跳转分享页
            imageUrl: 'https://weixin.linktmd.com/public/ai_share.png' //若无imageUrl 截图当前页面
          }
        }
      }
    })
  }
});