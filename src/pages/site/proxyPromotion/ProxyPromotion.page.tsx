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
import ProxyPromotionField from './ProxyPromotion.field';
import { ProxyPromotionFragment, ProxyPromotion } from './ProxyPromotion.model';
import ProxyPromotionEdit from './ProxyPromotion.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 代理推广资源 */
@withLocale
@compose(withApollo)
@autobind
export default class ProxyPromotionPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as ProxyPromotion
    },
    edit: {
      visible: false,
      record: {} as ProxyPromotion
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new ProxyPromotionField(this as React.PureComponent<Hoc>);
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
            query proxyPromotionQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              proxyPromotion(page: $page, page_size: $page_size)
                @rest(type: "ProxyPromotionResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...ProxyPromotionFragment
                }
              }
            }
            ${ProxyPromotionFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/proxyPromotion')
          }}
        >
          {({
            data: { proxyPromotion = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={proxyPromotion.data}
                columns={tableFields}
                pagination={graphPagination(proxyPromotion.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <ProxyPromotionEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <ProxyPromotionEdit
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
