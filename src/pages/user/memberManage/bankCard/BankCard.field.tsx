import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../../utils/formRule';
import LinkComponent from '../../../components/link/LinkComponent';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../../utils/TableFormField';
import TableActionComponent from '../../../components/table/TableActionComponent';
import { messageResult } from '../../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { Result } from '../../../../utils/result';
import BankCardPage from './BankCard.page';
import {
  BankCard,
  BankName,
  bankNameQuery,
  BankCardState,
  bankCardStateQuery
} from './BankCard.model';

const site = withLocale.site;

/** 个人资料字段 */
export default class BankCardField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  card = {
    title: site('银行账号'),
    form: <Input />
  };

  bank_name = {
    title: site('银行名称'),
    form: ({ text, record, view, value, onChange }: FieldProps<string, BankName, BankCardPage>) => (
      <Query query={bankNameQuery}>
        {({
          data: { bankNameList = { data: [] as BankName[] } } = {}
        }: ChildProps<{}, { bankNameList: Result<BankName[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {bankNameList.data.map((type: BankName, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, BankName, BankCardPage>) => (
      <Query query={bankNameQuery}>
        {({
          data: { bankNameList = { data: [] as BankName[] } } = {}
        }: ChildProps<{}, { bankNameList: Result<BankName[]> }, {}>) =>
          bankNameList.data
            .filter(bankName => bankName.id === Number(text))
            .map(bankName => bankName.name)
        }
      </Query>
    )
  };

  address = {
    title: site('开户支行'),
    form: <Input />
  };

  accountname = {
    title: site('户名'),
    form: <Input />
  };

  state = {
    title: site('状态'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, BankCardState, BankCardPage>) => (
      <Query query={bankCardStateQuery}>
        {({
          data: { bankCardStateList = { data: [] as BankCardState[] } } = {}
        }: ChildProps<{}, { bankCardStateList: Result<BankCardState[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {bankCardStateList.data.map((type: BankCardState, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, BankCardState, BankCardPage>) => (
      <Query query={bankCardStateQuery}>
        {({
          data: { bankCardStateList = { data: [] as BankCardState[] } } = {}
        }: ChildProps<{}, { bankCardStateList: Result<BankCardState[]> }, {}>) =>
          bankCardStateList.data
            .filter(bankCardState => bankCardState.id === Number(text))
            .map(bankCardState => bankCardState.name)
        }
      </Query>
    )
  };

  created_time = {
    title: site('建立时间'),
    form: <Input />
  };

  updated_time = {
    title: site('最后修改时间'),
    form: <Input />
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
