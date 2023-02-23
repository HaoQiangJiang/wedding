import updateManager from './common/updateManager';

App({
  onLaunch: function () {
    this.onShareAppMessage()
  },
  onShow: function () {
    updateManager();
  },
  onShareAppMessage() {
    wx.onAppRoute(() => {
      const pages = getCurrentPages() //获取加载的页面
      const view = pages[pages.length - 1] //获取当前页面的对象
      if (!view) return false //如果不存在页面对象 则返回
      // 若想给个别页面做特殊处理 可以给特殊页面加isOverShare为true 就不会重写了
      const data = view.data
      if (!data.isOverShare) {
        console.log(1111)
        data.isOverShare = true
        view.onShareAppMessage = () => { //重写分享配置
          return {
            title: '记下理想, 温暖生活——灵犀记账助手',
            path: "/pages/home/index", //若无path 默认跳转分享页
            imageUrl: 'https://weixin.linktmd.com/public/Share.png' //若无imageUrl 截图当前页面
          }
        }
      }
    })
  }
});