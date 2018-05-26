import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Tag, Select, Switch, DatePicker } from 'antd';
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
import MemberQueryPage from './MemberQuery.page';
import {
  MemberQuery,
  MemberQueryFragment,
  MemberQueryLayered,
  memberQueryLayeredQuery,
  MemberQueryLock,
  memberQueryLockQuery
} from './MemberQuery.model';

const site = withLocale.site;

/** 会员查询字段 */
export default class MemberQueryField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('会员账号'),
    form: <Input />
  };

  agnet = {
    title: site('所属代理'),
    form: <Input />
  };

  created = {
    title: site('会员加入时间'),
    form: <Input />
  };

  last_login = {
    title: site('最后登录时间'),
    form: <Input />
  };

  deposit_total = {
    title: site('存款次数'),
    form: <Input />
  };

  deposit_money = {
    title: site('存款总额'),
    form: <Input />
  };

  deposit_max = {
    title: site('最大存款总额'),
    form: <Input />
  };

  withdraw_total = {
    title: site('提现次数'),
    form: <Input />
  };

  withdraw_money = {
    title: site('提现总数'),
    form: <Input />
  };

  layered = {
    title: site('分层'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, MemberQueryLayered, MemberQueryPage>) => (
      <Query query={memberQueryLayeredQuery}>
        {({
          data: { memberQueryLayeredList = { data: [] as MemberQueryLayered[] } } = {}
        }: ChildProps<{}, { memberQueryLayeredList: Result<MemberQueryLayered[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {memberQueryLayeredList.data.map((type: MemberQueryLayered, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, MemberQueryLayered, MemberQueryPage>) => (
      <Query query={memberQueryLayeredQuery}>
        {({
          data: { memberQueryLayeredList = { data: [] as MemberQueryLayered[] } } = {}
        }: ChildProps<{}, { memberQueryLayeredList: Result<MemberQueryLayered[]> }, {}>) =>
          memberQueryLayeredList.data
            .filter(memberQueryLayered => memberQueryLayered.id === Number(text))
            .map(memberQueryLayered => memberQueryLayered.name)
        }
      </Query>
    )
  };

  lock = {
    title: site('锁定'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, MemberQueryLock, MemberQueryPage>) => (
      <Query query={memberQueryLockQuery}>
        {({
          data: { memberQueryLockList = { data: [] as MemberQueryLock[] } } = {}
        }: ChildProps<{}, { memberQueryLockList: Result<MemberQueryLock[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {memberQueryLockList.data.map((type: MemberQueryLock, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, MemberQueryLock, MemberQueryPage>) => (
      <Query query={memberQueryLockQuery}>
        {({
          data: { memberQueryLockList = { data: [] as MemberQueryLock[] } } = {}
        }: ChildProps<{}, { memberQueryLockList: Result<MemberQueryLock[]> }, {}>) =>
          memberQueryLockList.data
            .filter(memberQueryLock => memberQueryLock.id === Number(text))
            .map(memberQueryLock => memberQueryLock.name)
        }
      </Query>
    )
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, MemberQuery, MemberQueryPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/memberQuery/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['memberQueryQuery']}
          >
            {remove => (
              <TableActionComponent>
                <LinkComponent
                  confirm={true}
                  onClick={() =>
                    remove({ variables: { id: record.id } })
                      .then(messageResult('remove'))
                      .then((v: GqlResult<'remove'>) => {
                        return v.data && v.data.remove;
                      })
                  }
                >
                  {site('删除')}
                </LinkComponent>
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  编辑
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
        )
      );
    }
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
