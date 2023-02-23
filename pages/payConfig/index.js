const {
  uploadTagline,
  uploadQRCode,
  getUserInfo
} = require('../../api/index')
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
      this.setData({
        tagline: userInfo.tagline,
        fileList: [{
          url: 'https://weixin.linktmd.com/' + userInfo.qr_code
        }]
      })
    }
  },
  async changTagline(e) {
    const value = e.detail.value
    const res = await uploadTagline({
      tagline: value
    })

  },
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