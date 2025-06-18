// pages/home/code/index.js
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
    codeLines: [{
        class: 'vsc-comment',
        text: '/**'
      },
      {
        class: 'vsc-comment',
        text: ' * 亲爱的宝贝：'
      },
      {
        class: 'vsc-comment',
      },
      {
        class: 'vsc-keyword',
        text: 'const'
      },
      {
        class: 'vsc-variable',
        text: ' ourStory = {'
      },
      {
        class: 'vsc-property',
        text: '  author: { '
      },
      {
        class: 'vsc-string',
        text: '    name: "我",'
      },
      {
        class: 'vsc-string',
        text: '    role: "永远爱你的程序员"'
      },
      {
        class: 'vsc-property',
        text: '  },'
      },
      {
        class: 'vsc-property',
        text: '  partner: {'
      },
      {
        class: 'vsc-string',
        text: '    name: "你",'
      },
      {
        class: 'vsc-string',
        text: '    role: "我的人生女主角"'
      },
      {
        class: 'vsc-property',
        text: '  },'
      },
      {
        class: 'vsc-function',
        text: '  startJourney() {'
      },
      {
        class: 'vsc-text',
        text: '    while (true) {'
      },
      {
        class: 'vsc-text',
        text: '      this.love++'
      },
      {
        class: 'vsc-text',
        text: '      this.happiness++'
      },
      {
        class: 'vsc-text',
        text: '    }'
      },
      {
        class: 'vsc-function',
        text: '  }'
      },
      {
        class: 'vsc-bracket',
        text: '}'
      },
      {
        class: 'vsc-comment',
        text: ' */'
      },
      {
        class: 'vsc-comment',
        text: '// 你愿意和我一起commit这段人生代码吗？'
      }
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})