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
    recordType:'record'
  },

  /**
   * Component methods
   */
  methods: {
    
    addReturn(){
      this.setData({
        visible: true,
        recordType:'returnGoods'
      })
    },
    
  
    onSeasonPicker() {
      this.setData({
        dateVisible: true
      });
    },
  }
})