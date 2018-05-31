import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../../zongzi/pc/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../../zongzi/pc/form/SearchUI';
import ButtonBar from '../../../zongzi/pc/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import MemberManageField from './MemberManage.field';
import { MemberManageFragment, MemberManage } from './MemberManage.model';
import MemberManageEdit from './MemberManage.edit';
import { Tabs } from 'antd';
import Back from '../../../zongzi/pc/button/Back';
import { match as Match, Route, Switch } from 'react-router';
import MemberAuditPage from './memberAudit/MemberAudit.page';
import AccountBalancePage from './accountBalance/AccountBalance.page';
import MemberInfoPage from './memberInfo/MemberInfo.page';
import BankCardPage from './bankCard/BankCard.page';
import MemberSettingPage from './memberSetting/MemberSetting.page';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
  match: Match<{}>;
}

interface Props extends Partial<Hoc> {}

/** 会员管理 */
@withLocale
@compose(withApollo)
@autobind
export default class MemberManagePage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as MemberManage
    },
    edit: {
      visible: false,
      record: {} as MemberManage
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client, match } = this.props as Hoc;
    const fields = new MemberManageField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
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
                  query memberManageQuery(
                    $username: String
                    $truename: String
                    $agent: String
                    $amount: String
                    $created: String
                    $ip: String
                    $channel: String
                    $tags: String
                    $online: String
                    $state: String
                    $page: Int
                    $page_size: Int
                    $pathBuilder: any
                  ) {
                    memberManage(
                      username: $username
                      truename: $truename
                      agent: $agent
                      amount: $amount
                      created: $created
                      ip: $ip
                      channel: $channel
                      tags: $tags
                      online: $online
                      state: $state
                      page: $page
                      page_size: $page_size
                    ) @rest(type: "MemberManageResult", pathBuilder: $pathBuilder) {
                      state
                      message
                      data {
                        ...MemberManageFragment
                      }
                    }
                  }
                  ${MemberManageFragment}
                `}
                variables={{
                  page: 1,
                  page_size: 20,
                  pathBuilder: pathBuilder('/memberManage')
                }}
              >
                {({
                  data: { memberManage = { data: [], attributes: {} } } = {},
                  loading,
                  refetch,
                  fetchMore
                }) => {
                  this.refetch = refetch;
                  return (
                    <TableUI
                      loading={loading}
                      dataSource={memberManage.data}
                      columns={tableFields}
                      pagination={graphPagination(memberManage.attributes, fetchMore)}
                    />
                  );
                }}
              </Query>
              <MemberManageEdit
                edit={this.state.create}
                editFields={editFields}
                onDone={() => {
                  this.setState({ create: { visible: false, record: {} } });
                }}
                modalTitle="创建"
                modalOk="创建成功"
                view={this}
              />
              <MemberManageEdit
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
                    <MemberInfoPage />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={site('账户余额')} key="2">
                    <AccountBalancePage />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={site('取款稽核信息')} key="3">
                    <MemberAuditPage />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={site('银行卡信息')} key="4">
                    <BankCardPage />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab={site('会员设置')} key="5">
                    <MemberSettingPage />
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
