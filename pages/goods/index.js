// pages/customer/index.js
Page({

  /**
   * Page initial data
   */
  data: {
    indexList: [],
    list: [{
        index: 'A',
        children: [{
          label: '瓜子',
          value: 'test',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子1',
          value: 'test1',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, ],
      },
      {
        index: 'F',
        children: [{
          label: '花生 1',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注1111'
        }, {
          label: ' 花生 2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: ' 花生 3',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }, {
          label: '瓜子2',
          value: 'guazi',
          factoryPrice: 20,
          storePrice: 30,
          unit: 'kg',
          desc: '我是备注'
        }],
      },

    ],
    selectGoods: {

    },
    buttonProps: {
      ghost: true,
      block: true,
      variant: 'outline'
    }
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {

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
  handleSelectGoods(e) {
    this.setData({
      selectGoods: {
        ...this.data.selectGoods,
        ...e.detail
      }
    })

  },
  submit() {
    const pages = getCurrentPages();
    const prevPage = pages[pages.length - 2]; //上一个页面
    // 获取 record 组件
    const recordComponent = prevPage.selectComponent('#imageBill').selectComponent('#record')
    wx.navigateBack({
      success: () => {
        recordComponent.setData({
          goods: JSON.stringify(this.data.selectGoods)
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