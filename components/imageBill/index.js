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
  },

  /**
   * Component methods
   */
  methods: {
    // 提交账单
    submitBill(){
      this.setData({
        visible:false
      });
    },
    // 记一笔
    addBill() {
      this.setData({
        visible: !this.data.visible
      })
    },
    closeRecord(){

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