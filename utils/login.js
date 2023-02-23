const {
  wxLogin,
  getUserInfo
} = require('../api/index')
export function login(failCallback) {
  return new Promise(resolve => {
    wx.showLoading({
      title: '正在登录...',
    })
    wx.login({
      success: (res) => {
        wx.getUserInfo({
          success: async (userInfo) => {
            const {
              iv,
              encryptedData
            } = userInfo
            const data = await wxLogin({
              iv,
              encryptedData,
              code: res.code
            })
            if (data.code === 200) {
              // 登录成功
              const resInfo = await getUserInfo()
              if (resInfo.data.code === 200) {
                wx.hideLoading()
                const userInfo = resInfo.data.data
                // 将获取的用户信息保存
                wx.setStorageSync('userInfo', userInfo)
                resolve(true)
              } else {
                console.log('获取 userInfo 失败')
                failCallback()
                resolve(false)
              }
            } else {
              console.log('获取微信 code 失败')
              failCallback()
              resolve(false)
            }
          },
          fail: (error) => {
            console.log(error)
            failCallback()
            resolve(false)
          }
        })
      },
      fail: (error) => {
        console.log(error)
        failCallback()
        resolve(false)
      }
    })
  })
}

export function logout() {
  wx.setStorageSync('token', '')
  wx.setStorageSync('userInfo', {})
  wx.redirectTo({
    url: '/pages/login/index',
  })
}