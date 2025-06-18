// pages/home/timeLine/index.js
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
    events: [{
        date: "2015.12",
        message: "First Meet",
        author: "@初识",
        icon: "git-commit",
        color: '#06b6d4',
      },
      {
        date: "2019.07",
        message: "Fall in love",
        author: "@love",
        icon: "git-merge",
        color: '#30a513',
      },
      {
        date: "2025.01",
        message: "Marry Me? Yes! ❤️",
        author: "@propose marry",
        icon: "git-pull-request",
        color: '#3b82f6',
      },
      {
        date: "2025.05",
        message: "Hold a wedding!",
        author: "@congratulate",
        icon: "git-branch",
        color: '#a855f7'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})