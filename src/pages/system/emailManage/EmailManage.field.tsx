import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
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
import EmailManagePage from './EmailManage.page';
import { EmailManage, EmailManageFragment, SendType, sendTypeQuery } from './EmailManage.model';
import Editor from '../../../zongzi/pc/editor/Editor';

const site = withLocale.site;

/** 邮件管理字段 */
export default class EmailManageField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  title = {
    title: site('邮件标题'),
    form: <Input />
  };

  created = {
    title: site('发送时间'),
    form: <Input />
  };

  send_type = {
    title: site('发送类型'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, SendType, EmailManagePage>) => (
      <Query query={sendTypeQuery}>
        {({
          data: { sendTypeList = { data: [] as SendType[] } } = {}
        }: ChildProps<{}, { sendTypeList: Result<SendType[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {sendTypeList.data.map((type: SendType, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, SendType, EmailManagePage>) => (
      <Query query={sendTypeQuery}>
        {({
          data: { sendTypeList = { data: [] as SendType[] } } = {}
        }: ChildProps<{}, { sendTypeList: Result<SendType[]> }, {}>) =>
          sendTypeList.data
            .filter(sendType => sendType.id === Number(text))
            .map(sendType => sendType.name)
        }
      </Query>
    )
  };

  status = {
    title: site('发送状态'),
    table: ({ text, record, view }: FieldProps<string, EmailManage, EmailManagePage>) => (
      <>
        {record.status === 1 ? (
          <Tag className="account-opened">{site('成功')}</Tag>
        ) : (
          <Tag className="account-close">{site('失败')}</Tag>
        )}
      </>
    )
  };

  hyper_text = {
    title: site('超文本格式'),
    form: <Switch />
  };

  content = {
    title: site('邮件内容'),
    form: <Editor id="emailManage_content" />,
    table: notInTable
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, EmailManage, EmailManagePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/emailManage/status"
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
                      @rest(path: "/emailManage/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['emailManageQuery']}
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
                              status: record.status === 1 ? 2 : 1
                            }
                          }
                        })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'EmailManage', {
                              id: record.id,
                              status: record.status === 1 ? 2 : 1
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {site('发送')}
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
                      {site('编辑')}
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
