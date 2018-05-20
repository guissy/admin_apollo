---
to: src/pages/<%= h.inflection.camelize(name, true) %>/<%= h.inflection.camelize(name) %>.tsx
---
<% Page = h.inflection.camelize(name); page = h.inflection.camelize(name, true) -%>
import * as React from 'react';
import styled from 'styled-components';
import { compose, withApollo } from 'react-apollo';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchComponent } from '../../components/form/SearchUI';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import { SearchComponent } from '../../components/form/SearchUI';
import <%= Page %>Field from './<%= Page %>.field';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
}

/** <%= Page %> */
@withLocale
@compose(withApollo)
@autobind
export default class <%= Page %> extends React.PureComponent<Props, {}> {
  state = {}

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new <%= Page %>Field(this as React.PureComponent<Hoc>);
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
                ) @rest(type: "<%= Page %>Result", pathBuilder: $pathBuilder) {
                  state
                  message
                  data {
                    ...<%= Page %>ItemFragment
                  }
                }
              }
              ${<%= Page %>ItemFragment}
            `
          }
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/<%= page %>')
          }}
        >
          {({ data: { <%= page %> = { data: [], attributes: {} } }, loading, refetch, fetchMore }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={<%= page %>.data}
                columns={tableFields}
                pagination={getPagination(<%= page %>.attributes, fetchMore)}
              />
            );
          }}
        </Query>
    );
  }
}