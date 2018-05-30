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
import ProxyPromotionPage from './ProxyPromotion.page';
import { ProxyPromotion } from './ProxyPromotion.model';
import UploadUI from '../../components/upload/UploadUI';
import LanguageComponent from '../../components/language/LanguageUI';

const site = withLocale.site;

/** 代理推广资源字段 */
export default class ProxyPromotionField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('媒体名称'),
    form: <Input />
  };

  width = {
    title: site('宽度'),
    form: <Input />
  };

  length = {
    title: site('高度'),
    form: <Input />
  };

  wh = {
    title: site('尺寸'),
    form: <Input />
  };

  file_type = {
    title: site('文件类型'),
    form: <Input />
  };

  picture = {
    title: site('缩略图'),
    form: <UploadUI />,
    table: ({ text, record, view }: FieldProps<string, ProxyPromotion, ProxyPromotionPage>) => (
      <img src={text} alt="picture" />
    )
  };

  language_id = {
    title: site('语言'),
    form: <LanguageComponent />
  };

  script = {
    title: site('脚本'),
    form: <Input.TextArea />
  };

  status = {
    title: site('状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, ProxyPromotion, ProxyPromotionPage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
          <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>
    )
  };

  created = {
    title: site('生成时间'),
    form: <Input />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, ProxyPromotion, ProxyPromotionPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/proxyPromotion/status"
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
                      @rest(path: "/proxyPromotion/:id", method: "DELETE", type: "RemoveResult") {
                      state
                      message
                    }
                  }
                `}
                refetchQueries={['proxyPromotionQuery']}
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
                            writeFragment(this.props.client, 'ProxyPromotion', {
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
