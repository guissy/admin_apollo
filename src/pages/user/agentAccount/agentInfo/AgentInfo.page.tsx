import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { autobind } from 'core-decorators';
import withLocale from '../../../../utils/withLocale';
import AgentInfoField from './AgentInfo.field';
import { AgentInfo, AgentInfoFragment } from './AgentInfo.model';
import AgentInfoEdit from './AgentInfo.edit';
import { Result } from '../../../../utils/result';
import { match as Match, withRouter } from 'react-router';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{ id: string }>;
}

interface Props extends Partial<Hoc> {}

/** 代理管理 */
@withLocale
@compose(withApollo, withRouter)
@autobind
export default class AgentInfoPage extends React.PureComponent<Props, {}> {
  state = {};
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new AgentInfoField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('form');
    return (
      <>
        <Query
          query={gql`
            query agentInfoQuery($id: Int!) {
              agentInfo(id: $id) @rest(type: "AgentInfoResult", path: "/agentInfo") {
                data {
                  ...AgentInfoFragment
                }
              }
            }
            ${AgentInfoFragment}
          `}
          variables={{ id: match.params.id }}
        >
          {({
            data: { agentInfo = { data: {} as AgentInfo } } = {}
          }: ChildProps<{}, { agentInfo: Result<AgentInfo> }, {}>) => (
            <AgentInfoEdit
              edit={{ visible: true, record: agentInfo.data }}
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
