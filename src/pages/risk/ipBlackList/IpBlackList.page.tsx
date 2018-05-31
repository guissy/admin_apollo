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
import IpBlackListField from './IpBlackList.field';
import { IpBlackListFragment, IpBlackList } from './IpBlackList.model';
import IpBlackListEdit from './IpBlackList.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** IpBlackListPage */
@withLocale
@compose(withApollo)
@autobind
export default class IpBlackListPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as IpBlackList
    },
    edit: {
      visible: false,
      record: {} as IpBlackList
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new IpBlackListField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const searchFields = fields.filterBy('search');
    return (
      <>
        {/* 搜索 */}
        <SearchUI
          fieldConfig={searchFields}
          onSubmit={values => {
            this.setState({ searchValues: values });
            return this.refetch(values);
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
            query ipBlackListQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              ipBlackList(page: $page, page_size: $page_size)
                @rest(type: "IpBlackListResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...IpBlackListFragment
                }
              }
            }
            ${IpBlackListFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/ipBlackList')
          }}
        >
          {({
            data: { ipBlackList = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={ipBlackList.data}
                columns={tableFields}
                pagination={graphPagination(ipBlackList.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <IpBlackListEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <IpBlackListEdit
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
