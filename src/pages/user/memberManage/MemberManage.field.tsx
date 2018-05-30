import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../components/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../components/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import MemberManagePage from './MemberManage.page';
import {
  MemberManage,
  MemberManageChannel,
  memberManageChannelQuery,
  MemberManageTags,
  memberManageTagsQuery,
  MemberManageOnline,
  memberManageOnlineQuery,
  MemberManageState,
  memberManageStateQuery
} from './MemberManage.model';
import { Link, match as Match } from 'react-router-dom';

const site = withLocale.site;

/** 会员管理字段 */
export default class MemberManageField<
  T extends { client: ApolloClient<{}>; match: Match<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  username = {
    title: site('会员账号'),
    form: <Input />,
    search: 'form'
  };

  truename = {
    title: site('真实姓名'),
    form: <Input />,
    search: 'form'
  };

  agent = {
    title: site('上级代理'),
    form: <Input />,
    search: 'form'
  };

  amount = {
    title: site('总余额'),
    form: <Input />,
    search: 'form'
  };

  created = {
    title: site('注册时间'),
    search: <DatePicker.RangePicker />
  };

  ip = {
    title: site('Ip'),
    form: <Input />,
    search: 'form'
  };

  channel = {
    title: site('注册来源'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, MemberManageChannel, MemberManagePage>) => (
      <Query query={memberManageChannelQuery}>
        {({
          data: { memberManageChannelList = { data: [] as MemberManageChannel[] } } = {}
        }: ChildProps<{}, { memberManageChannelList: Result<MemberManageChannel[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {memberManageChannelList.data.map((type: MemberManageChannel, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, MemberManageChannel, MemberManagePage>) => (
      <Query query={memberManageChannelQuery}>
        {({
          data: { memberManageChannelList = { data: [] as MemberManageChannel[] } } = {}
        }: ChildProps<{}, { memberManageChannelList: Result<MemberManageChannel[]> }, {}>) =>
          memberManageChannelList.data
            .filter(memberManageChannel => memberManageChannel.id === Number(text))
            .map(memberManageChannel => memberManageChannel.name)
        }
      </Query>
    )
  };

  tags = {
    title: site('标签'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, MemberManageTags, MemberManagePage>) => (
      <Query query={memberManageTagsQuery}>
        {({
          data: { memberManageTagsList = { data: [] as MemberManageTags[] } } = {}
        }: ChildProps<{}, { memberManageTagsList: Result<MemberManageTags[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {memberManageTagsList.data.map((type: MemberManageTags, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, MemberManageTags, MemberManagePage>) => (
      <Query query={memberManageTagsQuery}>
        {({
          data: { memberManageTagsList = { data: [] as MemberManageTags[] } } = {}
        }: ChildProps<{}, { memberManageTagsList: Result<MemberManageTags[]> }, {}>) =>
          memberManageTagsList.data
            .filter(memberManageTags => memberManageTags.id === Number(text))
            .map(memberManageTags => memberManageTags.name)
        }
      </Query>
    )
  };

  online = {
    title: site('在线状态'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, MemberManageOnline, MemberManagePage>) => (
      <Query query={memberManageOnlineQuery}>
        {({
          data: { memberManageOnlineList = { data: [] as MemberManageOnline[] } } = {}
        }: ChildProps<{}, { memberManageOnlineList: Result<MemberManageOnline[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {memberManageOnlineList.data.map((type: MemberManageOnline, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, MemberManageOnline, MemberManagePage>) => (
      <Query query={memberManageOnlineQuery}>
        {({
          data: { memberManageOnlineList = { data: [] as MemberManageOnline[] } } = {}
        }: ChildProps<{}, { memberManageOnlineList: Result<MemberManageOnline[]> }, {}>) =>
          memberManageOnlineList.data
            .filter(memberManageOnline => memberManageOnline.id === Number(text))
            .map(memberManageOnline => memberManageOnline.name)
        }
      </Query>
    )
  };

  state = {
    title: site('账号状态'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, MemberManageState, MemberManagePage>) => (
      <Query query={memberManageStateQuery}>
        {({
          data: { memberManageStateList = { data: [] as MemberManageState[] } } = {}
        }: ChildProps<{}, { memberManageStateList: Result<MemberManageState[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {memberManageStateList.data.map((type: MemberManageState, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, MemberManageState, MemberManagePage>) => (
      <Query query={memberManageStateQuery}>
        {({
          data: { memberManageStateList = { data: [] as MemberManageState[] } } = {}
        }: ChildProps<{}, { memberManageStateList: Result<MemberManageState[]> }, {}>) =>
          memberManageStateList.data
            .filter(memberManageState => memberManageState.id === Number(text))
            .map(memberManageState => memberManageState.name)
        }
      </Query>
    )
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, MemberManage, MemberManagePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/memberManage/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['memberManageQuery']}
          >
            {remove => (
              <TableAction>
                <Link to={this.props.match.path + '/' + String(record.id)}>{site('资料')}</Link>
                <LinkUI
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
                </LinkUI>
                <LinkUI
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  {site('编辑')}
                </LinkUI>
              </TableAction>
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
