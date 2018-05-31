import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../../zongzi/pc/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../../zongzi/pc/form/SearchUI';
import ButtonBar from '../../../zongzi/pc/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import OtherMemberField from './OtherMember.field';
import { OtherMemberFragment, OtherMember } from './OtherMember.model';
import OtherMemberEdit from './OtherMember.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 第三方会员查询 */
@withLocale
@compose(withApollo)
@autobind
export default class OtherMemberPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as OtherMember
    },
    edit: {
      visible: false,
      record: {} as OtherMember
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new OtherMemberField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
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
            query otherMemberQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              otherMember(page: $page, page_size: $page_size)
                @rest(type: "OtherMemberResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...OtherMemberFragment
                }
              }
            }
            ${OtherMemberFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/otherMember')
          }}
        >
          {({
            data: { otherMember = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={otherMember.data}
                columns={tableFields}
                pagination={graphPagination(otherMember.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <OtherMemberEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <OtherMemberEdit
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
