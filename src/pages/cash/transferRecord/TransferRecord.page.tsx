import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../components/table/TableUI';
import { autobind } from 'core-decorators';
import ButtonBar from '../../components/button/ButtonBar';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import TransferRecordField from './TransferRecord.field';
import { TransferRecordFragment, TransferRecord } from './TransferRecord.model';
import TransferRecordEdit from './TransferRecord.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 转帐记录 */
@withLocale
@compose(withApollo)
@autobind
export default class TransferRecordPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as TransferRecord
    },
    edit: {
      visible: false,
      record: {} as TransferRecord
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new TransferRecordField(this as React.PureComponent<Hoc>);
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
            query transferRecordQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              transferRecord(page: $page, page_size: $page_size)
                @rest(type: "TransferRecordResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...TransferRecordFragment
                }
              }
            }
            ${TransferRecordFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/transferRecord')
          }}
        >
          {({
            data: { transferRecord = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={transferRecord.data}
                columns={tableFields}
                pagination={graphPagination(transferRecord.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <TransferRecordEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <TransferRecordEdit
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
