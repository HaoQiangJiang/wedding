const {
  uploadTagline,
  uploadQRCode,
  getUserInfo
} = require('../../api/index')
const {
  debounce
} = require('../../utils/util')
Page({
  data: {
    tagline: '',
    gridConfig: {
      column: 1,
      width: 150,
      height: 150
    },
    fileList: [],
  },
  onLoad(options) {
    this.updateUserInfo()
  },
  async updateUserInfo() {
    const resInfo = await getUserInfo()
    if (resInfo.data.code === 200) {
      const userInfo = resInfo.data.data
      // 将获取的用户信息保存
      wx.setStorageSync('userInfo', userInfo)
      const fileList = []
      if (userInfo.qr_code) {
        fileList.push({
          url: 'https://weixin.linktmd.com/' + userInfo.qr_code
        })
      }
      this.setData({
        tagline: userInfo.tagline,
        fileList
      })
    }
  },
  changTagline: debounce(async function (e) {
    const value = e.detail.value
    const res = await uploadTagline({
      tagline: value
    })

  }, 1000),
  handleAdd(e) {
    const {
      fileList
    } = this.data;
    const {
      files
    } = e.detail;
    files.forEach(file => this.onUpload(file))
  },
  async onUpload(file) {
    const {
      fileList
    } = this.data;

    this.setData({
      fileList: [...fileList, {
        ...file,
        status: 'loading'
      }],
    });
    const {
      length
    } = fileList;
    const res = await uploadQRCode(file)
    if (res) {
      this.setData({
        [`fileList[${length}].status`]: 'done',
      });
    }
  },
  handleRemove(e) {
    const {
      index
    } = e.detail;
    const {
      fileList
    } = this.data;

    fileList.splice(index, 1);
    this.setData({
      fileList,
    });
  },

});