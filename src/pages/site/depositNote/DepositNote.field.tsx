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
import DepositNotePage from './DepositNote.page';
import {
  DepositNote,
  DepositNoteFragment,
  ApproveStatus,
  approveStatusQuery,
  ApplyTo,
  applyToQuery
} from './DepositNote.model';
import Label from '../../components/label/Label';
import Editor from '../../components/richTextEditor/Editor';

const site = withLocale.site;

/** 存款文案字段 */
export default class DepositNoteField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('文案名称'),
    form: <Input />,
    detail: <Label />
  };

  language = {
    title: site('语言'),
    form: <Input />,
    detail: <Label />
  };

  approve_status = {
    title: site('审核状态'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, ApproveStatus, DepositNotePage>) => (
      <Query query={approveStatusQuery}>
        {({
          data: { approveStatusList = { data: [] as ApproveStatus[] } } = {}
        }: ChildProps<{}, { approveStatusList: Result<ApproveStatus[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {approveStatusList.data.map((type: ApproveStatus, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, ApproveStatus, DepositNotePage>) => (
      <Query query={approveStatusQuery}>
        {({
          data: { approveStatusList = { data: [] as ApproveStatus[] } } = {}
        }: ChildProps<{}, { approveStatusList: Result<ApproveStatus[]> }, {}>) =>
          approveStatusList.data
            .filter(approveStatus => approveStatus.id === Number(text))
            .map(approveStatus => approveStatus.name)
        }
      </Query>
    )
  };

  status = {
    title: site('使用状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, DepositNote, DepositNotePage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
          <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>
    ),
    detail: <Label />
  };

  content = {
    title: site('活动内容'),
    form: <Editor id="depositNote_content" />
  };

  apply_to = {
    title: site('使用于'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, ApplyTo, DepositNotePage>) => (
      <Query query={applyToQuery}>
        {({
          data: { applyToList = { data: [] as ApplyTo[] } } = {}
        }: ChildProps<{}, { applyToList: Result<ApplyTo[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {applyToList.data.map((type: ApplyTo, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, ApplyTo, DepositNotePage>) => (
      <Query query={applyToQuery}>
        {({
          data: { applyToList = { data: [] as ApplyTo[] } } = {}
        }: ChildProps<{}, { applyToList: Result<ApplyTo[]> }, {}>) =>
          applyToList.data
            .filter(applyTo => applyTo.id === Number(text))
            .map(applyTo => applyTo.name)
        }
      </Query>
    )
  };

  created = {
    title: site('生成时间'),
    form: <Input />,
    detail: <Label />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, DepositNote, DepositNotePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/depositNote/status"
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
                      @rest(path: "/depositNote/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['depositNoteQuery']}
              >
                {remove => (
                  <TableActionComponent>
                    <LinkComponent
                      onClick={() => {
                        this.setState({
                          detail: { visible: true, record }
                        });
                      }}
                    >
                      {site('详情')}
                    </LinkComponent>
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
                            writeFragment(this.props.client, 'DepositNote', {
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
                      {site('编辑')}
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
