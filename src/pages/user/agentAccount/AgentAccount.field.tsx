import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import AgentAccountPage from './AgentAccount.page';
import {
  AgentAccount,
  AgentAccountFragment,
  AgentAccountType,
  agentAccountTypeQuery,
  AgentAccountChannel,
  agentAccountChannelQuery,
  AgentAccountOnline,
  agentAccountOnlineQuery,
  AgentAccountStatus,
  agentAccountStatusQuery
} from './AgentAccount.model';
import { Radio } from 'antd';

const site = withLocale.site;

/** 代理管理字段 */
export default class AgentAccountField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  similar = {
    title: '',
    table: notInTable,
    search: <Checkbox>模糊查询用户名</Checkbox>
  };

  name = {
    title: site('代理账号'),
    form: <Input />,
    search: 'form'
  };

  truename = {
    title: site('真实姓名'),
    form: <Input />,
    search: 'form'
  };

  type = {
    title: site('代理类型'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, AgentAccountType, AgentAccountPage>) => (
      <Query query={agentAccountTypeQuery}>
        {({
          data: { agentAccountTypeList = { data: [] as AgentAccountType[] } } = {}
        }: ChildProps<{}, { agentAccountTypeList: Result<AgentAccountType[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {agentAccountTypeList.data.map((type: AgentAccountType, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, AgentAccountType, AgentAccountPage>) => (
      <Query query={agentAccountTypeQuery}>
        {({
          data: { agentAccountTypeList = { data: [] as AgentAccountType[] } } = {}
        }: ChildProps<{}, { agentAccountTypeList: Result<AgentAccountType[]> }, {}>) =>
          agentAccountTypeList.data
            .filter(agentAccountType => agentAccountType.id === Number(text))
            .map(agentAccountType => agentAccountType.name)
        }
      </Query>
    )
  };

  pname = {
    title: site('上级代理'),
    form: <Input />,
    search: 'form'
  };

  level = {
    title: site('代理层级'),
    form: <Input />,
    search: 'form'
  };

  inferisors_num = {
    title: site('下级代理数'),
    form: <Input />,
    search: 'form'
  };

  play_num = {
    title: site('会员数'),
    form: <Input />,
    search: 'form'
  };

  balance = {
    title: site('账户余额'),
    form: <Input />,
    search: 'form'
  };

  code = {
    title: site('推广码'),
    form: <Input />,
    search: 'form'
  };

  'register_from,register_to' = {
    title: site('注册时间'),
    search: <DatePicker.RangePicker />,
    table: notInTable
  };

  created = {
    title: site('注册时间')
  };

  channel = {
    title: site('注册来源'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, AgentAccountChannel, AgentAccountPage>) => (
      <Query query={agentAccountChannelQuery}>
        {({
          data: { agentAccountChannelList = { data: [] as AgentAccountChannel[] } } = {}
        }: ChildProps<{}, { agentAccountChannelList: Result<AgentAccountChannel[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {agentAccountChannelList.data.map((type: AgentAccountChannel, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, AgentAccountChannel, AgentAccountPage>) => (
      <Query query={agentAccountChannelQuery}>
        {({
          data: { agentAccountChannelList = { data: [] as AgentAccountChannel[] } } = {}
        }: ChildProps<{}, { agentAccountChannelList: Result<AgentAccountChannel[]> }, {}>) =>
          agentAccountChannelList.data
            .filter(agentAccountChannel => agentAccountChannel.id === Number(text))
            .map(agentAccountChannel => agentAccountChannel.name)
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
    }: FieldProps<string, AgentAccountOnline, AgentAccountPage>) => (
      <Query query={agentAccountOnlineQuery}>
        {({
          data: { agentAccountOnlineList = { data: [] as AgentAccountOnline[] } } = {}
        }: ChildProps<{}, { agentAccountOnlineList: Result<AgentAccountOnline[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {agentAccountOnlineList.data.map((type: AgentAccountOnline, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, AgentAccountOnline, AgentAccountPage>) => (
      <Query query={agentAccountOnlineQuery}>
        {({
          data: { agentAccountOnlineList = { data: [] as AgentAccountOnline[] } } = {}
        }: ChildProps<{}, { agentAccountOnlineList: Result<AgentAccountOnline[]> }, {}>) =>
          agentAccountOnlineList.data
            .filter(agentAccountOnline => agentAccountOnline.id === Number(text))
            .map(agentAccountOnline => agentAccountOnline.name)
        }
      </Query>
    )
  };

  status = {
    title: site('账号状态'),
    form: (
      <Radio.Group>
        <Radio.Button value={1}>启用</Radio.Button>
        <Radio.Button value={3}>停用</Radio.Button>
        <Radio.Button value={0}>未审核</Radio.Button>
        <Radio.Button value={2}>拒绝</Radio.Button>
      </Radio.Group>
    ),
    table: ({ text, record, view }: FieldProps<string, AgentAccount, AgentAccountPage>) => {
      return {
        0: (
          <Tag className="audit-no" key="1">
            {site('未审核')}
          </Tag>
        ),
        1: (
          <Tag className="account-opened" key="1">
            {site('启用')}
          </Tag>
        ),
        2: (
          <Tag className="account-close" key="1">
            {site('拒绝')}
          </Tag>
        ),
        3: (
          <Tag className="account-disabled" key="1">
            {site('停用')}
          </Tag>
        )
      }[text];
    },
    search: 'form'
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, AgentAccount, AgentAccountPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/agentAccount/status"
                    method: "PUT"
                    type: "StatusResult"
                  ) {
                  state
                  message
                }
              }
            `}
          >
            {status => (
              <Mutation
                mutation={gql`
                  mutation removeMutation($id: RemoveInput!) {
                    remove(id: $id)
                      @rest(path: "/agentAccount/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['agentAccountQuery']}
              >
                {remove => (
                  <TableActionComponent>
                    <LinkComponent
                      hidden={record.status === 0 || record.status === 2}
                      confirm={true}
                      onClick={() =>
                        status({
                          variables: {
                            body: {
                              id: record.id,
                              status: record.status === 1 ? 3 : 1
                            }
                          }
                        })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'AgentAccount', {
                              id: record.id,
                              status: record.status === 1 ? 3 : 1
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {record.status === 1 ? site('停用') : site('启用')}
                    </LinkComponent>
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
