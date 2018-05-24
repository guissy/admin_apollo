import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch, DatePicker } from 'antd';
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
import TransferRecordPage from './TransferRecord.page';
import {
  TransferRecord,
  TransferRecordFragment,
  Status,
  OutId,
  InId
} from './TransferRecord.model';

const site = withLocale.site;

/** 转帐记录字段 */
export default class TransferRecordField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  username = {
    title: site('用户名'),
    form: <Input />
  };

  no = {
    title: site('交易订单号'),
    form: <Input />
  };

  status = {
    title: site('状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, TransferRecord, TransferRecordPage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('成功')}</Tag>
        ) : (
          <Tag className="account-close">{site('失败')}</Tag>
        )}
      </>
    )
  };

  'start_time,end_time' = {
    title: site('转账时间'),
    form: <DatePicker.RangePicker />,
    table: notInTable
  };

  out_id = {
    title: site('转出'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, OutId, TransferRecordPage>) => (
      <Query
        query={gql`
          query {
            outIds @rest(type: "OutIdResult", path: "/outId") {
              data {
                id
                name
              }
            }
          }
        `}
      >
        {({
          data: { outIds = { data: [] as OutId[] } } = {}
        }: ChildProps<{}, { outIds: Result<OutId[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {outIds.data.map((type: OutId, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    )
  };

  in_id = {
    title: site('转入'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, InId, TransferRecordPage>) => (
      <Query
        query={gql`
          query {
            inIds @rest(type: "InIdResult", path: "/inId") {
              data {
                id
                name
              }
            }
          }
        `}
      >
        {({
          data: { inIds = { data: [] as InId[] } } = {}
        }: ChildProps<{}, { inIds: Result<InId[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {inIds.data.map((type: InId, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    )
  };

  op_name = {
    title: site('操作人')
  };

  created = {
    title: site('转帐时间')
  };

  memo = {
    title: site('备注')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, TransferRecord, TransferRecordPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/transferRecord/status"
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
                      @rest(path: "/transferRecord/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['transferRecordQuery']}
              >
                {remove => (
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
                            writeFragment(this.props.client, 'TransferRecord', {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {record.status === 'enabled' ? site('停用') : site('启用')}
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
