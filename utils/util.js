const dayjs = require('dayjs');
const {
  getUserInfo
} = require('../api/index')

export function generateUUID() {
  let d = new Date().getTime();
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export function isMoreThan24Hours(dateStr) {
  if (!dateStr) return true
  // 将传入的时间字符串转换为 dayjs 对象
  const targetTime = dayjs(dateStr)
  // 获取当前时间的 dayjs 对象
  const currentTime = dayjs()
  // 计算时间差，单位为小时
  const diffHours = currentTime.diff(targetTime, 'hour')
  console.log(diffHours)
  // 判断时间差是否大于等于24小时
  return diffHours >= 24
}

export function urlTobase64(imgPath) {
  //读取图片的base64文件内容
  return new Promise(resolve => {
    wx.getFileSystemManager().readFile({
      filePath: imgPath, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => resolve('data:image/png;base64,' + res.data) //成功的回调
    })
  })
}

export function lookAdModal() {

}

export async function checkSource() {
  const {
    data
  } = await getUserInfo()
  if (data.data.score <= 0) {
    return false
  }
  return true
}

export function removeChatGPT(str) {
  const regexChatGPT = /ChatGPT/ig;
  const regexOpenAI = /OpenAI/ig;
  const replacedStr = str.replace(regexChatGPT, "AIBB");
  const result = replacedStr.replace(regexOpenAI, "AIBB")
  return result
}