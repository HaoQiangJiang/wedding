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
  data.factory_price = Number(data.factory_price)
  data.store_price = Number(data.store_price)
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
      store_price: Number(store_price),
      factory_price: Number(factory_price),
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

// 创建账单
export async function createBill(data) {
  return await request({
    url: baseUrl + '/bill/create',
    method: 'post',
    data,
  })
}

// 修改账单
export async function updateBill(id, data) {
  console.log(data)
  return await request({
    url: baseUrl + '/bill/update/' + id,
    method: 'put',
    data,
  })
}
// 修改订单状态
export async function updateBillStatus(id, data) {
  return await request({
    url: baseUrl + '/bill/updateStatus?id=' + id,
    method: 'put',
    data,
  })
}
// 单账单还款
export async function singleRepayment(data) {
  return await request({
    url: baseUrl + '/bill/singleRepayment',
    method: 'post',
    data,
  })
}
// 多账单还款
export async function multiRepayment(data) {
  return await request({
    url: baseUrl + '/bill/multiRepayment',
    method: 'post',
    data,
  })
}
// 查询未支付金额
export async function getUnPayMoney(data) {
  return await request({
    url: baseUrl + '/bill/findAllUnpaidBills',
    method: 'post',
    data,
  })
}
// 查询所有账单
export async function queryAllBill(data) {
  return await request({
    url: baseUrl + '/bill/findAllBills',
    method: 'post',
    data,
  })
}

// 查询分享的账单
export async function getShareBill(uid, cid, startTime, endTime) {
  return await request({
    url: baseUrl + `/public/getBillingByTime?cid=${cid}&uid=${uid}&startTime=${startTime}&endTime=${endTime}`,
    method: 'get',
  })
}

// 根据 id 查询订单
export async function queryBillById(id) {
  return await request({
    url: baseUrl + '/bill/findOne/' + id,
    method: 'get',
  })
}
// 删除账单
export async function deleteBill(id) {
  return await request({
    url: baseUrl + '/bill/delete/' + id,
    method: 'delete',
  })
}

// 查询今日昨日销量销售额订单数
export async function queryBillAmountAndCount() {
  return await request({
    url: baseUrl + '/bill/getBillAmountAndCount',
    method: 'get',
  })
}

// 查询年度收益统计情况
export async function queryBillAmount() {
  return await request({
    url: baseUrl + '/bill/getBillAmount',
    method: 'get',
  })
}

// 与客户的年度收益统计情况
export async function queryBillAmountByClientId(id) {
  return await request({
    url: baseUrl + '/bill/getBillAmountByClientId/' + id,
    method: 'get',
  })
}

// 统计接口statistics/getStatistics
export async function queryStatistics(year, month) {
  return await request({
    url: baseUrl + `/statistics/getStatistics?year=${year}&month=${month}`,
    method: 'get',
  })
}

// 获取分享账单详情
export async function getShareBillDetails(id) {
  return await request({
    url: baseUrl + `/public/getBillingDetails?id=${id}`,
    method: 'get',
  })
}

// 用户上传标语
export async function uploadTagline(data) {
  return await request({
    url: baseUrl + `/user/uploadTagline`,
    method: 'post',
    data
  })
}
// 上传用户二维码
export async function uploadQRCode(file) {
  header['content-type'] = 'multipart/form-data'
  return new Promise(resolve => {
    wx.uploadFile({
      url: baseUrl + `/user/uploadQRCode`,
      header,
      filePath: file.url,
      name: 'file',
      success: () => {
        resolve(true)
      },
      fail: () => {
        resolve(false)
      }
    })
  })
}

// 回收站查询所有
export async function getAllRecycleBill(data) {
  return await request({
    url: baseUrl + `/billRecycle/findAllBills`,
    method: 'post',
    data
  })
}
// 删除回收站 
export async function deleteRecycleBill(id) {
  return await request({
    url: baseUrl + `/billRecycle/delete/${id}`,
    method: 'delete',
  })
}
// 恢复回收站
export async function recoverRecycleBill(id) {
  return await request({
    url: baseUrl + `/billRecycle/recover?id=${id}`,
    method: 'post',
  })
}