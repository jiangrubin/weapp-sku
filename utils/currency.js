// 强制保留2位小数，如：2，会在2后面补上00.即2.00
export function toDecimal2(x) {
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var f = Math.round(x * 100) / 100;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  return s;
}

/**
 * @desc 分转化为元 - 正则解决精度
 * @param { Number } fen 
 * @return { String }
 */
export function fenToYuan(fen) {
  var num = fen;
  num = fen * 0.01;
  num += '';
  var reg = num.indexOf('.') > -1 ? /(\d{1,3})(?=(?:\d{3})+\.)/g : /(\d{1,3})(?=(?:\d{3})+$)/g;
  num = num.replace(reg, '$1');
  num = toDecimal2(num)
  return num
}

/**
 * @desc 元转分 - 解决精度问题
 * @param { Number } yuan 要转换的钱 单位元
 * @param { Number } digit 转换倍数
 * @return { Number }
 */
export function yuanToFen(yuan, digit = 100) {
  var m = 0,
    s1 = yuan.toString(),
    s2 = digit.toString();
  try {
    m += s1.split(".")[1].length
  } catch (e) { }
  try {
    m += s2.split(".")[1].length
  } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}