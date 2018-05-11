import * as React from 'react';
import { Divider } from 'antd';
import { isPlainObject } from 'lodash';

interface Props {
  children: React.ReactNode[];
}

/** 表格操作区的链接之间加分隔竖线 */
export default function TableActionComponent({ children }: Props) {
  const childrenVisible = React.Children.toArray(children).reduce(
    (acc, item) => {
      let accOk = acc;
      if (isPlainObject(item)) {
        const elm = item as React.ReactElement<{ children: React.ReactChild; hidden: boolean }>;
        if (elm.type.toString() === 'Symbol(react.fragment)') {
          accOk = acc.concat(elm.props.children);
        } else {
          const props = elm.props;
          if (props.hidden !== true) {
            accOk = accOk.concat(item);
          } // 不渲染：hidden 即认为是样式 display: none 的元素
        }
      } else {
        accOk = acc.concat(item);
      }
      return accOk;
    },
    [] as React.ReactChild[]
  );
  const length = childrenVisible.length > 0 ? childrenVisible.length - 1 : 0;
  return (
    <span>
      {childrenVisible.map((item, index) => {
        if (index !== length) {
          return [item, <Divider type="vertical" key={index} />];
        } else {
          return item;
        }
      })}
    </span>
  );
}
