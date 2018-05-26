import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../../components/form/SearchUI';
import ButtonBarComponent from '../../../components/buttonBar/ButtonBarComponent';
import withLocale from '../../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../../utils/apollo';
import MemberQueryField from './MemberQuery.field';
import { MemberQueryFragment, MemberQuery } from './MemberQuery.model';
import MemberQueryEdit from './MemberQuery.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 会员查询 */
@withLocale
@compose(withApollo)
@autobind
export default class MemberQueryPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as MemberQuery
    },
    edit: {
      visible: false,
      record: {} as MemberQuery
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new MemberQueryField(this as React.PureComponent<Hoc>);
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
          query={gql`
            query memberQueryQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              memberQuery(page: $page, page_size: $page_size)
                @rest(type: "MemberQueryResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...MemberQueryFragment
                }
              }
            }
            ${MemberQueryFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/memberQuery')
          }}
        >
          {({
            data: { memberQuery = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={memberQuery.data}
                columns={tableFields}
                pagination={graphPagination(memberQuery.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <MemberQueryEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <MemberQueryEdit
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
