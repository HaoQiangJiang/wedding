/** 获取个人中心信息 */
const baseUrl = 'https://weixin.linktmd.com/api'
var reqTime = 0; //记录请求次数
const header = {
  "content-type": "application/json",
  "X-Requested-With": 'XMLHttpRequest'
};

const request = (params) => {
  let token = wx.getStorageSync("token");
  if (token) {
    header["Authorization"] = `Bearer ${token}`;
  }
  reqTime++;
  //返回
  return new Promise((resolve, reject) => {
    wx.request({
      //解构params获取请求参数
      ...params,
      header,
      success: (result) => {
        if (result.data.code === 401) {
          // 跳转登录页
          wx.navigateTo({
            url: '/pages/login/index'
          })
        } else {
          resolve(result);
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络连接失败',
          icon: 'error'
        })
        wx.hideLoading()
        resolve(err);
      },
      complete: () => {
        reqTime--;
      }
    });
  });
}

// 微信登录
export async function wxLogin(params) {
  const {
    data
  } = await request({
    url: baseUrl + '/auth/login',
    method: 'POST',
    data: params,
  })
  if (data.code === 200) {
    wx.setStorageSync('token', data.data)
  }
  return data
}

// 获取用户信息
export async function getUserInfo() {
  return await request({
    url: baseUrl + '/user/profile',
    method: 'get',
  })
}

// 更新用户信息
export async function updateUserInfo(data) {
  return await request({
    url: baseUrl + '/user/updateProfile',
    method: 'PUT',
    data
  })
}