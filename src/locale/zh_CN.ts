const zhCN = {};

/** 中文多语言 */
export default zhCN;
type IntlKeys = keyof typeof zhCN | string;
export type IntlData = { [p in IntlKeys]: string };
