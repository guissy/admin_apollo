// type ResultData<T> = T extends (infer U)[] ? U[] : T;

/**
 * php 后端返回的数据格式
 */
export interface Result<T> {
  state: number;
  data: T;
  message: string;
  attributes: Attributes;

  /** @see Response#status */
  status: number; // http状态码：用于model.effects里处理错误
}

interface Attr {
  number: number; // 相当于传给后端的 page
  size: number; // 相当于传给后端的 page_size
  total: number;
}

// tslint:disable-next-line:no-any
type TotalRow = { [p: string]: any };

/** 包含翻页和表格的小结、总结属性 */
export type Attributes = Attr & TotalRow;
