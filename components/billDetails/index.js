// components/billDetails/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    products: Object,
    payRecords:Object
  },

  /**
   * Component initial data
   */
  data: {
    isShowPayRecords:false,
  },

  /**
   * Component methods
   */
  methods: {
    openPayRecords(){
      this.setData({
        isShowPayRecords:true
      })
    },
    closePayRecords(){
      this.setData({
        isShowPayRecords:false
      })
    },
  }
})