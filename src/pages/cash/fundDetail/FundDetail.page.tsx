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
import FundDetailField from './FundDetail.field';
import { FundDetailFragment, FundDetail } from './FundDetail.model';
import FundDetailEdit from './FundDetail.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 现金流水 */
@withLocale
@compose(withApollo)
@autobind
export default class FundDetailPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as FundDetail
    },
    edit: {
      visible: false,
      record: {} as FundDetail
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new FundDetailField(this as React.PureComponent<Hoc>);
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
            query fundDetailQuery(
              $page: Int
              $page_size: Int
              $pathBuilder: any
              $username: String
              $no: String
              $deal_category: Int
              $deal_type: Int
              $start_time: String
              $end_time: String
            ) {
              fundDetail(
                page: $page
                page_size: $page_size
                username: $username
                no: $no
                deal_category: $deal_category
                deal_type: $deal_type
                start_time: $start_time
                end_time: $end_time
              ) @rest(type: "FundDetailResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...FundDetailFragment
                }
              }
            }
            ${FundDetailFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            username: '',
            no: '',
            deal_category: '',
            deal_type: '',
            start_time: '',
            end_time: '',
            pathBuilder: pathBuilder('/fundDetail')
          }}
        >
          {({
            data: { fundDetail = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={fundDetail.data}
                columns={tableFields}
                pagination={graphPagination(fundDetail.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <FundDetailEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <FundDetailEdit
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
