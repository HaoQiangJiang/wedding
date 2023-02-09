// pages/customer/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    externalClasses: ['t-class', 't-class-content', 't-class-column', 't-class-column-item', 't-class-column-item-label', 't-class-footer'],
    indexList: [],
    list: [{
        index: 'A',
        children: [{
          name: 'test',
          value: 'test',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          name: 'test1',
          value: 'test1',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          name: 'test2',
          value: 'test2',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          name: 'test3',
          value: 'test3',
          factoryPrice: 540,
          storePrice: 600,
          unit: 'kg',
          desc: '我是备注'
        }, {
          name: 'test4',
          value: 'test4',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, ],
      },
      {
        index: 'F',
        children: [{
          name: 'test5',
          value: 'test5',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注1111'
        }, {
          name: 'test6',
          value: 'test6',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }],
      },
    ],
    selectGoods: {},
    isShowMask: false
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(option) {
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
  onReady() {
    const data = this.data.list.map((item) => item.index)
    this.setData({
      indexList: data
    });
  },
  closeMask() {
    this.showMask(false)
  },
  showMask(status) {
    this.setData({
      isShowMask: status
    })
  },
  onChangePriceType(e) {
    const goods = e.currentTarget.dataset.item
    let currentGoods = this.data.selectGoods[goods.value]
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
    const key = goods.value
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
    const recordComponent = prevPage.selectComponent('#imageBill').selectComponent('#record')
    let orderPrice = 0
    let selectGoodsText = []
    Object.values(this.data.selectGoods).forEach(item => {
      if (item.count && item.count > 0) { // 去掉 count 为 0 和没有 count 的
        orderPrice += (item.isFactoryPrice ? item.factoryPrice : item.storePrice) * item.count
        selectGoodsText.push(item.name + '(' + item.count + item.unit + ')')
      }
    })
    wx.navigateBack({
      success: () => {
        recordComponent.setData({
          selectGoodsText: selectGoodsText.join('，'),
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

  }
})