import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import AgentAuditField from './AgentAudit.field';
import { AgentAuditFragment, AgentAudit } from './AgentAudit.model';
import AgentAuditEdit from './AgentAudit.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 代理审核 */
@withLocale
@compose(withApollo)
@autobind
export default class AgentAuditPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as AgentAudit
    },
    edit: {
      visible: false,
      record: {} as AgentAudit
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new AgentAuditField(this as React.PureComponent<Hoc>);
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
        <ButtonBarComponent
          onCreate={() => {
            this.setState({
              create: { visible: true, record: {} }
            });
          }}
        />
        <Query
          query={gql`
            query agentAuditQuery(
              $name: String
              $mobile: String
              $email: String
              $truename: String
              $created: String
              $channel: String
              $ip: String
              $admin_user: String
              $status: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              agentAudit(
                name: $name
                mobile: $mobile
                email: $email
                truename: $truename
                created: $created
                channel: $channel
                ip: $ip
                admin_user: $admin_user
                status: $status
                page: $page
                page_size: $page_size
              ) @rest(type: "AgentAuditResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...AgentAuditFragment
                }
              }
            }
            ${AgentAuditFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/agentAudit')
          }}
        >
          {({
            data: { agentAudit = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={agentAudit.data}
                columns={tableFields}
                pagination={graphPagination(agentAudit.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <AgentAuditEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <AgentAuditEdit
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
