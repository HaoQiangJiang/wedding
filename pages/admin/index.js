// pages/friends/friends.js
import {
  friendMap,
  locationMap
} from '../../mock/index';
Page({
  data: {
    friends: [],
    selectedFriend: null,
    locations: [],
    custom: {
      name: '',
      welcome: '',
      location: ''
    }
  },

  onLoad() {
    // 解析 friendMap 数据并存入列表
    const friends = Object.keys(friendMap).map(userId => ({
      id: userId,
      name: friendMap[userId].name || '未命名'
    }));

    const locations = Object.keys(locationMap)
    this.setData({
      friends,
      locations
    });
  },

  selectUser(event) {
    const {
      userid
    } = event.currentTarget.dataset;
    if (this.data.selectedFriend?.id === userid) {
      return this.setData({
        selectedFriend: null
      })
    }
    const selectedFriend = this.data.friends.find(friend => friend.id === userid);
    this.setData({
      selectedFriend
    });
  },
  onInputName(e) {
    this.setData({
      custom: {
        ...this.data.custom,
        name: e.detail.value
      }
    });
  },
  onInputWelcome(e) {
    this.setData({
      custom: {
        ...this.data.custom,
        welcome: e.detail.value
      }
    });
  },
  onChangeLocation(e) {
    this.setData({
      custom: {
        ...this.data.custom,
        location: e.detail.value
      }
    });

  },
  onShareAppMessage() {
    console.log(this.data.custom)
    return {
      title: `${this.data.selectedFriend?.name||this.data.custom.name}~诚邀参加肖亚&陈本拯婚礼`,
      path: `/pages/code/index?userId=${this.data.selectedFriend?.id}&name=${this.data.custom.name}&welcome=${this.data.custom.welcome}&location=${this.data.custom.location}`,
      imageUrl: "https://h5cdn.hunbei.com/editorTempCustomPic/2025-4-16-jSx6DhDhriAn5CHCBmjiSmGFy2fPdBNt"
    };
  }
});