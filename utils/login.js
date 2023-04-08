const {
  wxLogin,
  getUserInfo
} = require('../api/index')

function backLoginPage() {
  wx.redirectTo({
    url: '/pages/login/index',
  })
}
export function checkLogin(invite_code) {
  return new Promise(resolve => {
    const retryLogin = async () => {
      const result = await login(invite_code, backLoginPage)
      resolve(result)
    }
    wx.getStorage({
      key: 'token',
      success: (res) => {
        if (!res.data) {
          // 没有 token 登录
          retryLogin()
        }
        resolve(true)
      },
      fail: () => {
        retryLogin()
      }
    })
  })
}
export function login(invite_code, failCallback) {

  return new Promise(resolve => {
    wx.showLoading({
      title: '正在登录...',
    })
    const loginFail = () => {
      wx.hideLoading()
      failCallback && failCallback()
      resolve(false)
    }
    wx.login({
      success: (res) => {
        wx.getUserInfo({
          success: async (userInfo) => {
            const {
              iv,
              encryptedData
            } = userInfo
            const data = await wxLogin({
              invite_code,
              iv,
              encryptedData,
              code: res.code
            })
            if (data.code === 200) {
              // 登录成功
              const resInfo = await getUserInfo()
              if (resInfo.data.code === 200) {
                wx.hideLoading()
                resolve(true)
              } else {
                console.log('获取 userInfo 失败')
                loginFail()
              }
            } else {
              console.log('获取微信 code 失败')
              loginFail()
            }
          },
          fail: (error) => {
            console.log('获取用户信息失败')
            loginFail()
          }
        })
      },
      fail: (error) => {
        console.log('wx login 失败')
        loginFail()
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