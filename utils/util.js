const dayjs = require('dayjs')
module.exports = {
  generateUUID() {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      let r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
  isMoreThan24Hours(dateStr) {
    // 将传入的时间字符串转换为 dayjs 对象
    const targetTime = dayjs(dateStr)
    // 获取当前时间的 dayjs 对象
    const currentTime = dayjs()
    // 计算时间差，单位为小时
    const diffHours = currentTime.diff(targetTime, 'hour')
    // 判断时间差是否大于等于24小时
    return diffHours >= 24
  }
};