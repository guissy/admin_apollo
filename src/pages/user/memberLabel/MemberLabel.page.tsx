import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableComponent, { graphPagination } from '../../components/table/TableComponent';
import { autobind } from 'core-decorators';
import { SearchUI } from '../../components/form/SearchUI';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import MemberLabelField from './MemberLabel.field';
import { MemberLabelFragment, MemberLabel } from './MemberLabel.model';
import MemberLabelEdit from './MemberLabel.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 会员标签 */
@withLocale
@compose(withApollo)
@autobind
export default class MemberLabelPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as MemberLabel
    },
    edit: {
      visible: false,
      record: {} as MemberLabel
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new MemberLabelField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    const editFields = fields.filterBy('form');
    return (
      <>
        {/* 新增按钮 */}
        <ButtonBarComponent
          onCreate={() => {
            this.setState({
              create: { visible: true, record: {} }
            });
          }}
        />
        <Query
          query={gql`
            query memberLabelQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              memberLabel(page: $page, page_size: $page_size)
                @rest(type: "MemberLabelResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...MemberLabelFragment
                }
              }
            }
            ${MemberLabelFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/memberLabel')
          }}
        >
          {({
            data: { memberLabel = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={memberLabel.data}
                columns={tableFields}
                pagination={graphPagination(memberLabel.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <MemberLabelEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          view={this}
        />
        <MemberLabelEdit
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
