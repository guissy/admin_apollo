import * as React from 'react';
import { compose, Query, withApollo } from 'react-apollo';
import { autobind } from 'core-decorators';
import withLocale from '../../../utils/withLocale';
import { SearchComponent } from '../../components/form/SearchComponent';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import ActivityContentField from './ActivityContent.field';
import ApolloClient from 'apollo-client/ApolloClient';
import { pathBuilder } from '../../../utils/apollo';
import gql from 'graphql-tag';
import { getPagination, default as TableComponent } from '../../components/table/TableComponent';
import { ActivityContentItemFragment } from './ActivityContent.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 手动优惠 */
@withLocale
@compose(withApollo)
@autobind
export default class ActivityContent extends React.PureComponent<Props, {}> {
  state = {
    searchValues: {}
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new ActivityContentField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('edit');
    const searchFields = fields.filterBy('search');
    const tableFields = fields.table(this);
    const setState = this.setState.bind(this);
    return (
      <>
        {/* 搜索 */}
        <SearchComponent fieldConfig={searchFields} pageSize={30} />
        {/* 新增按钮 */}
        <ButtonBarComponent
          onCreate={() => {
            console.log('☞☞☞ 9527 ActivityContent 50');
          }}
        />
        <Query
          query={gql`
            query activityContentQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              activityContent(page: $page, page_size: $page_size)
                @rest(type: "ActivityContentResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...ActivityContentItemFragment
                }
              }
            }
            ${ActivityContentItemFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/activity/content')
          }}
        >
          {({
            data: { activityContent = { data: [], attributes: {} } },
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={activityContent.data}
                columns={tableFields}
                pagination={getPagination(activityContent.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}
