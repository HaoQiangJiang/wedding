/** 获取个人中心信息 */
const baseUrl = 'https://weixin.linktmd.com/api'
var reqTime = 0; //记录请求次数
const request = (params) => {
  var header = {
    "Content-Type": "application/json",
    "X-Requested-With": 'XMLHttpRequest'
  };
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
        resolve(result);
      },
      fail: (err) => {
        reject(err);
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

// 获取所有账单信息
export async function getAllBills(data) {
  return await request({
    url: baseUrl + '/bill/findAllBills',
    method: 'POST',
    data
  })
}
// 查询所有客户
export async function queryAllCustomer() {
  return await request({
    url: baseUrl + '/client/findAll',
    method: 'post',
  })
}
// 新增客户
export async function addCustomer(data) {
  return await request({
    url: baseUrl + '/client/create',
    method: 'post',
    data
  })
}
// 编辑客户
export async function editCustomer(data) {
  const {
    name,
    phone,
    id
  } = data
  return await request({
    url: baseUrl + '/client/update/' + id,
    method: 'put',
    data: {
      name,
      phone
    }
  })
}
// 删除客户
export async function deleteCustomer(id) {
  return await request({
    url: baseUrl + '/client/delete/' + id,
    method: 'delete',
  })
}

// 查询所有商品
export async function queryAllGoods() {
  return await request({
    url: baseUrl + '/product/findAll',
    method: 'post',
  })
}
// 新增商品
export async function addGoods(data) {
  return await request({
    url: baseUrl + '/product/create',
    method: 'post',
    data
  })
}
// 编辑商品
export async function editGoods(data) {
  const {
    name,
    unit,
    remark,
    store_price,
    factory_price,
    id
  } = data
  return await request({
    url: baseUrl + '/product/update/' + id,
    method: 'put',
    data: {
      name,
      unit,
      remark,
      store_price,
      factory_price,
    }
  })
}
// 删除商品
export async function deleteGoods(id) {
  return await request({
    url: baseUrl + '/product/delete/' + id,
    method: 'delete',
  })
}