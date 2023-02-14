import * as echarts from '../../ec-canvas/echarts';
import dayjs from 'dayjs';

const {
  formatTime,
} = require('../../utils/util')
const colors = ['#1b55de', '#4272e2', '#5680e4', '#698ee6', '#7d9de8', '#90abeb']

function initChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: colors,
    series: [{
      label: {
        normal: {
          fontSize: 10
        }
      },
      type: 'pie',
      center: ['50%', '50%'],
      radius: ['40%', '80%'],
      data: [{
        value: 55,
        name: '陈本拯'
      }, {
        value: 20,
        name: '陈本拯 1'
      }, {
        value: 10,
        name: '陈本拯 3'
      }, {
        value: 20,
        name: '陈本拯 2'
      }, {
        value: 38,
        name: '陈本拯 6'
      }]
    }]
  };

  chart.setOption(option);
  return chart;
}

function initGoodsChart(canvas, width, height, dpr) {
  const chart = echarts.init(canvas, null, {
    width: width,
    height: height,
    devicePixelRatio: dpr // new
  });
  canvas.setChart(chart);

  var option = {
    color: colors,
    xAxis: {
      type: 'category',
      data: ['坚果', '花生', '矿泉水', '奶茶', '茶叶', '苹果', '草莓']
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar',
      barWidth: 15, //柱图宽度
    }]
  };

  chart.setOption(option);
  return chart;
}
Page({
  onShareAppMessage: function (res) {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () {},
      fail: function () {}
    }
  },
  data: {
    ecCustomer: {
      disableTouch: true,
      onInit: initChart
    },
    ecGoods: {
      disableTouch: true,
      onInit: initGoodsChart
    },
    visible: false,
    month: formatTime(new Date(), 'YYYY-MM'),
    totalRank: 0,
    goodsRank: []

  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad(options) {
    this.initGoodsRankData()
    console.log(dayjs().subtract(1, 'year').valueOf())
    console.log(new Date(2023, 1, 1).getTime())

  },
  confirmCalendar() {
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
  initGoodsRankData() {
    setTimeout(() => {
      this.setData({
        totalRank: 200,
        goodsRank: [{
          id: 1,
          name: "坚果",
          value: 100,
        }, {
          id: 2,
          name: "蔬菜",
          value: 70,
        }, {
          id: 1,
          name: " 矿泉水",
          value: 30,
        }]
      })
    }, 100);

  },
  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady() {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow() {
    this.getTabBar().init();
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