import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Checkbox, Input, Switch } from 'antd';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { notInTable } from '../../../../utils/TableFormField';

const site = withLocale.site;

/** 会员设置字段 */
export default class MemberSettingField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  mtoken = {
    title: site('M令牌状态'),
    form: <Input />
  };

  online = {
    title: site('在线状态'),
    form: <Switch checkedChildren="在线" unCheckedChildren="离线" />
  };

  refuse_withdraw = {
    title: '权限设置',
    form: <Checkbox>禁止提款</Checkbox>
  };

  refuse_sale = {
    title: '权限设置',
    form: <Checkbox>禁止优惠</Checkbox>
  };

  refuse_rebate = {
    title: '权限设置',
    form: <Checkbox>禁止返水</Checkbox>
  };

  refuse_exchange = {
    title: '权限设置',
    form: <Checkbox>禁止额度转换</Checkbox>
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
