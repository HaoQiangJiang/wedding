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
                const userInfo = resInfo.data.data
                // 将获取的用户信息保存
                wx.setStorageSync('userInfo', userInfo)
                resolve(true)
              } else {
                console.log('获取 userInfo 失败')
                failCallback && failCallback()
                resolve(false)
              }
            } else {
              console.log('获取微信 code 失败')
              failCallback && failCallback()
              resolve(false)
            }
          },
          fail: (error) => {
            console.log(error)
            failCallback && failCallback()
            resolve(false)
          }
        })
      },
      fail: (error) => {
        console.log(error)
        failCallback && failCallback()
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