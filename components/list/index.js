// components/cell/index.js
const {
  deleteBill
} = require('../../api/index')
Component({
  /**
   * Component properties
   */
  properties: {
    isHiddenAvatar: Boolean,
    list: Array,
    isHiddenEdit:Boolean
  },

  /**
   * Component initial data
   */
  data: {
    deleteVisible: false,
    operateData: {}, // 正在操作的数据
  },

  /**
   * Component methods
   */
  methods: {
    onEdit(e) {
      const data = e.currentTarget.dataset.item
      this.setData({
        operateData: data
      })
      this.triggerEvent('addBill', {
        setData: data
      })
    },

    async submitDelete() {
      await deleteBill(this.data.operateData.id)
      // 刷新订单数
      this.triggerEvent('deleteCallBack', {
        data: this.data.operateData
      })
      this.closeDelete()
    },
    openDelete(e) {
      const data = e.currentTarget.dataset.item
      this.setData({
        operateData: data
      })
      this.setData({
        deleteVisible: true
      })
    },
    closeDelete() {
      this.setData({
        deleteVisible: false,
        operateData: {}
      })
    }
  }
})