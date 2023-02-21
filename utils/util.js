import dayjs from 'dayjs';
import cnchar from 'cnchar';

const formatTime = (date, template) => dayjs(date).format(template);

/**
 * 格式化价格数额为字符串
 * 可对小数部分进行填充，默认不填充
 * @param price 价格数额，以分为单位!
 * @param fill 是否填充小数部分 0-不填充 1-填充第一位小数 2-填充两位小数
 */
function priceFormat(price, fill = 0) {
  console.log(price)
  if (isNaN(price) || price === null || price === Infinity) {
    return price;
  }

  let priceFormatValue = Math.round(parseFloat(`${price}`) * 10 ** 8) / 10 ** 8; // 恢复精度丢失
  priceFormatValue = `${Math.ceil(priceFormatValue) / 100}`; // 向上取整，单位转换为元，转换为字符串
  if (fill > 0) {
    // 补充小数位数
    if (priceFormatValue.indexOf('.') === -1) {
      priceFormatValue = `${priceFormatValue}.`;
    }
    const n = fill - priceFormatValue.split('.')[1]?.length;
    for (let i = 0; i < n; i++) {
      priceFormatValue = `${priceFormatValue}0`;
    }
  }
  return priceFormatValue;
}

/**
 * 获取cdn裁剪后链接
 *
 * @param {string} url 基础链接
 * @param {number} width 宽度，单位px
 * @param {number} [height] 可选，高度，不填时与width同值
 */
const cosThumb = (url, width, height = width) => {
  if (url.indexOf('?') > -1) {
    return url;
  }

  if (url.indexOf('http://') === 0) {
    url = url.replace('http://', 'https://');
  }

  return `${url}?imageMogr2/thumbnail/${~~width}x${~~height}`;
};

const get = (source, paths, defaultValue) => {
  if (typeof paths === 'string') {
    paths = paths
      .replace(/\[/g, '.')
      .replace(/\]/g, '')
      .split('.')
      .filter(Boolean);
  }
  const {
    length
  } = paths;
  let index = 0;
  while (source != null && index < length) {
    source = source[paths[index++]];
  }
  return source === undefined || index === 0 ? defaultValue : source;
};
let systemWidth = 0;
/** 获取系统宽度，为了减少启动消耗所以在函数里边做初始化 */
export const loadSystemWidth = () => {
  if (systemWidth) {
    return systemWidth;
  }

  try {
    ({
      screenWidth: systemWidth,
      pixelRatio
    } = wx.getSystemInfoSync());
  } catch (e) {
    systemWidth = 0;
  }
  return systemWidth;
};

/**
 * 转换rpx为px
 *
 * @description
 * 什么时候用？
 * - 布局(width: 172rpx)已经写好, 某些组件只接受px作为style或者prop指定
 *
 */
const rpx2px = (rpx, round = false) => {
  loadSystemWidth();

  // px / systemWidth = rpx / 750
  const result = (rpx * systemWidth) / 750;

  if (round) {
    return Math.floor(result);
  }

  return result;
};

/**
 * 手机号码*加密函数
 * @param {string} phone 电话号
 * @returns
 */
const phoneEncryption = (phone) => {
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

// 内置手机号正则字符串
const innerPhoneReg =
  '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$';

/**
 * 手机号正则校验
 * @param phone 手机号
 * @param phoneReg 正则字符串
 * @returns true - 校验通过 false - 校验失败
 */
const phoneRegCheck = (phone) => {
  const phoneRegExp = new RegExp(innerPhoneReg);
  return phoneRegExp.test(phone);
};
// 将数据格式化为 按照 a-z 划分的数据
const formateDataToIndexList = (data) => {
  const obj = {}
  data.forEach(item => {
    if (!item.name[0]) {
      return
    }
    const index = item.name[0].spell()[0].toUpperCase()
    if (!obj[index]) {
      obj[index] = []
    }
    obj[index].push(item)
  })
  const result = []
  for (let key in obj) {
    result.push({
      index: key,
      children: obj[key]
    })
  }
  return result.sort((a, b) => {
    if (a.index < b.index) {
      return -1;
    }
    if (a.index > b.index) {
      return 1;
    }
    return 0;
  })
}

// 根据首字母拼音或者包含字符查找
const searchKeyInString = (text, keyword) => {
  if (!text || !keyword) return true
  return text.spell()[0].toLocaleLowerCase().includes(keyword.toLocaleLowerCase()) ||
    text.includes(keyword)
}

// 将数组按照时间分类
const formatArrayByKey = (list, key) => {
  const result = [];
  const map = new Map();
  for (const item of list) {
    const uniqueKey = item[key].split(' ')[0]
    if (!map.has(uniqueKey)) {
      map.set(uniqueKey, true); // set any value to Map
      result.push({
        date: uniqueKey,
        list: [item]
      });
    } else {
      for (const it of result) {
        if (it.date === uniqueKey) {
          it.list.push(item);
          break;
        }
      }
    }
  }
  return result;
}
/* 
给两个数组, 
a: [{date: '2020-01-01', list: [1]},{date: '2020-01-02', list: [2]}]
b: [{date: '2020-01-02', list: [3]},{date: '2020-01-3', list: [4]}]
合并成一个数组, date 相同的合并到一起
c: [{date: '2020-01-01', list: [1]},{date: '2020-01-02', list: [2,3]},{date: '2020-01-3', list: [4]}]
*/
const mergeArrayByKey = (a, b) => {
  let map = new Map();
  let result = [];
  a.concat(b).forEach(item => {
    if (!map.has(item.date)) {
      map.set(item.date, true);
      result.push(item);
    } else {
      result.forEach(v => {
        if (v.date === item.date) {
          v.list = v.list.concat(item.list);
        }
      });
    }
  });
  return result;
}

// 将订单里的信息拼接未修改订单的信息
const formateBillDetailsToEditBill = (data) => {
  const selectGoods = {}
  data.products.forEach(item => {
    selectGoods[item.product_id] = {
      ...item.product,
      isFactoryPrice: item.price === item.product.factory_price,
      count: item.number
    }
  })
  return {
    selectGoods: selectGoods || [],
    customer: data.client,
    editBillId: data.id,
    recordType: data.real_amount >= 0 ? 'record' : 'returnGoods',
    orderPrice: data.amount || 0,
    price: Math.abs(data.real_amount) || 0,
  }
}
module.exports = {
  formatTime,
  priceFormat,
  cosThumb,
  get,
  rpx2px,
  phoneEncryption,
  phoneRegCheck,
  formateDataToIndexList,
  searchKeyInString,
  formatArrayByKey,
  mergeArrayByKey,
  formateBillDetailsToEditBill
};