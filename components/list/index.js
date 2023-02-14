// components/cell/index.js
Component({
  /**
   * Component properties
   */
  properties: {
    isHiddenAvatar: Boolean
  },

  /**
   * Component initial data
   */
  data: {
    list: [{
      id: 1,
      customer: '陈本拯',
      time: '2023-02-10 10:17',
      price: 66,
      isPay: false,
    }, {
      id: 2,
      customer: '陈本拯1',
      time: '2023-02-10 10:16',
      isPay: true,
      price: -33
    }, {
      id: 3,
      customer: '陈本拯2',
      time: '2023-02-10 10:15',
      isPay: false,
      price: 166
    }],
    deleteVisible: false,
  },

  /**
   * Component methods
   */
  methods: {
    onEdit(e) {
      this.triggerEvent('addBill', {
        setData: e.currentTarget.dataset.item
      })
    },
    onDelete() {

    },
    submitDelete() {

    },
    openDelete() {
      this.setData({
        deleteVisible: true
      })
    },
    closeDelete() {
      this.setData({
        deleteVisible: false
      })
    }
  }
})