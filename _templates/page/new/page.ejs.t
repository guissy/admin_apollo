---
to: src/pages/<%= name %>/<%= Name %>.tsx
---
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
import <%= Name %>Field from './<%= Name %>.field';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
}

/** <%= Name %> */
@withLocale
@compose(withApollo)
@autobind
export default class <%= Name %> extends React.PureComponent<Props, {}> {
  state = {}

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new <%= Name %>Field(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <Query
          query={
            gql`
              query <%= name %>Query(
                $page: Int
                $page_size: Int
                $pathBuilder: any
              ) {
                <%= name %>(
                  page: $page
                  page_size: $page_size
                ) @rest(type: "<%= Name %>Result", pathBuilder: $pathBuilder) {
                  state
                  message
                  data {
                    ...<%= Name %>ItemFragment
                  }
                }
              }
              ${<%= Name %>ItemFragment}
            `
          }
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/<%= name %>')
          }}
        >
          {({ data: { <%= name %> = { data: [], attributes: {} } }, loading, refetch, fetchMore }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={<%= name %>.data}
                columns={tableFields}
                pagination={getPagination(<%= name %>.attributes, fetchMore)}
              />
            );
          }}
        </Query>
    );
  }
}