import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../../components/form/SearchUI';
import ButtonBarComponent from '../../../components/button/ButtonBarComponent';
import withLocale from '../../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../../utils/apollo';
import PromotionField from './Promotion.field';
import { PromotionFragment, Promotion } from './Promotion.model';
import PromotionEdit from './Promotion.edit';
import { AgentInfo, AgentInfoFragment } from '../agentInfo/AgentInfo.model';
import { Result } from '../../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 推广信息 */
@withLocale
@compose(withApollo)
@autobind
export default class PromotionPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new PromotionField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query {
              promotion @rest(type: "PromotionResult", path: "/promotion") {
                data {
                  ...PromotionFragment
                }
              }
            }
            ${PromotionFragment}
          `}
        >
          {({
            data: { promotion = { data: {} as Promotion } } = {}
          }: ChildProps<{}, { promotion: Result<Promotion> }, {}>) => (
            <PromotionEdit
              edit={{ visible: true, record: promotion.data }}
              editFields={editFields}
              onDone={() => {
                this.setState({ edit: { visible: false, record: {} } });
              }}
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
