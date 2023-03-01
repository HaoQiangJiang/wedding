import Dialog from 'tdesign-miniprogram/dialog/index';
const {
  formatArrayByKey,
} = require('../../utils/util')
const {
  getAllRecycleBill,
  deleteRecycleBill,
  recoverRecycleBill
} = require('../../api/index')

Page({
  data: {
    visible: false,
    recordVisible: false,
    refresh: false,
    allBill: [], // 所有账单信息
    clientId: '', // 当前用户的 id
  },

  async init() {
    wx.showLoading({
      title: '加载中',
    })
    const params = {
      "payStatus": -1 // -1 查全部
    }
    const {
      data
    } = await getAllRecycleBill(params)
    const result = formatArrayByKey(data.data.list, 'created_at')
    this.setData({
      allBill: result,
    })
    wx.hideLoading()
  },

  onRestore(e) {
    const item = e.currentTarget.dataset.item
    const dialogConfig = {
      context: this,
      title: '还原此账单',
      content: '请确定是否还原此账单!',
      confirmBtn: '确定',
      cancelBtn: '取消',
    };

    Dialog.confirm(dialogConfig)
      .then(async () => {
        await recoverRecycleBill(item.id)
        this.init()
      })
      .catch(() => console.log('点击了取消'))
      .finally(() => Dialog.close());
  },
  onOpenDelete(e) {
    const item = e.currentTarget.dataset.item
    const dialogConfig = {
      context: this,
      title: '在回收站删除',
      content: '删除后无法恢复, 请确定是否删除!',
      confirmBtn: '确定',
      cancelBtn: '取消',
    };

    Dialog.confirm(dialogConfig)
      .then(async () => {
        await deleteRecycleBill(item.id)
        this.init()
      })
      .catch(() => console.log('点击了取消'))
      .finally(() => Dialog.close());
  },

  async onPullDownRefresh() {
    await this.init()
    wx.stopPullDownRefresh()
  },
  onLoad(options) {
    this.init()
  },

  onReady() {},

  onShow() {},
  /**
   * Lifecycle function--Called when page hide
   */
  onHide() {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload() {

  },


  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})