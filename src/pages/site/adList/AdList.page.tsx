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
import AdListField from './AdList.field';
import { AdListFragment, AdList } from './AdList.model';
import AdListEdit from './AdList.edit';
import { Button, Modal } from 'antd';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 轮播广告 */
@withLocale
@compose(withApollo)
@autobind
export default class AdListPage extends React.PureComponent<Props, {}> {
  state = {
    detail: {
      visible: false,
      record: {} as AdList
    },
    create: {
      visible: false,
      record: {} as AdList
    },
    edit: {
      visible: false,
      record: {} as AdList
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new AdListField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const searchFields = fields.filterBy('search');
    const detailFields = fields.detail(this.state.detail.record);
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
            query adListQuery(
              $name: String
              $pf: String
              $position: String
              $picture: String
              $link: String
              $language: String
              $sort: String
              $approve: String
              $status: String
              $created: String
              $picture: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              adList(
                name: $name
                pf: $pf
                position: $position
                picture: $picture
                link: $link
                language: $language
                sort: $sort
                approve: $approve
                status: $status
                created: $created
                picture: $picture
                page: $page
                page_size: $page_size
              ) @rest(type: "AdListResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...AdListFragment
                }
              }
            }
            ${AdListFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/adList')
          }}
        >
          {({
            data: { adList = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={adList.data}
                columns={tableFields}
                pagination={graphPagination(adList.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <Modal
          visible={this.state.detail.visible}
          title={site('详情')}
          onCancel={() => {
            this.setState({
              detail: { visible: false }
            });
          }}
          footer={
            <Button
              onClick={() => {
                this.setState({ detail: { visible: false } });
              }}
            >
              关闭
            </Button>
          }
        >
          <div>{detailFields}</div>
        </Modal>
        <AdListEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <AdListEdit
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
