import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../../../zongzi/pc/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../../../zongzi/pc/form/SearchUI';
import ButtonBar from '../../../../zongzi/pc/button/ButtonBar';
import withLocale from '../../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../../utils/apollo';
import MemberHierarchyField from './MemberHierarchy.field';
import { MemberHierarchyFragment, MemberHierarchy } from './MemberHierarchy.model';
import MemberHierarchyEdit from './MemberHierarchy.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 会员层级 */
@withLocale
@compose(withApollo)
@autobind
export default class MemberHierarchyPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as MemberHierarchy
    },
    edit: {
      visible: false,
      record: {} as MemberHierarchy
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new MemberHierarchyField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    return (
      <>
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
            query memberHierarchyQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              memberHierarchy(page: $page, page_size: $page_size)
                @rest(type: "MemberHierarchyResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...MemberHierarchyFragment
                }
              }
            }
            ${MemberHierarchyFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/memberHierarchy')
          }}
        >
          {({
            data: { memberHierarchy = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={memberHierarchy.data}
                columns={tableFields}
                pagination={graphPagination(memberHierarchy.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <MemberHierarchyEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <MemberHierarchyEdit
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
