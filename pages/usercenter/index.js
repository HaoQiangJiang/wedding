Page({
  data: {
    userInfo: {
      avatarUrl: '',
      nickName: '正在登录...',
      phoneNumber: '',
    },
    currAuthStep: 1,
  },
  onShow() {
    this.getTabBar().init();
    wx.getStorage({
      key: 'userInfo',
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: {
            avatarUrl: res.data.avatarUrl,
            nickName: res.data.nickName,
            phoneNumber: '',
          },
          currAuthStep: 3
        })
      }
    })
  },

});