/** 获取个人中心信息 */
const baseUrl = 'https://ai.linktmd.com/api'
// const baseUrl = 'http://localhost'
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
      complete: (res) => {
        console.log(res)
      },
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
  const data = await request({
    url: baseUrl + '/user/profile',
    method: 'get',
  })
  if (data.data.code === 200) {
    const userInfo = data.data.data;
    // 将获取的用户信息保存
    wx.setStorageSync('userInfo', userInfo);
  }
  return data
}

// 更新用户信息
export async function updateUserInfo(data) {
  return await request({
    url: baseUrl + '/user/updateProfile',
    method: 'PUT',
    data
  })
}

export async function testChat(data) {
  return await request({
    url: 'https://api.aioschat.com/',
    method: 'post',
    data: {
      "messages": [{
        "role": "user",
        "content": `请帮我写${data.tag}，根据以下内容写：${data.content}`
      }],
      "model": "gpt-3.5-turbo",
      "tokensLength": 27
    }
  })
}

// chatgpt 聊天接口
export async function chat(data) {
  return await request({
    url: baseUrl + '/ai/chat/' + data.id,
    method: 'post',
    data: data.params
  })
}
// 创建房间
export async function createChatRoom(data) {
  return await request({
    url: baseUrl + '/ai/createRoom',
    method: 'post',
    data
  })
}
// 更新房间信息
export async function updateRoom(rid, data) {
  return await request({
    url: baseUrl + '/ai/updateRoom/' + rid,
    method: 'put',
    data,
  })
}

// 查看所有聊天记录
export async function getChatRecod(type) {
  return await request({
    url: baseUrl + '/ai/findAllRoom?type=' + type,
    method: 'post',
  })
}


export async function chatToImage(data) {
  return await request({
    url: baseUrl + '/ai/genImg/' + data.id,
    method: 'post',
    data: data.params
  })
}
// 获取 ai 内容
export async function getAiData(url, data) {
  return await request({
    url: baseUrl + url,
    method: 'post',
    data
  })
}

export async function checkIn() {
  return await request({
    url: baseUrl + '/user/sign',
    method: 'post',
  })
}


export async function share() {
  return await request({
    url: baseUrl + '/user/share',
    method: 'post',
  })
}

export async function watchAd() {
  return await request({
    url: baseUrl + '/user/watchAd',
    method: 'post',
  })
}

export async function collectPoetry(data) {
  return await request({
    url: baseUrl + '/poem/create',
    method: 'post',
    data
  })
}
export async function reduceScore(score) {
  return await request({
    url: baseUrl + '/user/simpleDecrease?score=' + score,
    method: 'get',
  })
}

// 点击广告统计
export async function addAdStatistics(type) {
  return await request({
    url: baseUrl + `/advertise/create/${type}`,
    method: 'get',
  })
}

// 获取广告统计列表
export async function getAdStatistics() {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1; // getMonth() 返回的月份从 0 开始，所以需要加 1
  const day = today.getDate();
  return await request({
    url: baseUrl + `/advertise/getStatistics?year=${year}&month=${month}&day=${day}`,
    method: 'get',
  })
}

// 提现
export async function withDraw() {
  return await request({
    url: baseUrl + `/withdraw/apply`,
    method: 'post',
  })
}