import { isFunction } from 'lodash/fp';
import * as React from 'react';
import { constant } from 'lodash/fp';
import { PureComponent } from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { WrappedFormUtils } from 'antd/es/form/Form';

function notStateProps(key: string) {
  return !['state', 'props', 'setState'].includes(key);
}

/** 字段基类 */
export default class TableFormField<T> {
  protected setState: (state: object) => void;
  protected state: Readonly<{}>;
  protected props: Readonly<{ children?: React.ReactNode }> &
    Readonly<T & { client: ApolloClient<{}> }>;

  constructor(view: PureComponent<T & { client: ApolloClient<{}> }>) {
    this.setState = view.setState.bind(view);
    this.state = view.state;
    this.props = view.props;
  }
  filterBy(field: string) {
    return Object.entries(this)
      .filter(([dataIndex, opt]) => notStateProps(dataIndex) && !!opt[field])
      .map(([dataIndex, opt]) => {
        let formItemRender;
        if (typeof opt[field] === 'string') {
          formItemRender = opt[opt[field]];
        } else {
          formItemRender = opt[field];
        }
        return {
          ...opt,
          dataIndex,
          formItemRender
        };
      });
  }
  detail(record: object) {
    return (
      record &&
      Object.entries(this)
        .filter(([dataIndex, opt]) => notStateProps(dataIndex) && !!opt.detail)
        .map(([dataIndex, opt]) => {
          const cloneElement = React.cloneElement(opt.detail, { value: record[dataIndex] }, '');
          return (
            <div key={dataIndex}>
              <small style={{ display: 'inline-block', width: 70, textAlign: 'right' }}>
                {opt.title}
              </small>：
              {cloneElement}
            </div>
          );
        })
    );
  }
  table(view: React.PureComponent<{}>) {
    return Object.entries(this)
      .filter(([dataIndex, opt]) => notStateProps(dataIndex) && opt.table !== notInTable)
      .map(([dataIndex, opt]) => {
        const fn = (text: string, record: object) => {
          return opt.table({ text, record, view });
        };
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
  hide: (visible: boolean) => void;
  form: WrappedFormUtils;
  onChange: (value: any) => void; // tslint:disable-line
  value: any; // tslint:disable-line
}

/** 不出现在表格的字段 */
export const notInTable = '此字段不出现在表格';
