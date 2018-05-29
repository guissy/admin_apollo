import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBarComponent from '../../components/button/ButtonBarComponent';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import AdHomeField from './AdHome.field';
import { AdHomeFragment, AdHome } from './AdHome.model';
import AdHomeEdit from './AdHome.edit';
import { Button } from 'antd';
import { Modal } from 'antd';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 文案管理 */
@withLocale
@compose(withApollo)
@autobind
export default class AdHomePage extends React.PureComponent<Props, {}> {
  state = {
    detail: {
      visible: false,
      record: {} as AdHome
    },
    detail: {
      visible: false,
      record: {} as AdHome
    },
    detail: {
      visible: false,
      record: {} as AdHome
    },
    create: {
      visible: false,
      record: {} as AdHome
    },
    edit: {
      visible: false,
      record: {} as AdHome
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new AdHomeField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const detailFields = fields.detail(this.state.detail.record);
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
            query adHomeQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              adHome(page: $page, page_size: $page_size)
                @rest(type: "AdHomeResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...AdHomeFragment
                }
              }
            }
            ${AdHomeFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/adHome')
          }}
        >
          {({
            data: { adHome = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={adHome.data}
                columns={tableFields}
                pagination={graphPagination(adHome.attributes, fetchMore)}
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
        <AdHomeEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <AdHomeEdit
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
