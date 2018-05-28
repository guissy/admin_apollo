import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { match as Match, Route, Switch, withRouter } from 'react-router';
import { SearchUI } from '../../../components/form/SearchUI';
import withLocale from '../../../../utils/withLocale';
import BankCardField from './BankCard.field';
import { BankCardFragment, BankCard } from './BankCard.model';
import BankCardEdit from './BankCard.edit';
import { Result } from '../../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{ id: string }>;
}

interface Props extends Partial<Hoc> {}

/** 个人资料 */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class BankCardPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new BankCardField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query bankCardQuery($id: Int!) {
              bankCard(id: $id) @rest(type: "BankCardResult", path: "/bankCard/:id") {
                data {
                  ...BankCardFragment
                }
              }
            }
            ${BankCardFragment}
          `}
          variables={{ id: match.params.id }}
        >
          {({
            data: { bankCard = { data: {} as BankCard } } = {}
          }: ChildProps<{}, { bankCard: Result<BankCard> }, {}>) => (
            <BankCardEdit
              edit={{ visible: true, record: bankCard.data }}
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
