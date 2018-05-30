import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../components/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBar from '../../components/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import EmailManageField from './EmailManage.field';
import { EmailManageFragment, EmailManage } from './EmailManage.model';
import EmailManageEdit from './EmailManage.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 邮件管理 */
@withLocale
@compose(withApollo)
@autobind
export default class EmailManagePage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as EmailManage
    },
    edit: {
      visible: false,
      record: {} as EmailManage
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new EmailManageField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    return (
      <>
        {/* 新增按钮 */}
        <ButtonBar
          onCreate={() => {
            this.setState({
              create: { visible: true, record: {} }
            });
          }}
        />
        <Query
          query={gql`
            query emailManageQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              emailManage(page: $page, page_size: $page_size)
                @rest(type: "EmailManageResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...EmailManageFragment
                }
              }
            }
            ${EmailManageFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/emailManage')
          }}
        >
          {({
            data: { emailManage = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={emailManage.data}
                columns={tableFields}
                pagination={graphPagination(emailManage.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <EmailManageEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <EmailManageEdit
          edit={this.state.edit}
          editFields={editFields}
          onDone={() => {
            this.setState({ edit: { visible: false, record: {} } });
          }}
          modalTitle="编辑"
          modalOk="编辑成功"
          view={this}
        />
      </>
    );
  }
}
