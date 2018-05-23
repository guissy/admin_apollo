---
to: src/pages/<%= h.folder(name) %>.page.tsx
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name) -%>
import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import <%= Page %>Field from './<%= Page %>.field';
import { <%= Page %>Fragment, <%= Page %> } from './<%= Page %>.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
}

/** <%= Page %>Page */
@withLocale
@compose(withApollo)
@autobind
export default class <%= Page %>Page extends React.PureComponent<Props, {}> {
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new <%= Page %>Field(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <>
        <Query
          query={
            gql`
              query <%= page %>Query(
                $page: Int
                $page_size: Int
                $pathBuilder: any
              ) {
                <%= page %>(
                  page: $page
                  page_size: $page_size
                ) @rest(type: "<%= Page %>Result", pathBuilder: $pathBuilder) {
                  state
                  message
                  data {
                    ...<%= Page %>Fragment
                  }
                }
              }
              ${<%= Page %>Fragment}
            `
          }
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/<%= page %>')
          }}
        >
          {({ data: { <%= page %> = { data: [], attributes: {} } } = {}, loading, refetch, fetchMore }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={<%= page %>.data}
                columns={tableFields}
                pagination={graphPagination(<%= page %>.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}