import { isFunction } from 'lodash/fp';
import { constant, isPlainObject, isString } from 'lodash/fp';

/** 字段基类 */
export default class TableFormField {
  filterBy(field: string) {
    return Object.entries(this)
      .filter(([dataIndex, opt]) => !!opt[field])
      .map(([dataIndex, opt]) => {
        return {
          ...opt,
          dataIndex,
          formItemRender: () => opt[field]
        };
      });
  }
  table(page: React.PureComponent<{}>) {
    return Object.entries(this)
      .filter(([dataIndex, opt]) => opt.table !== notInTable)
      .map(([dataIndex, opt]) => {
        const fn = (text: string, record: object) => opt.table({ text, record, page });
        const hasTable = opt.hasOwnProperty('table');
        let render = {} as { render: Function };
        if (hasTable) {
          const tableIsFunction = isFunction(opt.table);
          render.render = tableIsFunction ? fn : constant(opt.table);
        }
        return {
          ...opt,
          ...render,
          dataIndex
        };
      });
  }
}

/** 渲染表单输入框的Props */
export interface FieldProps<
  T = string | number | Array<number> | object,
  R = object,
  C = React.PureComponent
> {
  text: T;
  record: R & { isTotalRow: boolean };
  view: C;
}

/** 不出现在表格的字段 */
export const notInTable = '此字段不出现在表格';
