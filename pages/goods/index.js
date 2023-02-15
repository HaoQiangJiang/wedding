const {
  addGoods,
  queryAllGoods,
  editGoods,
  deleteGoods
} = require('../../api/index')
const {
  searchKeyInString,
  formateDataToIndexList,
} = require('../../utils/util')
import Toast from 'tdesign-miniprogram/toast/index';
const defaultGoods = {
  name: '',
  unit: '',
  store_price: 0,
  factory_price: 0,
  remark: ''
}
Page({

  /**
   * Page initial data
   */
  data: {
    mode: 'manage',
    indexList: [],
    goodsList: [],
    originGoodsList: [],
    selectGoods: {},
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
      value: 'store_price'
    }, {
      label: '门店价',
      value: 'factory_price'
    }, {
      label: '备注',
      value: 'remark'
    }],
    addGoodsData: defaultGoods,
    deleteVisible: false,
    operateGoods: {},
    refresh: false,
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
    this.setData({
      mode: decodeURIComponent(option?.mode || 'manage')
    })
    this.getAllGoods()
    const eventChannel = this.getOpenerEventChannel()
    if (!eventChannel) return;
    eventChannel.on('acceptDataFromOpenerPage', (data) => {
      console.log(data)
      this.setData({
        selectGoods: data.data
      })
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {},
  // 确定删除
  async submitDelete() {
    const id = this.data.operateGoods.id
    const {
      data
    } = await deleteGoods(id)
    if (data.code === 200) {
      // 如果 selectGoods 里面有也要删除
      const selectGoodsBak = {
        ...this.data.selectGoods
      }
      delete selectGoodsBak[this.data.operateGoods.id]
      this.setData({
        selectGoods: selectGoodsBak
      })
      this.closeDelete()
      this.getAllGoods()
    }
  },
  openDelete(e) {
    const operateGoods = e.currentTarget.dataset.item
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
    this.setData({
      addGoodsVisible: true,
      addGoodsData: data
    })
  },
  async getAllGoods(isShowLoading) {
    isShowLoading && wx.showLoading({
      title: '正在加载...',
    })
    const {
      data
    } = await queryAllGoods()
    console.log(data)
    const {
      list
    } = data.data
    const formateData = formateDataToIndexList(list)
    this.setData({
      originGoodsList: list,
      goodsList: formateData,
      indexList: formateData.map(item => item.index)
    })
    wx.hideLoading()
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
    const IsEmpty = Object.entries(this.data.addGoodsData).some(([key, value]) => {
      if (key === 'remark') return false // remark 不检查
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
    if (this.data.addGoodsData.id) {
      data = await editGoods(this.data.addGoodsData)
      // 修改了商品,选择列表也要修改
      const selectGoodsBak = {
        ...this.data.selectGoods
      }
      if (selectGoodsBak[this.data.addGoodsData.id]) {
        console.log(selectGoodsBak, this.data.addGoodsData)
        selectGoodsBak[this.data.addGoodsData.id] = {
          ...selectGoodsBak[this.data.addGoodsData.id],
          ...this.data.addGoodsData
        }
        this.setData({
          selectGoods: selectGoodsBak
        })
      }
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
      // 转为 number 类型
      value = Number(value)
    }
    this.setData({
      addGoodsData: {
        ...this.data.addGoodsData,
        [key]: value
      }
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
    console.log(searchData, formateData, this.data.originGoodsList)
    this.setData({
      searchKey: e.detail.value,
      goodsList: formateData,
      indexList: formateData.map(item => item.index)
    })
  },
  onChangePriceType(e) {
    const goods = e.currentTarget.dataset.item
    let currentGoods = this.data.selectGoods[goods.id]
    let isFactoryPrice
    if (currentGoods) {
      isFactoryPrice = !currentGoods.isFactoryPrice
    } else {
      isFactoryPrice = true
    }
    this.replaceGoodsCount({
      detail: {
        goods,
        updateData: {
          isFactoryPrice
        }
      }
    })

  },
  // 增加商品个数
  replaceGoodsCount(event) {
    const {
      goods,
      updateData
    } = event.detail
    // 如果商品未选中,则增加到选中列表
    const key = goods.id
    if (!this.data.selectGoods[key]) {
      const bak = {
        ...this.data.selectGoods
      }
      Object.assign(bak, {
        [key]: {
          ...updateData,
          ...goods,
        }
      })
      this.setData({
        selectGoods: bak
      })
    } else {
      const selectGoodsBak = {
        ...this.data.selectGoods[key],
        ...updateData
      }
      this.setData({
        selectGoods: {
          ...this.data.selectGoods,
          [key]: selectGoodsBak
        }
      })
    }
  },
  submit() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    // 获取 record 组件
    const recordComponent = prevPage.selectComponent('#record')
    let orderPrice = 0
    let selectGoodsText = []
    Object.values(this.data.selectGoods).forEach(item => {
      if (item.count && item.count > 0) { // 去掉 count 为 0 和没有 count 的
        orderPrice += (item.isFactoryPrice ? item.factory_price : item.store_price) * item.count
        selectGoodsText.push(item.name + '(' + (item.isFactoryPrice ? item.factory_price : item.store_price) + item.unit + ')' + '*' + item.count + item.unit)
      }
    })
    wx.navigateBack({
      success: () => {
        recordComponent.setData({
          selectGoodsText: selectGoodsText.join('\n'),
          selectGoods: this.data.selectGoods,
          orderPrice,
          price: orderPrice
        })
      }
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
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    await this.getAllGoods(false)
    setTimeout(() => {
      this.setData({
        searchKey: '',
        refresh: false
      })
    }, 500);
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