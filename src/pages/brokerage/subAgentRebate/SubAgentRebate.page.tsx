import * as React from 'react';
import styled from 'styled-components';
import { Modal } from 'antd';
import ApolloClient from 'apollo-client/ApolloClient';
import { ChildProps, compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../components/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBar from '../../components/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import SubAgentRebateField from './SubAgentRebate.field';
import {
  SubAgentRebateFragment,
  SubAgentRebate,
  SubAgentRebateDetail
} from './SubAgentRebate.model';
import SubAgentRebateEdit from './SubAgentRebate.edit';
import { Result } from '../../../utils/result';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string, o?: object) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 下级佣金统计 */
@withLocale
@compose(withApollo)
@autobind
export default class SubAgentRebatePage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as SubAgentRebate
    },
    edit: {
      visible: false,
      record: {} as SubAgentRebate
    },
    detail: {
      visible: false,
      record: {} as SubAgentRebate
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new SubAgentRebateField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    return (
      <>
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
            query subAgentRebateQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              subAgentRebate(page: $page, page_size: $page_size)
                @rest(type: "SubAgentRebateResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...SubAgentRebateFragment
                }
              }
            }
            ${SubAgentRebateFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/subAgentRebate')
          }}
        >
          {({
            data: { subAgentRebate = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={subAgentRebate.data}
                columns={tableFields}
                pagination={graphPagination(subAgentRebate.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <Modal
          title={site(`代理账号:【{account}】下的【{level}】级退佣详情`, this.state.detail.record)}
          visible={this.state.detail.visible}
          onOk={() => this.setState({ detail: { visible: false } })}
          onCancel={() => this.setState({ detail: { visible: false } })}
        >
          <Query
            query={gql`
              query {
                subAgentRebateDetail
                  @rest(type: "SubAgentRebateDetailResult", path: "/subAgentRebateDetail") {
                  data {
                    id
                    username
                    bkge_amount
                    rate
                    commission
                  }
                }
              }
            `}
          >
            {({
              data: { subAgentRebateDetail = { data: [] }, loading = false } = {}
            }: ChildProps<{}, { subAgentRebateDetail: Result<SubAgentRebateDetail[]> }, {}>) => (
              <TableUI
                columns={[
                  {
                    title: site('下级代理账号'),
                    dataIndex: 'username'
                  },
                  {
                    title: site('下级代理当期佣金'),
                    dataIndex: 'bkge_amount'
                  },
                  {
                    title: site('退佣比例(%)'),
                    dataIndex: 'rate'
                  },
                  {
                    title: site('退佣'),
                    dataIndex: 'commission'
                  }
                ]}
                dataSource={subAgentRebateDetail.data}
                loading={loading}
              />
            )}
          </Query>
        </Modal>
        <SubAgentRebateEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <SubAgentRebateEdit
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
    );
  }
}
