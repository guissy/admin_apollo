import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../components/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import withLocale from '../../../utils/withLocale';
import { pathBuilder } from '../../../utils/apollo';
import MemberLogField from './MemberLog.field';
import { MemberLogFragment } from './MemberLog.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 会员操作日志 */
@withLocale
@compose(withApollo)
@autobind
export default class MemberLogPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new MemberLogField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
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
        <Query
          query={gql`
            query memberLogQuery(
              $id: String
              $name: String
              $domain: String
              $log_type: String
              $status: String
              $created: String
              $log_ip: String
              $log_value: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              memberLog(
                id: $id
                name: $name
                domain: $domain
                log_type: $log_type
                status: $status
                created: $created
                log_ip: $log_ip
                log_value: $log_value
                page: $page
                page_size: $page_size
              ) @rest(type: "MemberLogResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...MemberLogFragment
                }
              }
            }
            ${MemberLogFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/memberLog')
          }}
        >
          {({
            data: { memberLog = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={memberLog.data}
                columns={tableFields}
                pagination={graphPagination(memberLog.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}
