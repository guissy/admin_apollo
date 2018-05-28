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
import MemberSettingField from './MemberSetting.field';
import { MemberSettingFragment, MemberSetting } from './MemberSetting.model';
import MemberSettingEdit from './MemberSetting.edit';
import { Result } from '../../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{ id: string }>;
}

interface Props extends Partial<Hoc> {}

/** 会员设置 */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class MemberSettingPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new MemberSettingField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query memberSettingQuery($id: Int!) {
              memberSetting(id: $id)
                @rest(type: "MemberSettingResult", path: "/memberSetting/:id") {
                data {
                  ...MemberSettingFragment
                }
              }
            }
            ${MemberSettingFragment}
          `}
          variables={{ id: match.params.id }}
        >
          {({
            data: { memberSetting = { data: {} as MemberSetting } } = {}
          }: ChildProps<{}, { memberSetting: Result<MemberSetting> }, {}>) => (
            <MemberSettingEdit
              edit={{ visible: true, record: memberSetting.data }}
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
