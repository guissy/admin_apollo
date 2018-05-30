import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkUI from '../../components/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../components/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import SubAgentRebatePage from './SubAgentRebate.page';
import { SubAgentRebate, SubAgentRebateFragment } from './SubAgentRebate.model';

const site = withLocale.site;

/** SubAgentRebate字段 */
export default class SubAgentRebateField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  period_name = {
    title: site('期数名称'),
    form: <Input />
  };

  uname = {
    title: site('代理用户名'),
    form: <Input />
  };

  settings = {
    title: site('下级佣金'),
    table: ({ text, record, view }: FieldProps<string, SubAgentRebate, SubAgentRebatePage>) => {
      return (
        <a
          onClick={() => {
            this.setState({
              detail: { visible: true, record }
            });
          }}
        >
          详情
        </a>
      );
    }
  };

  total = {
    title: site('总计'),
    form: <Input />
  };

  status = {
    title: site('状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, SubAgentRebate, SubAgentRebatePage>) => {
      if (text === 'enabled') {
        return <Tag className={'account-opened'}>{site('已发放')}</Tag>;
      } else if (text === 'disabled') {
        return <Tag className={'account-close'}>{site('未发放')}</Tag>;
      } else {
        return <Tag className={'account-close'}>{site('转下期')}</Tag>;
      }
    }
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, SubAgentRebate, SubAgentRebatePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/subAgentRebate/status"
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
                      @rest(path: "/subAgentRebate/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['subAgentRebateQuery']}
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
                            writeFragment(this.props.client, 'SubAgentRebate', {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {record.status === 'enabled' ? site('停用') : site('启用')}
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
