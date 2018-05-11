/**
 * 钱币正数：非负以及小数点后两位
 * @example
 * moneyPattern().test(1000)  // true 通过
 * moneyPattern().test(1.9)   // true 通过
 * moneyPattern().test(0.9)   // true 通过
 * moneyPattern().test(1.222) // false 不通过
 * moneyPattern().test(01)    // false 不通过
 */
export function moneyPattern() {
  return /^([1-9]\d*|0)(\.\d{1,2})?$/;
}

/**
 * 自然数：0和正整数
 */
export function naturalNumPattern() {
  return /^([1-9]\d*|0)$/;
}
/**
 * 域名
 * @example
 * hostNamePattern().test('http://www.***.com') // true
 * hostNamePattern().test('https://www.***.com'） // true
 */
export function hostNamePattern() {
  return /^((ht|f)tps?):\/\/([\w\-]+(\.[\w\-]+)*\/)*[\w\-]+(\.[\w\-]+)*\/?(\?([\w\-\.,@?^=%&:\/~\+#]*)+)?/;
}
