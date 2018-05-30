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
import IdleAccountField from './IdleAccount.field';
import { IdleAccountFragment, IdleAccount } from './IdleAccount.model';
import IdleAccountEdit from './IdleAccount.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 闲置账号 */
@withLocale
@compose(withApollo)
@autobind
export default class IdleAccountPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as IdleAccount
    },
    edit: {
      visible: false,
      record: {} as IdleAccount
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new IdleAccountField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const searchFields = fields.filterBy('search');
    return (
      <>
        <SearchUI
          fieldConfig={searchFields}
          onSubmit={(values: { pathBuilder: (o: object) => string }) => {
            const searchValues = {
              ...values,
              page: 1,
              page_size: 20
            };
            this.setState({ searchValues });
            return this.refetch(searchValues);
          }}
        />
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
            query idleAccountQuery(
              $name: String
              $agent: String
              $total: String
              $last_login: String
              $balance: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              idleAccount(
                name: $name
                agent: $agent
                total: $total
                last_login: $last_login
                balance: $balance
                page: $page
                page_size: $page_size
              ) @rest(type: "IdleAccountResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...IdleAccountFragment
                }
              }
            }
            ${IdleAccountFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/idleAccount')
          }}
        >
          {({
            data: { idleAccount = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={idleAccount.data}
                columns={tableFields}
                pagination={graphPagination(idleAccount.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <IdleAccountEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <IdleAccountEdit
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
