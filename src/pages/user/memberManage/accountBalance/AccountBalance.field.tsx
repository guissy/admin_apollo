import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../../utils/formRule';
import LinkUI from '../../../components/link/LinkUI';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../../utils/TableFormField';
import TableAction from '../../../components/table/TableAction';
import { messageResult } from '../../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { Result } from '../../../../utils/result';
import AccountBalancePage from './AccountBalance.page';
import { AccountBalance, AccountBalanceFragment } from './AccountBalance.model';

const site = withLocale.site;

/** 账户余额字段 */
export default class AccountBalanceField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  currency_name = {
    title: site('货币'),
    form: <Input />
  };

  updated = {
    title: site('最后更新时间'),
    form: <Input />
  };

  balance = {
    title: site('主账户'),
    form: <Input />
  };

  freeze_withdraw = {
    title: site('提款冻结'),
    form: <Input />
  };

  amount = {
    title: site('总余额'),
    form: <Input />
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
