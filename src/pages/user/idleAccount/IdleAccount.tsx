import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { IdleAccountState } from './IdleAccount.model';

import { SearchUI, SearchFormConfig } from '../../components/form/SearchUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { showMessageForResult } from '../../../utils/showMessage';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale, { siteFunction } from '../../../utils/withLocale';
import { Form, Input, Button } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

interface Props {
  form?: WrappedFormUtils;
  site?: siteFunction;
  dispatch?: Dispatch;
  idleAccount?: IdleAccountState;
}

/** 会员层级 */
@withLocale
@Form.create()
@select('idleAccount')
export default class IdleAccount extends React.PureComponent<Props, {}> {
  state = {};
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props.dispatch!({
      type: 'idleAccount/queryUnusedAccount',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'idleAccount/queryUnusedAccount',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  config = (useFor: 'table' | 'search'): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('用户名'),
        dataIndex: 'name',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('上级代理'),
        dataIndex: 'agent',
        formItemRender: () => null,
        formRules: rules
      },
      {
        title: site('总余额'),
        dataIndex: 'total',
        formItemRender: () => null
      },
      {
        title: site('最后登录时间'),
        dataIndex: 'last_login',
        formItemRender: () => null,
        formRules: rules
      },
      {
        title: site('总额小于'),
        dataIndex: 'balance',
        notInTable: true,
        formItemRender: () => (useFor === 'search' ? <Input type="number" /> : null)
      },
      {
        title: site('超过几天没有登录'),
        dataIndex: 'last_login',
        notInTable: true,
        formItemRender: () => (useFor === 'search' ? <Input type="number" /> : null),
        formRules: rules
      }
    ];
  }
  render() {
    // const { getFieldDecorator } = this.props.form!;
    const { site = () => '', form, idleAccount = {} as IdleAccountState } = this.props;
    const { data, attributes } = idleAccount;
    return (
      <div>
        <SearchUI
          form={form}
          fieldConfig={this.config('search')}
          actionType="idleAccount/queryUnusedAccount"
          pageSize={30}
        />
        <TableComponent
          dataSource={data ? data : []}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
