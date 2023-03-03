const {
  updateUserInfo,
} = require('../../api/index')
const {
  debounce
} = require('../../utils/util')
Page({
  data: {
    focusIndex: 0,
    formMap: [{
      label: '邮箱',
      value: 'email',
    }, {
      label: '钉钉 AccessToken',
      value: 'access_token',
    }, {
      label: '钉钉 secret',
      value: 'secret',
    }],
    data: {
      email: '',
      access_token: '',
      secret: ''
    }

  },
  onLoad(options) {
    wx.getStorage({
      key: 'userInfo',
      success: (userInfo) => {
        this.setData({
          data: {
            email: userInfo.data.email,
            access_token: userInfo.data.access_token,
            secret: userInfo.data.secret
          }
        })
      }
    })
  },

  debounceChangeData: debounce(async function (key, value) {
    await updateUserInfo({
      [key]: value
    })

  }, 1000),
  changeData(e) {
    const {
      value
    } = e.detail
    const key = e.currentTarget.dataset.item
    this.setData({
      data: {
        ...this.data.data,
        [key]: value
      }
    })
    this.debounceChangeData([key], value)
  },
  enter(e) {
    const index = e.currentTarget.dataset.index
    this.setData({
      focusIndex: index + 1
    })
  }
});