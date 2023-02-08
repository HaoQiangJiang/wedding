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
    add() {
      this.setData({
        visible: !this.data.visible
      })
    },
    onVisibleChange(e) {
      console.log(e)
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