import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { autobind } from 'core-decorators';
import { match as Match, withRouter } from 'react-router';
import withLocale from '../../../utils/withLocale';
import DomainSettingField from './DomainSetting.field';
import { DomainSetting, DomainSettingFragment } from './DomainSetting.model';
import DomainSettingEdit from './DomainSetting.edit';
import { Result } from '../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{ id: string }>;
}

interface Props extends Partial<Hoc> {}

/** 前台域名设置 */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class DomainSettingPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new DomainSettingField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query {
              domainSetting @rest(type: "DomainSettingResult", path: "/domainSetting") {
                data {
                  ...DomainSettingFragment
                }
              }
            }
            ${DomainSettingFragment}
          `}
        >
          {({
            data: { domainSetting = { data: {} as DomainSetting } } = {}
          }: ChildProps<{}, { domainSetting: Result<DomainSetting> }, {}>) =>
            Object.keys(domainSetting.data).length > 0 ? (
              <DomainSettingEdit
                edit={{ visible: true, record: domainSetting.data }}
                editFields={editFields}
                modalTitle="编辑"
                modalOk="编辑成功"
                view={this}
              />
            ) : null
          }
        </Query>
      </>
    );
  }
}
