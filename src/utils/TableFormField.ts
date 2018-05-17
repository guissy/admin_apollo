import { isFunction } from 'lodash/fp';
import * as React from 'react';
import { constant, isPlainObject, isString } from 'lodash/fp';
import { PureComponent } from 'react';

function notStateProps(key: string) {
  return !['state', 'props', 'setState'].includes(key);
}

/** 字段基类 */
export default class TableFormField<T> {
  protected setState: (state: object) => void;
  protected state: Readonly<{}>;
  protected props: Readonly<{ children?: React.ReactNode }> & Readonly<T>;

  constructor(view: PureComponent<T>) {
    this.setState = view.setState.bind(view);
    this.state = view.state;
    this.props = view.props;
  }
  filterBy(field: string) {
    return Object.entries(this)
      .filter(([dataIndex, opt]) => !!opt[field] && notStateProps(dataIndex))
      .map(([dataIndex, opt]) => {
        return {
          ...opt,
          dataIndex,
          formItemRender: () => opt[field]
        };
      });
  }
  table(view: React.PureComponent<{}>) {
    return Object.entries(this)
      .filter(([dataIndex, opt]) => opt.table !== notInTable && notStateProps(dataIndex))
      .map(([dataIndex, opt]) => {
        const fn = (text: string, record: object) => opt.table({ text, record, view });
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
  record: R & { isTotalRow?: boolean };
  view: C;
  onChange: (value: string) => void;
  value: string;
}

/** 不出现在表格的字段 */
export const notInTable = '此字段不出现在表格';
