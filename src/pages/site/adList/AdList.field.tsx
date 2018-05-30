import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkUI from '../../components/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../components/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import AdListPage from './AdList.page';
import {
  AdList,
  AdListFragment,
  AdListPf,
  adListPfQuery,
  AdListApprove,
  adListApproveQuery
} from './AdList.model';
import Label from '../../components/label/Label';
import LanguageComponent from '../../components/language/LanguageUI';

const site = withLocale.site;

/** 轮播广告字段 */
export default class AdListField<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('轮播广告名称'),
    form: <Input />,
    detail: <Label />,
    search: 'form'
  };

  pf = {
    title: site('使用平台'),
    form: ({ text, record, view, value, onChange }: FieldProps<string, AdListPf, AdListPage>) => (
      <Query query={adListPfQuery}>
        {({
          data: { adListPfList = { data: [] as AdListPf[] } } = {}
        }: ChildProps<{}, { adListPfList: Result<AdListPf[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {adListPfList.data.map((type: AdListPf, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, AdListPf, AdListPage>) => (
      <Query query={adListPfQuery}>
        {({
          data: { adListPfList = { data: [] as AdListPf[] } } = {}
        }: ChildProps<{}, { adListPfList: Result<AdListPf[]> }, {}>) =>
          adListPfList.data
            .filter(adListPf => adListPf.id === Number(text))
            .map(adListPf => adListPf.name)
        }
      </Query>
    )
  };

  position = {
    title: site('使用于'),
    form: <Input />,
    detail: <Label />,
    search: 'form'
  };

  picture = {
    title: site('缩略图'),
    form: <Input />,
    detail: <Label />,
    table: ({ text, record, view }: FieldProps<string, AdListPf, AdListPage>) => <img src={text} />
  };

  link = {
    title: site('跳转链接'),
    form: <Input />,
    detail: <Label />,
    search: 'form'
  };

  language = {
    title: site('语言'),
    form: <Input />,
    detail: <LanguageComponent />,
    search: 'form'
  };

  sort = {
    title: site('排序'),
    form: <Input />,
    detail: <Label />,
    search: 'form'
  };

  approve = {
    title: site('审核状态'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, AdListApprove, AdListPage>) => (
      <Query query={adListApproveQuery}>
        {({
          data: { adListApproveList = { data: [] as AdListApprove[] } } = {}
        }: ChildProps<{}, { adListApproveList: Result<AdListApprove[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {adListApproveList.data.map((type: AdListApprove, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, AdListApprove, AdListPage>) => (
      <Query query={adListApproveQuery}>
        {({
          data: { adListApproveList = { data: [] as AdListApprove[] } } = {}
        }: ChildProps<{}, { adListApproveList: Result<AdListApprove[]> }, {}>) =>
          adListApproveList.data
            .filter(adListApprove => adListApprove.id === Number(text))
            .map(adListApprove => adListApprove.name)
        }
      </Query>
    )
  };

  status = {
    title: site('使用状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, AdList, AdListPage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
          <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>
    ),
    detail: <Label />,
    search: 'form'
  };

  created = {
    title: site('生成时间'),
    form: <Input />,
    detail: <Label />,
    search: 'form'
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, AdList, AdListPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/adList/status"
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
                      @rest(path: "/adList/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['adListQuery']}
              >
                {remove => (
                  <TableAction>
                    <LinkUI
                      onClick={() => {
                        this.setState({
                          detail: { visible: true, record }
                        });
                      }}
                    >
                      {site('详情')}
                    </LinkUI>
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
                            writeFragment(this.props.client, 'AdList', {
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
