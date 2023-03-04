const Decimal = require("decimal.js");
const {
  deleteBill,
  queryBillById,
  updateBillStatus,
  singleRepayment
} = require("../../api/index");
const {
  formateBillDetailsToEditBill
} = require('../../utils/util')

Page({
  data: {
    isOverShare: true,
    billData: {},
    deleteVisible: false,
    visible: false,
    isShowRecord: true,
    repayVisible: false,
    maxRepay: 0,
    isRefresh: false,
  },
  // 刷新订单
  async refreshBill() {
    wx.showLoading({
      title: '修改中',
    })
    const {
      data
    } = await queryBillById(this.data.billData.id)
    this.setData({
      billData: data.data,
      maxRepay: new Decimal(data.data.real_amount).sub(data.data.paid_amount).toNumber(),
    })
    wx.hideLoading()
    this.setPrevPageRefresh()
  },

  // 提交账单
  closeBill() {
    this.setData({
      visible: false
    });
  },
  // 记一笔
  addBill() {
    if (this.data.billData.pay_records.length > 0) {
      return wx.showToast({
        title: '已存在支付记录,不再支持编辑账单',
        icon: 'none'
      })
    }
    this.setData({
      visible: true,
    })
    this.setRecord(this.data.billData)

  },
  setRecord(data) {
    const recordComponent = this.selectComponent('#record')
    recordComponent.setData(formateBillDetailsToEditBill(data))
  },
  onVisibleChange(e) {
    this.setData({
      visible: e.detail.visible,
    });
  },

  openDelete() {
    this.setData({
      deleteVisible: true
    })
  },
  closeDelete() {
    this.setData({
      deleteVisible: false
    })
  },
  closeRepay() {
    this.setData({
      repayVisible: false,
    })
  },
  openRepay() {
    this.setData({
      repayVisible: true,
    })
  },
  async submitRepay(e) {
    const {
      isAllPay,
      partPay,
      remark
    } = e.detail
    if (isAllPay) {
      this.data.billData.pay_status = 1
      await updateBillStatus(this.data.billData.id, {
        pay_status: this.data.billData.pay_status,
        remark
      })
    } else {
      const params = {
        "bill_id": this.data.billData.id,
        "repayment_amount": Number(partPay),
        remark
      }
      await singleRepayment(params)
    }
    this.refreshBill()
  },
  setPrevPageRefresh() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      isRefresh: true
    })
  },
  // 确定删除
  async submitDelete() {
    await deleteBill(this.data.billData.id)
    this.setPrevPageRefresh()
    wx.navigateBack()
  },

  onLoad(option) {
    const eventChannel = this.getOpenerEventChannel()
    if (!eventChannel) return;
    eventChannel.on('acceptBillData', (data) => {
      this.setData({
        billData: data.data,
        maxRepay: new Decimal(data.data.real_amount).sub(data.data.paid_amount).toNumber(),
      })
    })
  },
  setPrevPageRefresh() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
      isRefresh: true
    })
  },
  onShow() {
    if (this.data.isRefresh) {
      this.setData({
        isRefresh: false
      })
      this.refreshBill()
    }
  },

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
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh() {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {
    return {
      title: '您有一份新账单请注意查收',
      path: '/pages/share/index?id=' + this.data.billData.id,
    }
  }
})