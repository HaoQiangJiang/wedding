// components/stepper/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    item: Object
  },

  /**
   * Component initial data
   */
  data: {
    isEdit: false,
    value: 0,
    externalClasses: ['r-aa']
  },

  /**
   * Component methods
   */
  methods: {
    open() {
      this.setData({
        isEdit: true
      })
    },
    close() {
      this.setData({
        isEdit: false
      })
    },
    hanldeSelectGoods(e) {
      const currentValue = e.detail.value
      this.triggerEvent('handleSelectGoods', {
        [e.target.dataset.goods.value]: currentValue
      })
      this.setData({
        value: currentValue
      })
    },
  }
})