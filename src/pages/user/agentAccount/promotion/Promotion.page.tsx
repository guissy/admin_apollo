import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { autobind } from 'core-decorators';
import { match as Match, withRouter } from 'react-router';
import withLocale from '../../../../utils/withLocale';
import PromotionField from './Promotion.field';
import { Promotion, PromotionFragment } from './Promotion.model';
import PromotionEdit from './Promotion.edit';
import { Result } from '../../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{ id: string }>;
}

interface Props extends Partial<Hoc> {}

/** 推广信息 */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class PromotionPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new PromotionField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query promotionQuery($id: Int!) {
              promotion(id: $id) @rest(type: "PromotionResult", path: "/promotion") {
                data {
                  ...PromotionFragment
                }
              }
            }
            ${PromotionFragment}
          `}
          variables={{ id: match.params.id }}
        >
          {({
            data: { promotion = { data: {} as Promotion } } = {}
          }: ChildProps<{}, { promotion: Result<Promotion> }, {}>) => (
            <PromotionEdit
              edit={{ visible: true, record: promotion.data }}
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
