// pages/home/console/index.js
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showCursor: true,
    index: 0
  },
  /**
   * 组件的方法列表
   */
  methods: {
    typeEffect() {
      let {
        text,
        index
      } = this.data;
      let interval = setInterval(() => {
        if (index < text.length) {
          this.setData({
            displayText: this.data.displayText + text[index],
            index: index + 1
          });
        } else {
          clearInterval(interval);
        }
      }, 150); // 打字速度
    },

  }
})