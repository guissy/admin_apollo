import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import withLocale from '../../../utils/withLocale';
import { pathBuilder } from '../../../utils/apollo';
import GameAccountField from './GameAccount.field';
import { GameAccountFragment } from './GameAccount.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 游戏后台帐号 */
@withLocale
@compose(withApollo)
@autobind
export default class GameAccountPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new GameAccountField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <>
        <Query
          query={gql`
            query gameAccountQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              gameAccount(page: $page, page_size: $page_size)
                @rest(type: "GameAccountResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...GameAccountFragment
                }
              }
            }
            ${GameAccountFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/gameAccount')
          }}
        >
          {({
            data: { gameAccount = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={gameAccount.data}
                columns={tableFields}
                pagination={graphPagination(gameAccount.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}
