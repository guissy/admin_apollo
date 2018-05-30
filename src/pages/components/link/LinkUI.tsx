import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { LoginState } from '../../login/Login.model';
import { Popconfirm } from 'antd';
import withLocale from '../../../utils/withLocale';
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  action?: Function;
  hidden?: boolean;
  onCallback?: Function;
  login?: LoginState;
  site?: (p: string) => React.ReactNode;
  dispatch?: Dispatch;
  // 当boolean类型时, title{`确定`${''}吗},  为ReactNode时, title={confirm} confirm 为一段文字
  confirm?: boolean | React.ReactNode;
}
interface State {}
let actionsDel = '删除'.split(',');
let actionsUpdate = '申请,启用,停用,编辑,打标签,资料,调整余额,下注,现金,封号,限额,发布'.split(',');
let actionsView = '查看'.split(',');

// todo: 新增暂时没做
/**
 * 表格操作按钮组件
 * 适用于增删改查等按钮，允许有弹出框 Popconfirm
 * 增删改查按钮对应后台权限，无权限不显示操作按钮
 * 示例 轮播广告 {@link AdList#render}
 */
@withLocale
@select('login')
export default class LinkUI extends React.PureComponent<LinkProps, {}> {
  render() {
    const {
      confirm,
      login = {} as LoginState,
      hidden,
      children,
      site = () => '',
      dispatch,
      onClick,
      ...props
    } = this.props;
    const { isDelete, isUpdate, isFetch } = login;
    const noDelete = actionsDel.map(v => site(v)).includes(children) && !isDelete;
    const noUpdate = actionsUpdate.map(v => site(v)).includes(children) && !isUpdate;
    const noView = actionsView.map(v => site(v)).includes(children) && !isFetch;

    return confirm ? (
      <Popconfirm
        placement="top"
        title={confirm === true ? `确定要${children}吗` : confirm}
        onConfirm={onClick}
        okText="确定"
        cancelText="取消"
      >
        <a {...props} hidden={noDelete || noUpdate || noView || hidden}>
          {this.props.children}
        </a>
      </Popconfirm>
    ) : (
      <a {...props} hidden={noDelete || noUpdate || noView || hidden} onClick={onClick}>
        {this.props.children}
      </a>
    );
  }
}
