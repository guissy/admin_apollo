import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Query, withApollo } from 'react-apollo';
import { SearchUI } from '../../components/form/SearchUI';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import withLocale from '../../../utils/withLocale';
import { pathBuilder } from '../../../utils/apollo';
import CmsLogField from './CmsLog.field';
import { CmsLog, CmsLogFragment } from './CmsLog.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 代理推广资源 */
@withLocale
@compose(withApollo)
@autobind
export default class CmsLogPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as CmsLog
    },
    edit: {
      visible: false,
      record: {} as CmsLog
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const fields = new CmsLogField(this as React.PureComponent<Hoc>);
    const searchFields = fields.filterBy('search');
    const tableFields = fields.table(this);
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
            query cmsLogQuery(
              $id: String
              $created_uname: String
              $user_name: String
              $ip: String
              $module: String
              $op_type: String
              $result: String
              $created: String
              $remark: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              cmsLog(
                id: $id
                created_uname: $created_uname
                user_name: $user_name
                ip: $ip
                module: $module
                op_type: $op_type
                result: $result
                created: $created
                remark: $remark
                page: $page
                page_size: $page_size
              ) @rest(type: "CmsLogResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...CmsLogFragment
                }
              }
            }
            ${CmsLogFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/cmsLog')
          }}
        >
          {({
            data: { cmsLog = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={cmsLog.data}
                columns={tableFields}
                pagination={graphPagination(cmsLog.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}
