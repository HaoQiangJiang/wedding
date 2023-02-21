// pages/customer/index.js
const {
  addCustomer,
  queryAllCustomer,
  deleteCustomer,
  editCustomer
} = require('../../api/index')
const {
  searchKeyInString,
  formateDataToIndexList,
} = require('../../utils/util')
import Toast from 'tdesign-miniprogram/toast/index';

Page({

  /**
   * Page initial data
   */
  data: {
    mode: 'manage', // 模式 manage  selsct
    value: '',
    indexList: [], // a-z 序号
    customerList: [], // 格式化之后的数据,按照 a-z 划分
    originCustomerList: [], // 原始接口数据
    addCustomerMap: [{
      label: '名称',
      value: 'name'
    }, {
      label: '电话',
      value: 'phone'
    }],
    addCustomerVisible: false,
    addCustomerData: {
      name: '',
      phone: ''
    }, // 新增客户的数据
    searchKey: '', // 搜索的客户名
    deleteVisible: false,
    operateCustomer: {}, // 操作的用户
    isEdit: false, // 是否为编辑用户
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
    this.setData({
      mode: decodeURIComponent(option?.mode || 'manage')
    })
    this.getAllCustomer()
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},
  async onPullDownRefresh() {
    await this.getAllCustomer()
    wx.stopPullDownRefresh()
    this.setData({
      searchKey: '',
    })
  },

  async getAllCustomer() {
    wx.showLoading({
      title: '正在加载...',
    })
    const {
      data
    } = await queryAllCustomer()
    const formateData = formateDataToIndexList(data.data)
    this.setData({
      originCustomerList: data.data,
      customerList: formateData,
      indexList: formateData.map(item => item.index)
    })
    wx.hideLoading()
  },
  clearSearch() {
    this.handleSearch({
      detail: {
        value: ''
      }
    })
  },
  // 搜索输入框输入
  handleSearch(e) {
    const searchData = this.data.originCustomerList.filter(item => {
      return searchKeyInString(item.name, e.detail.value)
    })
    const formateData = formateDataToIndexList(searchData)
    this.setData({
      searchKey: e.detail.value,
      customerList: formateData,
      indexList: formateData.map(item => item.index)
    })
  },
  // 新增客户输入
  changeCustomer(e) {
    const value = e.detail.value
    const key = e.currentTarget.dataset.key
    this.setData({
      addCustomerData: {
        ...this.data.addCustomerData,
        [key]: value
      }
    })
  },
  // 确定新增客户
  async submitAddCustomer() {
    const IsEmpty = Object.entries(this.data.addCustomerData).some(([key, value]) => {
      if (key === 'phone') return false
      return !value
    })
    if (IsEmpty) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请检查信息是否填写完整',
      });
      return;
    }
    let data
    if (this.data.addCustomerData.id) {
      // 编辑用户
      data = await editCustomer(this.data.addCustomerData)
    } else {
      // 新增用户
      data = await addCustomer(this.data.addCustomerData)
    }

    if (data.data.code === 200) {
      this.closeAddCustomer()
      this.getAllCustomer()
    }
  },
  openAddCustomer() {
    this.setData({
      addCustomerData: {
        name: '',
        phone: ''
      },
      addCustomerVisible: true
    })
  },
  onVisibleChange(e) {
    this.setData({
      addCustomerVisible: e.detail.visible,
    });
  },
  closeAddCustomer() {
    this.setData({
      addCustomerVisible: false
    })
  },
  onSelect(e) {
    if (this.data.mode === 'manage') {
      // 管理模式的点击事件
      wx.navigateTo({
        url: '/pages/customerEdit/index',
      })
      return
    }
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectCallBack', e.target.dataset.item)
    wx.navigateBack()
  },
  // 确定删除
  async submitDelete() {
    const id = this.data.operateCustomer.id
    const {
      data
    } = await deleteCustomer(id)
    if (data.code === 200) {
      this.closeDelete()
      this.getAllCustomer()
    }
  },
  openDelete(e) {
    const operateCustomer = e.currentTarget.dataset.item
    this.setData({
      deleteVisible: true,
      operateCustomer
    })
  },
  closeDelete() {
    this.setData({
      deleteVisible: false
    })
  },
  onEdit(e) {
    const data = e.currentTarget.dataset.item
    console.log(data)
    this.setData({
      addCustomerVisible: true,
      addCustomerData: data
    })
  },
  /**
   * Lifecycle function--Called when page show
   */
  onShow() {

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
   * Called when page reach bottom
   */
  onReachBottom() {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage() {

  }
})