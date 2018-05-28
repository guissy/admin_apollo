---
to: src/pages/<%= h.folder(name) %>.page.tsx
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name); dd = h.dd(name); -%>
import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '<%= dd %>components/table/TableComponent';
import { autobind } from 'core-decorators';
import { match as Match, Route, Switch, withRouter } from 'react-router';
import { SearchUI } from '<%= dd %>components/form/SearchUI';
import withLocale from '<%= dd %>../utils/withLocale';
import <%= Page %>Field from './<%= Page %>.field';
import { <%= Page %>Fragment, <%= Page %> } from './<%= Page %>.model';
import <%= Page %>Edit from './<%= Page %>.edit';
import { Result } from '<%= dd %>../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{id: string}>;
}

interface Props extends Partial<Hoc> {
}

/** <%= h.title() %> */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class <%= Page %>Page extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new <%= Page %>Field(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query <%- page %>Query($id: Int!) {
              <%- page %>(id: $id) @rest(type: "<%- Page %>Result", path: "/<%- page %>/:id") {
                data {
                  ...<%- Page %>Fragment
                }
              }
            }
            ${<%- Page %>Fragment}
          `}
          variables={{id: match.params.id}}
        >
          {({
            data: { <%- page %> = { data: {} as <%- Page %> } } = {}
          }: ChildProps<{}, { <%- page %>: Result<<%- Page %>> }, {}>) => (
            <<%= Page %>Edit
              edit={{ visible: true, record: <%- page %>.data }}
              editFields={editFields}
              modalTitle="编辑"
              modalOk="编辑成功"
              view={this}
            />
          )}
        </Query>
      </>
    );
  }
}