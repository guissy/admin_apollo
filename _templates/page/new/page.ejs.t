---
to: src/pages/<%= h.folder(name) %>.page.tsx
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name); dd = h.dd(name); -%>
import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '<%= dd %>components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '<%= dd %>components/form/SearchUI';
import ButtonBarComponent from '<%= dd %>components/buttonBar/ButtonBarComponent';
import withLocale from '<%= dd %>../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '<%= dd %>../utils/apollo';
import <%= Page %>Field from './<%= Page %>.field';
import { <%= Page %>Fragment, <%= Page %> } from './<%= Page %>.model';
import <%= Page %>Edit from './<%= Page %>.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
}

/** <%= h.title() %> */
@withLocale
@compose(withApollo)
@autobind
export default class <%= Page %>Page extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as <%= Page %>
    },
    edit: {
      visible: false,
      record: {} as <%= Page %>
    },
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new <%= Page %>Field(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    return (
      <>
        {/* 新增按钮 */}
        <ButtonBarComponent
          onCreate={() => {
            this.setState({
              create: { visible: true, record: {} }
            });
          }}
        />
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
        <<%= Page %>Edit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <<%= Page %>Edit
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