import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkUI from '../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../../zongzi/pc/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import AgentAuditPage from './AgentAudit.page';
import { AgentAudit, AgentAuditFragment, AgentAuditStatus } from './AgentAudit.model';

const site = withLocale.site;

/** 代理审核字段 */
export default class AgentAuditField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('代理用户名'),
    form: <Input />,
    search: 'form'
  };

  mobile = {
    title: site('电话号码'),
    form: <Input />,
    search: 'form'
  };

  email = {
    title: site('电子邮箱'),
    form: <Input />,
    search: 'form'
  };

  truename = {
    title: site('姓名'),
    form: <Input />,
    search: 'form'
  };

  created = {
    title: site('注册时间'),
    form: <Input />,
    search: 'form'
  };

  channel = {
    title: site('加入来源'),
    form: <Input />,
    table: ({ text, record, view }: FieldProps<string, AgentAudit, AgentAuditPage>) => {
      if (record.channel === 1) {
        return 'H5';
      } else if (record.channel === 2) {
        return 'PC';
      } else if (record.channel === 3) {
        return '厅主后台创建';
      } else {
        return '代理后台创建';
      }
    },
    search: 'form'
  };

  ip = {
    title: site('注册IP'),
    form: <Input />,
    search: 'form'
  };

  admin_user = {
    title: site('处理人'),
    form: <Input />,
    search: 'form'
  };

  status = {
    title: site('审核状态'),
    form: <Switch checkedChildren={site('未审核')} unCheckedChildren={site('已拒绝')} />,
    table: ({ text, record, view }: FieldProps<string, AgentAudit, AgentAuditPage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('未审核')}</Tag>
        ) : (
          <Tag className="account-close">{site('已拒绝')}</Tag>
        )}
      </>
    ),
    search: 'form'
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, AgentAudit, AgentAuditPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/agentAudit/status"
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
                      @rest(path: "/agentAudit/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['agentAuditQuery']}
              >
                {remove => (
                  <TableAction>
                    <LinkUI
                      confirm={true}
                      onClick={() =>
                        status({
                          variables: {
                            body: {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            }
                          }
                        })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'AgentAudit', {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {record.status === 'enabled' ? site('拒绝') : site('通过')}
                    </LinkUI>
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
                      编辑
                    </LinkUI>
                  </TableAction>
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
