import updateManager from './common/updateManager';

App({
  onShow() {
    updateManager();
  },

  globalData: {
    audioCtx: null,
    isPlay: true, // 音乐播放状态
  },
  onLaunch() {
    this.globalData.audioCtx = wx.createInnerAudioContext();
    this.globalData.audioCtx.src = 'https://fs-im-kefu.7moor-fs1.com/ly/4d2c3f00-7d4c-11e5-af15-41bf63ae4ea0/1744098791826/EverybodyKnowsILoveYou.mp3';
    this.globalData.audioCtx.autoplay = true;
    this.globalData.audioCtx.loop = true;
    this.globalData.audioCtx.obeyMuteSwitch = false;
    this.globalData.audioCtx.play();
  },
  playMusic() {
    this.globalData.isPlay = true;
    this.globalData.audioCtx.play();
  },
  pauseMusic() {
    this.globalData.isPlay = false;
    this.globalData.audioCtx.pause();
  },
  onShareAppMessage() {

  },

});