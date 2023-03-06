Page({
  data: {
    meAvatar: 'https://www.linktmd.com/static/link_official/images/platform/Twitter.png',
    aiAvatar: 'https://www.linktmd.com/static/link_official/images/platform/reddit.png',
    chatList: [],
    inputValue: '',
    scrollIntoView: '',
  },
  onInput(e) {
    const {
      value
    } = e.detail;
    this.setData({
      inputValue: value,
    });
  },
  onFocus(e) {
    if (this.data.chatList.length) {
      this.setData({
        scrollIntoView: `chat-${this.data.chatList.length - 1}`,
      });
    }
  },
  onSend() {
    const {
      chatList,
      inputValue
    } = this.data;
    if (!inputValue) {
      return;
    }
    const newChatList = chatList.concat([{
        avatar: 'https://xxx.com/avatar2.png',
        content: inputValue,
        isMe: true,
      },
      {
        avatar: 'https://xxx.com/avatar1.png',
        content: '收到',
        isMe: false,
      },
    ]);
    console.log(`chat-${newChatList.length - 1}`)
    this.setData({
      chatList: newChatList,
      inputValue: '',
      scrollIntoView: `chat-${newChatList.length - 1}`,
    });
  },
});