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
import AnnounceManagePage from './AnnounceManage.page';
import {
  AnnounceManage,
  AnnounceManageFragment,
  SendType,
  sendTypeQuery,
  AnnounceManageType,
  announceManageTypeQuery,
  PopupType,
  popupTypeQuery
} from './AnnounceManage.model';
import LanguageComponent from '../../components/language/LanguageComponent';

const site = withLocale.site;

/** 公告管理字段 */
export default class AnnounceManageField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  send_type = {
    title: site('发送类型'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, SendType, AnnounceManagePage>) => (
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
    table: ({ text, record, view }: FieldProps<string, SendType, AnnounceManagePage>) => (
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

  type = {
    title: site('消息类型'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, AnnounceManageType, AnnounceManagePage>) => (
      <Query query={announceManageTypeQuery}>
        {({
          data: { announceManageTypeList = { data: [] as AnnounceManageType[] } } = {}
        }: ChildProps<{}, { announceManageTypeList: Result<AnnounceManageType[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {announceManageTypeList.data.map((type: AnnounceManageType, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, AnnounceManageType, AnnounceManagePage>) => (
      <Query query={announceManageTypeQuery}>
        {({
          data: { announceManageTypeList = { data: [] as AnnounceManageType[] } } = {}
        }: ChildProps<{}, { announceManageTypeList: Result<AnnounceManageType[]> }, {}>) =>
          announceManageTypeList.data
            .filter(announceManageType => announceManageType.id === Number(text))
            .map(announceManageType => announceManageType.name)
        }
      </Query>
    )
  };

  title = {
    title: site('公告标题'),
    form: <Input />,
    search: 'form'
  };

  content = {
    title: site('内容'),
    form: <Input />,
    search: 'form'
  };

  'start_time,end_time' = {
    title: site('起始时间'),
    form: <DatePicker.RangePicker />,
    table: ({ text, record, view }: FieldProps<string, AnnounceManage, AnnounceManagePage>) => (
      <>
        {record.start_time} <br />
        {record.end_time}
      </>
    ),
    search: 'form'
  };

  popup_type = {
    title: site('弹出类型'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, PopupType, AnnounceManagePage>) => (
      <Query query={popupTypeQuery}>
        {({
          data: { popupTypeList = { data: [] as PopupType[] } } = {}
        }: ChildProps<{}, { popupTypeList: Result<PopupType[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {popupTypeList.data.map((type: PopupType, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, PopupType, AnnounceManagePage>) => (
      <Query query={popupTypeQuery}>
        {({
          data: { popupTypeList = { data: [] as PopupType[] } } = {}
        }: ChildProps<{}, { popupTypeList: Result<PopupType[]> }, {}>) =>
          popupTypeList.data
            .filter(popupType => popupType.id === Number(text))
            .map(popupType => popupType.name)
        }
      </Query>
    )
  };

  recipient = {
    title: site('接收人'),
    form: <Input />,
    search: 'form'
  };

  admin_name = {
    title: site('发送人'),
    form: <Input />,
    search: 'form'
  };

  recipient_origin = {
    title: site('发送人'),
    form: <Input />,
    search: 'form'
  };

  language_id = {
    title: site('语言'),
    form: <LanguageComponent />
  };

  start_time = {
    title: site('开始时间'),
    form: <Input />,
    search: 'form'
  };

  end_time = {
    title: site('结束时间'),
    form: <Input />,
    search: 'form'
  };

  status = {
    title: site('状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, AnnounceManage, AnnounceManagePage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
          <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>
    ),
    search: 'form'
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, AnnounceManage, AnnounceManagePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/announceManage/status"
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
                      @rest(path: "/announceManage/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['announceManageQuery']}
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
                            writeFragment(this.props.client, 'AnnounceManage', {
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
