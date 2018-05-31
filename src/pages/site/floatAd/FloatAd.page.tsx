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
import FloatAdField from './FloatAd.field';
import { FloatAdFragment, FloatAd } from './FloatAd.model';
import FloatAdEdit from './FloatAd.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 浮动广告 */
@withLocale
@compose(withApollo)
@autobind
export default class FloatAdPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as FloatAd
    },
    edit: {
      visible: false,
      record: {} as FloatAd
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new FloatAdField(this as React.PureComponent<Hoc>);
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
            query floatAdQuery(
              $name: String
              $link: String
              $language: String
              $picture: String
              $position: String
              $pf: String
              $approve: String
              $sort: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              floatAd(
                name: $name
                link: $link
                language: $language
                picture: $picture
                position: $position
                pf: $pf
                approve: $approve
                sort: $sort
                page: $page
                page_size: $page_size
              ) @rest(type: "FloatAdResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...FloatAdFragment
                }
              }
            }
            ${FloatAdFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/floatAd')
          }}
        >
          {({
            data: { floatAd = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={floatAd.data}
                columns={tableFields}
                pagination={graphPagination(floatAd.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <FloatAdEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <FloatAdEdit
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
