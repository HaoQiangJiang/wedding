import TabMenu from './data';
Component({
  data: {
    active: 0,
    list: TabMenu,
  },

  methods: {
    onChange(event) {
      wx.vibrateShort()
      const index = event.currentTarget.dataset.index
      this.setData({
        active: index
      });
      wx.switchTab({
        url: this.data.list[index].url.startsWith('/') ?
          this.data.list[index].url : `/${this.data.list[index].url}`,
        success: () => {
          // 切换 tabbar 刷新页面
          var page = getCurrentPages().pop();
          if (page == undefined || page == null) return;
          page.onLoad();
        }
      });
    },

    init() {
      const page = getCurrentPages().pop();
      const route = page ? page.route.split('?')[0] : '';
      const active = this.data.list.findIndex(
        (item) =>
        (item.url.startsWith('/') ? item.url.substr(1) : item.url) ===
        `${route}`,
      );
      this.setData({
        active
      });
    },
  },
});