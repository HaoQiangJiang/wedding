const {
  addGoods,
  queryAllGoods,
  editGoods,
  deleteGoods
} = require('../../api/index')
const {
  searchKeyInString,
  formateDataToIndexList,
  ObjectReflection,
  isNumber
} = require('../../utils/util')
import Toast from 'tdesign-miniprogram/toast/index';
const defaultGoods = {
  name: '',
  unit: '',
  store_price: '',
  factory_price: '',
  remark: ''
}
Page({
  data: {
    mode: 'manage',
    indexList: [],
    goodsList: [],
    originGoodsList: [],
    propsGoods: [], // 外部传入的商品
    searchKey: '',
    addGoodsVisible: false,
    addGoodsMap: [{
      label: '名称',
      value: 'name'
    }, {
      label: '单位',
      value: 'unit'
    }, {
      label: '工厂价',
      value: 'factory_price'
    }, {
      label: '门店价',
      value: 'store_price'
    }, {
      label: '备注',
      value: 'remark'
    }],
    addGoodsData: defaultGoods,
    deleteVisible: false,
    operateGoods: {},
    focusIndex: -1,
    priceVisible: false,
    priceMap: [{
      name: '门店价',
      value: 'store_price'
    }, {
      name: '工厂价',
      value: 'factory_price'
    }, {
      name: '自定义',
      value: 'customPrice'
    }],
    priceError: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
    this.setData({
      mode: decodeURIComponent(option?.mode || 'manage')
    })
    this.getAllGoods()
    // 接受传入的参数
    const eventChannel = this.getOpenerEventChannel()
    if (!eventChannel) return;
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      this.setData({
        propsGoods: data.data
      })
    })
  },

  // 确定删除
  async submitDelete() {
    const id = this.data.operateGoods.id
    const {
      data
    } = await deleteGoods(id)
    if (data.code === 200) {
      this.closeDelete()
      this.getAllGoods()
    }
  },
  openDelete(e) {
    const id = e.currentTarget.dataset.id
    const operateGoods = this.data.originGoodsList.find(item => item.id === id)
    this.setData({
      deleteVisible: true,
      operateGoods
    })
  },
  closeDelete() {
    this.setData({
      deleteVisible: false
    })
  },
  onEdit(e) {
    const data = e.currentTarget.dataset.item
    console.log(ObjectReflection(defaultGoods, data))
    this.setData({
      addGoodsVisible: true,
      addGoodsData: {
        id: data.id,
        ...ObjectReflection(defaultGoods, data)
      }
    })
  },
  getSelectGoods() {
    return this.data.originGoodsList.filter(item => item.count > 0)
  },
  replaceProperty(list, id) {
    if (list.length === 0) return null
    const item = list.find(v => v.id === id)
    if (!item) return null
    return {
      priceType: item.priceType,
      customPrice: item.customPrice,
      count: item.count
    }
  },
  async getAllGoods() {
    // 调用前先保存选中的商品
    const tempSelectGoods = this.getSelectGoods()
    wx.showLoading({
      title: '正在加载...',
    })
    const {
      data
    } = await queryAllGoods()
    wx.hideLoading()
    const {
      list
    } = data.data
    list.forEach(item => {
      // 外部带过来的数据
      item.priceType = 'store_price' // 选择的价格类型
      item.customPrice = 0 // 自定义价格
      item.count = 0 // 选择的数量
      console.log()
      const propGood = this.replaceProperty(this.data.propsGoods, item.id)
      if (propGood) {
        item.priceType = propGood.priceType
        item.count = propGood.count
        item.customPrice = propGood.customPrice
      }
      const tempGood = this.replaceProperty(tempSelectGoods, item.id)
      if (tempGood) {
        item.priceType = tempGood.priceType
        item.count = tempGood.count
        item.customPrice = tempGood.customPrice
      }
    })
    const formateData = formateDataToIndexList(list)
    this.setData({
      originGoodsList: list,
      goodsList: formateData,
      indexList: formateData.map(item => item.index)
    })
  },
  openAddGoods() {
    this.setData({
      addGoodsVisible: true,
      addGoodsData: defaultGoods,
    })
  },
  closeAddGoods() {
    this.setData({
      addGoodsVisible: false
    })
  },
  onVisibleChange(e) {
    this.setData({
      addGoodsVisible: e.detail.visible,
    });
  },
  // 确定新增商品
  async submitAddGoods() {
    console.log(this.data.addGoodsData)
    const IsEmpty = Object.entries(this.data.addGoodsData).some(([key, value]) => {
      if (key === 'remark') return false // remark 不检查
      return value === ''
    })
    if (IsEmpty) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '请检查信息是否完整',
      });
      return;
    }
    if (this.data.priceError) {
      return wx.showToast({
        title: '请检查金额是否正确',
        icon: 'none'
      })
    }
    let data
    if (this.data.addGoodsData.id) {
      data = await editGoods(this.data.addGoodsData)
    } else {
      // 新增用户
      data = await addGoods(this.data.addGoodsData)
    }
    if (data.data.code === 200) {
      this.closeAddGoods()
      this.getAllGoods()
    }
  },
  // 新增输入框修改
  changeGoodsInput(e) {
    let value = e.detail.value
    const key = e.currentTarget.dataset.key
    if (['factory_price', 'store_price'].includes(key)) {
      const result = isNumber(value);
      if (this.data.priceError === result) {
        return this.setData({
          priceError: !result,
        });
      }
    }
    this.setData({
      addGoodsData: {
        ...this.data.addGoodsData,
        [key]: value
      }
    })
  },
  // 回车
  enter(e) {
    console.log(e)
    const index = e.currentTarget.dataset.index
    this.setData({
      focusIndex: index + 1
    })
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
    const searchData = this.data.originGoodsList.filter(item => {
      return searchKeyInString(item.name, e.detail.value)
    })
    const formateData = formateDataToIndexList(searchData)
    this.setData({
      searchKey: e.detail.value,
      goodsList: formateData,
      indexList: formateData.map(item => item.index)
    })
  },
  onChangePriceType(e) {
    this.data.operateGoods.priceType = e.detail.value
    this.setData({
      operateGoods: this.data.operateGoods,
      goodsList: this.data.goodsList // 更新下这个数据 让 ui 刷新
    })
    console.log(this)
  },

  submit() {
    // 找出 count 不等于 0 的, 则是为选择的商品
    const result = this.data.originGoodsList.filter(item => item.count > 0)
    console.log(result)
    let orderPrice = 0
    result.forEach(item => {
      orderPrice += (item[item.priceType]) * item.count
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('selectCallBack', {
      selectGoods: result,
      orderPrice,
      price: orderPrice
    })
    wx.navigateBack()
  },

  closePrice() {
    this.setData({
      priceVisible: false
    })
  },
  openPrice(e) {
    const id = e.currentTarget.dataset.id
    const operateGoods = this.data.originGoodsList.find(item => item.id === id)
    this.setData({
      operateGoods,
      priceVisible: true
    })
  },
  changePartPay(e) {
    // 修改自定义金额
    const {
      value
    } = e.detail
    const result = isNumber(value);
    if (this.data.priceError === result) {
      return this.setData({
        priceError: !result,
      });
    }
    this.data.operateGoods.customPrice = Number(e.detail.value)
    this.setData({
      operateGoods: this.data.operateGoods,
      goodsList: this.data.goodsList
    })
  },
  changeGoodsCount(e) {
    const {
      uuid,
      value
    } = e.detail
    const operateGoods = this.data.originGoodsList.find(item => item.id === uuid)
    operateGoods.count = value
    this.setData({
      operateGoods
    })
  },
  submitPrice() {
    this.closePrice()
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
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    await this.getAllGoods()
    this.setData({
      searchKey: '',
    })
    wx.stopPullDownRefresh()
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