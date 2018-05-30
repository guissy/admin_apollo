import * as React from 'react';
import withLocale from '../../../utils/withLocale';
import { Dispatch } from 'dva';
import { Button } from 'antd';
import styled from 'styled-components';
import createClone from '../../../utils/createClone';

interface Props {
  site?: (words: string) => React.ReactNode;
  dispatch?: Dispatch;
  children?: React.ReactNode;
  createText?: string; // 创建按钮文字
  onCreate?: () => void; // 新增按钮的回调
  onRefreshMode?: any; // tslint:disable-line:no-any // 刷新方式，自动：下拉框，手动：按钮
  onRefresh?: () => void; // 刷新按钮的回调
  canClone?: boolean; // 给页面组件使用和 cloneElement 用
  isCloned?: boolean; // 区别复制的还是原始的
  onExport?: () => void; // 导出按钮的回调
}

const Wrap = styled.section`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px 20px;
  background: #fff;
  &.search {
    display: inline-flex;
  }
  > *:last-child {
    margin-right: 0;
  }

  button {
    margin: 0 6px;
  }
`;

const { withClone, cloneElement } = createClone();
/** 用于复制到SearchComponent */
export const cloneButtonBar = cloneElement;
/** 按钮操作栏 */
export default withClone<Props>(
  withLocale(function ButtonBar({
    site = () => '',
    onCreate,
    createText,
    onRefreshMode,
    onRefresh,
    onExport,
    children,
    canClone,
    isCloned,
    ...props
  }: Props) {
    return (
      <Wrap hidden={canClone && !isCloned} className={isCloned ? 'search' : ''}>
        {onCreate && (
          <Button type="primary" icon="plus" onClick={onCreate} {...props}>
            {createText || site('新增')}
          </Button>
        )}
        {onRefreshMode
          ? onRefreshMode
          : onRefresh && (
              <Button icon="reload" onClick={onRefresh} {...props}>
                {site('刷新')}
              </Button>
            )}
        {onExport && (
          <Button icon="export" onClick={onExport} {...props}>
            {site('导出')}
          </Button>
        )}
        {children}
      </Wrap>
    );
  })
);
