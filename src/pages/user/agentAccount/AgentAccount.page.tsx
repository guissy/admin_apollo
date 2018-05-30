import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Tabs } from 'antd';
import TableUI, { graphPagination } from '../../components/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBar from '../../components/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import AgentAccountField from './AgentAccount.field';
import { AgentAccountFragment, AgentAccount } from './AgentAccount.model';
import AgentAccountEdit from './AgentAccount.edit';
import { Button, Modal } from 'antd';
import { match as Match, Route, Switch } from 'react-router';
import { push } from 'react-router-redux';
import Back from '../../components/button/Back';
import AgentInfoPage from './agentInfo/AgentInfo.page';
import PromotionPage from './promotion/Promotion.page';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{}>;
}

interface Props extends Partial<Hoc> {}

/** 代理管理 */
@withLocale
@compose(withApollo)
@autobind
export default class AgentAccountPage extends React.PureComponent<Props, {}> {
  state = {
    detail: {
      visible: false,
      record: {} as AgentAccount
    },
    create: {
      visible: false,
      record: {} as AgentAccount
    },
    edit: {
      visible: false,
      record: {} as AgentAccount
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new AgentAccountField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const detailFields = fields.detail(this.state.detail.record);
    const searchFields = fields.filterBy('search');
    return (
      <Switch>
        <Route
          path={match.path}
          exact={true}
          render={() => (
            <>
              <SearchUI
                fieldConfig={searchFields}
                onSubmit={(values: { pathBuilder: (o: object) => string }) => {
                  const searchValues = {
                    ...values,
                    page: 1,
                    page_size: 20
                  };
                  this.setState({ searchValues });
                  return this.refetch(searchValues);
                }}
              />
              {/* 新增按钮 */}
              <ButtonBar
                onCreate={() => {
                  this.setState({
                    create: { visible: true, record: {} }
                  });
                }}
              />
              <Query
                query={gql`
                  query agentAccountQuery(
                    $similar: String
                    $name: String
                    $truename: String
                    $type: String
                    $pname: String
                    $level: String
                    $inferisors_num: String
                    $play_num: String
                    $balance: String
                    $code: String
                    $register_from: String
                    $register_to: String
                    $created: String
                    $channel: String
                    $online: String
                    $status: String
                    $page: Int
                    $page_size: Int
                    $pathBuilder: any
                  ) {
                    agentAccount(
                      similar: $similar
                      name: $name
                      truename: $truename
                      type: $type
                      pname: $pname
                      level: $level
                      inferisors_num: $inferisors_num
                      play_num: $play_num
                      balance: $balance
                      code: $code
                      register_from: $register_from
                      register_to: $register_to
                      created: $created
                      channel: $channel
                      online: $online
                      status: $status
                      page: $page
                      page_size: $page_size
                    ) @rest(type: "AgentAccountResult", pathBuilder: $pathBuilder) {
                      state
                      message
                      data {
                        ...AgentAccountFragment
                      }
                    }
                  }
                  ${AgentAccountFragment}
                `}
                variables={{
                  page: 1,
                  page_size: 20,
                  pathBuilder: pathBuilder('/agentAccount')
                }}
              >
                {({
                  data: { agentAccount = { data: [], attributes: {} } } = {},
                  loading,
                  refetch,
                  fetchMore
                }) => {
                  this.refetch = refetch;
                  return (
                    <TableUI
                      loading={loading}
                      dataSource={agentAccount.data}
                      columns={tableFields}
                      pagination={graphPagination(agentAccount.attributes, fetchMore)}
                    />
                  );
                }}
              </Query>
              <AgentAccountEdit
                edit={this.state.create}
                editFields={editFields}
                onDone={() => {
                  this.setState({ create: { visible: false, record: {} } });
                }}
                modalTitle="创建"
                modalOk="创建成功"
                view={this}
              />
              <AgentAccountEdit
                edit={this.state.edit}
                editFields={editFields}
                onDone={() => {
                  this.setState({ edit: { visible: false, record: {} } });
                }}
                modalTitle="编辑"
                modalOk="编辑成功"
                view={this}
              />
            </>
          )}
        />
        <Route
          path={match.path + '/:id'}
          render={() => (
            <>
              <div>
                <Back />
              </div>
              <div className="card-container">
                <Tabs type="card">
                  <Tabs.TabPane tab={site('基本资料')} key="1">
                    <AgentInfoPage />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={site('推广信息')} key="2">
                    <PromotionPage />
                  </Tabs.TabPane>
                </Tabs>
              </div>
            </>
          )}
        />
      </Switch>
    );
  }
}
