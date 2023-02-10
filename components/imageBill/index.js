// components/imageBill/index.js
Component({
  /**
   * Component properties
   */
  properties: {

  },

  /**
   * Component initial data
   */
  data: {
    visible: false,
    recordType:'record'
  },

  /**
   * Component methods
   */
  methods: {
    // 提交账单
    closeBill() {
      this.setData({
        visible: false
      });
    },
    // 记一笔
    addBill() {
      this.setData({
        visible: true,
        recordType:'record'
      })
    },
    addReturn(){
      this.setData({
        visible: true,
        recordType:'returnGoods'
      })
    },
    closeRecord() {

    },
    onVisibleChange(e) {
      this.setData({
        visible: e.detail.visible,
      });
    },
    onSeasonPicker() {
      this.setData({
        dateVisible: true
      });
    },
  }
})