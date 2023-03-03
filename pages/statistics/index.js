import * as echarts from '../../ec-canvas/echarts';
const {
  queryStatistics,
} = require('../../api/index')
const {
  formatTime,
} = require('../../utils/util')
const colors = ['#5560f7', '#747df8', '#838bf9', '#939afa', '#a2a8fb', '#b2b7fb', ]

Page({
  data: {
    ec: {
      lazyLoad: true
    },
    chartsMap: [{
      label: '客户消费排行',
      id: 'ecClientAmount',
      height: '400rpx',
      isExtra: true,
    }, {
      label: '商品销量/盈利排行榜',
      id: 'ecProductSalesRank',
      height: '600rpx',
    }, {
      label: '月盈利趋势',
      id: 'ecProfitTrend',
      height: '600rpx',
    }],
    visible: false,
    date: formatTime(new Date(), 'YYYY-MM'),
    totalIncome: 0,
    extraChart: {},
    isRefresh: false
  },
  onLoad() {
    this.data.chartsMap.forEach(item => {
      this[item.id] = this.selectComponent(`#${item.id}`);
    })
    this.init()
  },
  onReady() {},
  onShow() {
    this.getTabBar().init();
    if (this.data.isRefresh) {
      this.setData({
        isRefresh: false
      })
      this.init()
    }

  },

  drawClientAmountRanking(data) {
    this.ecClientAmount.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      const seriesData = data.map(item => {
        return {
          name: item.client.name,
          value: item.real_amount
        }
      })
      const option = {
        color: colors,
        series: [{
          label: {
            normal: {
              fontSize: 10
            }
          },
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['50%', '90%'],
          data: seriesData,
        }]
      };
      chart.setOption(option);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.ecClientAmountChart = chart;
      return chart;
    });
  },
  drawProductSalesRanking(data, data1) {
    this.ecProductSalesRank.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      const xAxisData = []
      const seriesData = []
      const seriesData1 = []
      data.forEach(item => {
        xAxisData.push(item.product.name)
        seriesData.push(item.sales)
      })
      data1.forEach(item => {
        seriesData1.push(item.profit)
      })
      const option = {
        color: ['#fd6b6d', '#5560f7', ],
        xAxis: {
          type: 'category',
          data: xAxisData.reverse(),
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          }
        },
        series: [{
          name: '利润',
          data: seriesData1.reverse(),
          type: 'line',
          smooth: true,
          areaStyle: {},
        }, {
          name: '销量',
          data: seriesData.reverse(),
          type: 'line',
          smooth: true,
          areaStyle: {},
        }, ]
      };
      chart.setOption(option);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.ecProductSalesRankChart = chart;
      return chart;
    });
  },
  drawProfitTrend(data) {
    this.ecProfitTrend.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      const xAxisData = []
      const orderCountData = []
      data.forEach(item => {
        xAxisData.push(item.date.split('T')[0])
        orderCountData.push(item.profit)
      })
      const option = {
        color: colors,
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData.reverse(),
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
          }
        },
        series: [{
          data: orderCountData.reverse(),
          type: 'bar',
          barWidth: 15, //柱图宽度
        }]
      };
      chart.setOption(option);
      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.ecProfitTrendChart = chart;
      return chart;
    });
  },
  formateExtraData(data, nameKey, valueKey, unit = '') {
    let total = 0
    const result = data.map(item => {
      total += item[valueKey]
      return {
        name: item[nameKey].name,
        data: item[nameKey],
        value: item[valueKey],
        unit
      }
    })
    return {
      data: result,
      total
    }
  },
  async init() {
    wx.showLoading({
      title: '加载中',
    })
    const [year, month] = this.data.date.split('-')
    const {
      data
    } = await queryStatistics(year, month)
    const {
      clientAmountRanking,
      productProfitRanking,
      productSalesRanking,
      profitTrend,
      totalIncome
    } = data
    this.drawClientAmountRanking(clientAmountRanking)
    this.drawProductSalesRanking(productSalesRanking, productProfitRanking)
    this.drawProfitTrend(profitTrend)
    const extraChartData = {}
    // 组装额外的列表图表数据
    const clientAmountExtraData = this.formateExtraData(clientAmountRanking, 'client', 'real_amount', '¥')
    extraChartData['ecClientAmount'] = clientAmountExtraData
    const productProfitExtraData = this.formateExtraData(productProfitRanking, 'product', 'profit', '¥')
    extraChartData['ecProductSalesRank'] = productProfitExtraData
    this.setData({
      totalIncome,
      extraChart: extraChartData
    })
    wx.hideLoading()
  },
  confirmCalendar(e) {
    this.setData({
      date: e.detail.value
    })
    this.init()
    this.closeCalendar()
  },
  showCalendar() {
    this.setData({
      visible: true
    })
  },
  closeCalendar() {
    this.setData({
      visible: false
    })
  },
  openDetails(e) {
    const {
      item,
      id
    } = e.currentTarget.dataset
    if (id === 'ecClientAmount') {
      wx.navigateTo({
        url: '/pages/contacts/index',
        success: (res) => {
          res.eventChannel.emit('acceptBillData', {
            data: {
              client: item.data,
              date: this.data.date
            }
          })
        }
      })
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
    this.data.chartsMap.forEach(item => {
      if (this[item.id + 'Chart']) {
        this[item.id + 'Chart'].dispose()
      }
    })



  },

  /**
   * Page event handler function--Called when user drop down
   */
  async onPullDownRefresh() {
    await this.init()
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