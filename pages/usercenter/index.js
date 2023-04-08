const {
  isMoreThan24Hours
} = require('../../utils/util');
const {
  checkIn,
  getUserInfo,
  watchAd
} = require('../../api/index');
let videoAd = null; // 在页面中定义激励视频广告
Page({
  data: {
    userCardConfig: {
      name: '',
      avatar: '',
      isSign: false,
    },
    defaultAvatarUrl: 'https://cdn-we-retail.ym.tencent.com/miniapp/usercenter/icon-user-center-avatar@2x.png',
    id: '',
    score: 0,
    invite_count: 0,
    share_count: 0
  },
  adLoad() {
    console.log('Banner 广告加载成功')
  },
  adError(err) {
    console.log('Banner 广告加载失败', err)
  },
  adClose() {
    console.log('Banner 广告关闭')
  },
  onShow() {
    this.getTabBar().init();
    this.updateUserInfo();
  },
  onLoad() {
    // 在页面onLoad回调事件中创建激励视频广告实例
    if (wx.createRewardedVideoAd && !videoAd) { // tabbar 页,不会走 unload,因此这里不再创建
      videoAd = wx.createRewardedVideoAd({
        adUnitId: 'adunit-65a1e975a45a224d'
      })
      videoAd.onLoad(() => {
        console.log("广告加载成功")
      })
      videoAd.onError((err) => {
        console.log("广告加载失败", err);
      })
      videoAd.onClose(async (res) => {
        console.log("广告关闭", res)
        // 用户点击了【关闭广告】按钮
        if (res && res.isEnded) {
          // 正常播放结束，可以下发游戏奖励
          wx.showToast({
            title: '奖励已到账',
            icon: 'success'
          });
          await watchAd();
          // 刷新个人信息
          this.updateUserInfo();
        } else {
          // 播放中途退出，不下发游戏奖励
          wx.showToast({
            title: '广告异常关闭，无法获取积分奖励',
            icon: 'error'
          })
        }
      })
    }
  },

  async updateUserInfo() {
    const resInfo = await getUserInfo();
    if (resInfo.data.code === 200) {
      const userInfo = resInfo.data.data;
      // 将获取的用户信息保存
      this.setData({
        userCardConfig: {
          name: userInfo.name,
          avatar: userInfo.avatar_url,
          enabledSign: isMoreThan24Hours(userInfo.sign_time)
        },
        id: userInfo.id,
        score: userInfo.score,
        invite_count: userInfo.invite_count,
        share_count: userInfo.share_count
      });
    }
  },
  share() {
    wx.vibrateShort()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  openAD() {
    wx.vibrateShort()
    // 用户触发广告后，显示激励视频广告
    if (videoAd) {
      videoAd.show().catch(() => {
        // 失败重试
        console.log('12121212')
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
  },
  copyId() {
    wx.setClipboardData({
      data: this.data.id,
    })
  },
  oepnWechatGroup() {
    // 打开微信交流群
    wx.navigateTo({
      url: '/pages/wechatGroup/index',
    })
  },
  logoutFn() {
    wx.vibrateShort()
    wx.showModal({
      title: '退出登录',
      content: '确定退出登录吗',
      complete: (res) => {
        if (res.confirm) {
          wx.setStorageSync('token', '')
          wx.setStorageSync('userInfo', {})
          wx.redirectTo({
            url: '/pages/login/index',
          })
        }
      }
    })
  },
  gotoUserEditPage() {
    wx.navigateTo({
      url: '/pages/editUserInfo/index',
    })
  },
  async onCheckIn() {
    wx.vibrateShort()
    const {
      data
    } = await checkIn()
    wx.showToast({
      title: data.code === 200 ? '签到成功' : data.msg,
      icon: "none"
    })
    this.setData({
      userCardConfig: {
        ...this.properties.userCardConfig,
        enabledSign: false
      }
    })
    // 刷新个人信息
    this.updateUserInfo()
  },
  onShareAppMessage() {}
});