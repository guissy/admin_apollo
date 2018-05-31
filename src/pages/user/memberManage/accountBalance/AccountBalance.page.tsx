import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../../../zongzi/pc/table/TableUI';
import { autobind } from 'core-decorators';
import { match as Match, Route, Switch, withRouter } from 'react-router';
import { SearchUI } from '../../../../zongzi/pc/form/SearchUI';
import withLocale from '../../../../utils/withLocale';
import AccountBalanceField from './AccountBalance.field';
import { AccountBalanceFragment, AccountBalance } from './AccountBalance.model';
import AccountBalanceEdit from './AccountBalance.edit';
import { Result } from '../../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{ id: string }>;
}

interface Props extends Partial<Hoc> {}

/** 账户余额 */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class AccountBalancePage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new AccountBalanceField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query accountBalanceQuery($id: Int!) {
              accountBalance(id: $id)
                @rest(type: "AccountBalanceResult", path: "/accountBalance/:id") {
                data {
                  ...AccountBalanceFragment
                }
              }
            }
            ${AccountBalanceFragment}
          `}
          variables={{ id: match.params.id }}
        >
          {({
            data: { accountBalance = { data: {} as AccountBalance } } = {}
          }: ChildProps<{}, { accountBalance: Result<AccountBalance> }, {}>) => (
            <AccountBalanceEdit
              edit={{ visible: true, record: accountBalance.data }}
              editFields={editFields}
              modalTitle="编辑"
              modalOk="编辑成功"
              view={this}
            />
          )}
        </Query>
      </>
    );
  }
}
