import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../components/table/TableUI';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBar from '../../components/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import AnnounceManageField from './AnnounceManage.field';
import { AnnounceManageFragment, AnnounceManage } from './AnnounceManage.model';
import AnnounceManageEdit from './AnnounceManage.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 公告管理 */
@withLocale
@compose(withApollo)
@autobind
export default class AnnounceManagePage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as AnnounceManage
    },
    edit: {
      visible: false,
      record: {} as AnnounceManage
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new AnnounceManageField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    const searchFields = fields.filterBy('search');
    return (
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
            query announceManageQuery(
              $send_type: String
              $type: String
              $title: String
              $content: String
              $popup_type: String
              $start_time: String
              $end_time: String
              $recipient: String
              $admin_name: String
              $recipient_origin: String
              $status: String
              $language_id: String
              $page: Int
              $page_size: Int
              $pathBuilder: any
            ) {
              announceManage(
                send_type: $send_type
                type: $type
                title: $title
                content: $content
                popup_type: $popup_type
                start_time: $start_time
                end_time: $end_time
                recipient: $recipient
                admin_name: $admin_name
                recipient_origin: $recipient_origin
                status: $status
                language_id: $language_id
                page: $page
                page_size: $page_size
              ) @rest(type: "AnnounceManageResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...AnnounceManageFragment
                }
              }
            }
            ${AnnounceManageFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/announceManage')
          }}
        >
          {({
            data: { announceManage = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={announceManage.data}
                columns={tableFields}
                pagination={graphPagination(announceManage.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <AnnounceManageEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <AnnounceManageEdit
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
