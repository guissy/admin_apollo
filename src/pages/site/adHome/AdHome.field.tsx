import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Switch, Tag } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../components/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../components/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import AdHomePage from './AdHome.page';
import { AdHome } from './AdHome.model';
import Label from '../../components/label/Label';
import LanguageComponent from '../../components/language/LanguageUI';

const site = withLocale.site;

/** 文案管理字段 */
export default class AdHomeField<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('文案管理名称'),
    form: <Input />,
    detail: <Label />
  };

  language = {
    title: site('语言'),
    form: <LanguageComponent />,
    detail: <Label />
  };

  approve_status = {
    title: site('审核状态'),
    form: <Input />,
    table: ({ text, record, view }: FieldProps<string, AdHome, AdHomePage>) => {
      if (text === 'pass') {
        return <Tag className="audit-ed">{site('已通过')}</Tag>;
      } else if (text === 'pending') {
        return <Tag className="audit-no">{site('待申请')}</Tag>;
      } else if (text === 'rejected') {
        return <Tag className="audit-refused">{site('已拒绝')}</Tag>;
      } else {
        return <Tag className="audit-ing">{site('申请中')}</Tag>;
      }
    },
    detail: <Label />
  };

  created = {
    title: site('生成时间'),
    form: <Input />,
    detail: <Label />
  };

  status = {
    title: site('状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, AdHome, AdHomePage>) => (
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

  sort = {
    title: site('排序'),
    form: <Input />,
    detail: <Label />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, AdHome, AdHomePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/adHome/status"
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
                      @rest(path: "/adHome/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['adHomeQuery']}
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
                            writeFragment(this.props.client, 'AdHome', {
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
