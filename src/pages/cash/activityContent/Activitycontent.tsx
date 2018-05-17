import * as React from 'react';
import styled from 'styled-components';
import { compose, withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchComponent } from '../../components/form/SearchComponent';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import { SearchComponent } from '../../components/form/SearchComponent';
import ActivitycontentField from './Activitycontent.field';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** Activitycontent */
@withLocale
@compose(withApollo)
@autobind
export default class Activitycontent extends React.PureComponent<Props, {}> {
  state = {};

  render() {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new ActivitycontentField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <Query
        query={gql`
          query activityContentQuery($page: Int, $page_size: Int, $pathBuilder: any) {
            activityContent(page: $page, page_size: $page_size)
              @rest(type: "ActivitycontentResult", pathBuilder: $pathBuilder) {
              state
              message
              data {
                ...ActivitycontentItemFragment
              }
            }
          }
          ${ActivitycontentItemFragment}
        `}
        variables={{
          page: 1,
          page_size: 20,
          pathBuilder: pathBuilder('/activityContent')
        }}
      >
        {({
          data: { activityContent = { data: [], attributes: {} } },
          loading,
          refetch,
          fetchMore
        }) => {
          this.refetch = refetch;
          return (
            <TableComponent
              loading={loading}
              dataSource={activityContent.data}
              columns={tableFields}
              pagination={getPagination(activityContent.attributes, fetchMore)}
            />
          );
        }}
      </Query>
    );
  }
}
