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
import DiscountSettingField from './DiscountSetting.field';
import { DiscountSettingFragment, DiscountSetting } from './DiscountSetting.model';
import DiscountSettingEdit from './DiscountSetting.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 返水优惠设定 */
@withLocale
@compose(withApollo)
@autobind
export default class DiscountSettingPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as DiscountSetting
    },
    edit: {
      visible: false,
      record: {} as DiscountSetting
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new DiscountSettingField(this as React.PureComponent<Hoc>);
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
            query discountSettingQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              discountSetting(page: $page, page_size: $page_size)
                @rest(type: "DiscountSettingResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...DiscountSettingFragment
                }
              }
            }
            ${DiscountSettingFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/discountSetting')
          }}
        >
          {({
            data: { discountSetting = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={discountSetting.data}
                columns={tableFields}
                pagination={graphPagination(discountSetting.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <DiscountSettingEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <DiscountSettingEdit
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
