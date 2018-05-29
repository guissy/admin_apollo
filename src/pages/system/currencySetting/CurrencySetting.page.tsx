import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import withLocale from '../../../utils/withLocale';
import { pathBuilder } from '../../../utils/apollo';
import CurrencySettingField from './CurrencySetting.field';
import { CurrencySettingFragment } from './CurrencySetting.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 代理推广资源 */
@withLocale
@compose(withApollo)
@autobind
export default class CurrencySettingPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new CurrencySettingField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <>
        <Query
          query={gql`
            query currencySettingQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              currencySetting(page: $page, page_size: $page_size)
                @rest(type: "CurrencySettingResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...CurrencySettingFragment
                }
              }
            }
            ${CurrencySettingFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/currencySetting')
          }}
        >
          {({
            data: { currencySetting = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={currencySetting.data}
                columns={tableFields}
                pagination={graphPagination(currencySetting.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}
