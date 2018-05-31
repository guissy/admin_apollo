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
import MemberInfoField from './MemberInfo.field';
import { MemberInfoFragment, MemberInfo } from './MemberInfo.model';
import MemberInfoEdit from './MemberInfo.edit';
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
export default class MemberInfoPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new MemberInfoField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query memberInfoQuery($id: Int!) {
              memberInfo(id: $id) @rest(type: "MemberInfoResult", path: "/memberInfo/:id") {
                data {
                  ...MemberInfoFragment
                }
              }
            }
            ${MemberInfoFragment}
          `}
          variables={{ id: match.params.id }}
        >
          {({
            data: { memberInfo = { data: {} as MemberInfo } } = {}
          }: ChildProps<{}, { memberInfo: Result<MemberInfo> }, {}>) => (
            <MemberInfoEdit
              edit={{ visible: true, record: memberInfo.data }}
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
