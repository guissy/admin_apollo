import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Select, Tag } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import IpBlackListPage from './IpBlackList.page';
import { IpBlackList } from './IpBlackList.model';

const site = withLocale.site;

/** IpBlackList字段 */
export default class IpBlackListField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  ip = {
    title: 'IP',
    form: <Input />,
    search: <Input />
  };

  created = {
    title: site('建立时间')
  };

  updated = {
    title: site('最后修改时间')
  };

  memo = {
    title: site('备注'),
    form: <Input.TextArea />
  };

  status = {
    title: site('状态'),
    form: (
      <Select style={{ width: 120 }}>
        <Select.Option value="enabled">{site('允许')}</Select.Option>
        <Select.Option value="disabled">{site('禁止')}</Select.Option>
      </Select>
    ),
    table: ({ text, record, view }: FieldProps<string, IpBlackList, IpBlackListPage>) => {
      if (text === 'enabled') {
        return <Tag className="account-opened">{site('允许')}</Tag>;
      } else {
        return <Tag className="account-close">{site('禁止')}</Tag>;
      }
    },
    search: 'form'
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, IpBlackList, IpBlackListPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/ipBlackList/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['ipBlackListQuery']}
          >
            {remove => (
              <Mutation
                mutation={gql`
                  mutation statusMutation($body: StatusInput!) {
                    status(body: $body)
                      @rest(
                        bodyKey: "body"
                        path: "/active/apply/status"
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
                  <TableActionComponent>
                    <LinkComponent
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
                            writeFragment(this.props.client, 'IpBlackList', {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {record.status === 'enabled' ? site('限制') : site('允许')}
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
