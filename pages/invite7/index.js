const {
  info
} = require('../../mock/index')
Component({
  properties: {
    info: Object
  },
  lifetimes: {
    ready() {
      this.setData({
        marker: [{
          id: 1, // 吃席酒店
          longitude: this.properties.info.longitude,
          latitude: this.properties.info.latitude,
          iconPath: '../../assets/location-mark.png',
          width: '34px',
          height: '34px',
          callout: {
            content: this.properties.info.location,
            padding: 10,
            borderRadius: 2,
            display: 'ALWAYS'
          },
        }]
      })
    }
  },

  data: {
    info,
    scale: 16,
    marker: [],
  },
  methods: {
    onChooseLocation() {
      const mapCtx = wx.createMapContext('myMap', this);
      mapCtx.moveToLocation({
        latitude: this.data.marker[0].latitude,
        longitude: this.data.marker[0].longitude,
        success: () => {
          setTimeout(() => {
            wx.openLocation({
              longitude: this.properties.info.longitude,
              latitude: this.properties.info.latitude,
              scale: 14,
              name: this.properties.info.location,
            });
          }, 500);
        }
      });

    }
  }

});