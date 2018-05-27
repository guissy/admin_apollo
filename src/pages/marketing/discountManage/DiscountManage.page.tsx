import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBarComponent from '../../components/button/ButtonBarComponent';
import withLocale from '../../../utils/withLocale';
import { pathBuilder } from '../../../utils/apollo';
import DiscountManageField from './DiscountManage.field';
import { DiscountManage, DiscountManageFragment } from './DiscountManage.model';
import DiscountManageEdit from './DiscountManage.edit';
import { match as Match, Route, Switch } from 'react-router';
import DiscountDetailPage from '../discountDetail/DiscountDetail.page';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{}>;
}

interface Props extends Partial<Hoc> {}

/** 返水活动 */
@withLocale
@compose(withApollo)
@autobind
export default class DiscountManagePage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as DiscountManage
    },
    edit: {
      visible: false,
      record: {} as DiscountManage
    },
    detail: {
      id: NaN,
      name: ''
    },
    searchValues: {}
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new DiscountManageField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const searchFields = fields.filterBy('search');
    return (
      <Switch>
        <Route
          path={match.path}
          exact={true}
          render={() => (
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
              <ButtonBarComponent
                onCreate={() => {
                  this.setState({
                    create: { visible: true, record: {} }
                  });
                }}
              />
              <Query
                query={gql`
                  query discountManageQuery($page: Int, $page_size: Int, $pathBuilder: any) {
                    discountManage(page: $page, page_size: $page_size)
                      @rest(type: "DiscountManageResult", pathBuilder: $pathBuilder) {
                      state
                      message
                      data {
                        ...DiscountManageFragment
                      }
                    }
                  }
                  ${DiscountManageFragment}
                `}
                variables={{
                  page: 1,
                  page_size: 20,
                  pathBuilder: pathBuilder('/discount')
                }}
              >
                {({
                  data: { discountManage = { data: [], attributes: {} } } = {},
                  loading,
                  refetch,
                  fetchMore
                }) => {
                  this.refetch = refetch;
                  return (
                    <TableComponent
                      loading={loading}
                      dataSource={discountManage.data}
                      columns={tableFields}
                      pagination={graphPagination(
                        discountManage.attributes,
                        fetchMore,
                        this.state.searchValues
                      )}
                    />
                  );
                }}
              </Query>
              <DiscountManageEdit
                edit={this.state.create}
                editFields={editFields}
                onDone={() => {
                  this.setState({ create: { visible: false, record: {} } });
                }}
                modalTitle="创建"
                modalOk="创建成功"
                view={this}
              />
              <DiscountManageEdit
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
          )}
        />
        <Route
          path={match.path + '/:id'}
          render={() => <DiscountDetailPage detail={this.state.detail} />}
        />
      </Switch>
    );
  }
}
