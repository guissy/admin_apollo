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
import ActivityTypeField from './ActivityType.field';
import { ActivityTypeFragment, ActivityType } from './ActivityType.model';
import ActivityTypeEdit from './ActivityType.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** ActivityTypePage */
@withLocale
@compose(withApollo)
@autobind
export default class ActivityTypePage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as ActivityType
    },
    edit: {
      visible: false,
      record: {} as ActivityType
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new ActivityTypeField(this as React.PureComponent<Hoc>);
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
            query activityTypeQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              activityType(page: $page, page_size: $page_size)
                @rest(type: "ActivityTypeResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...ActivityTypeFragment
                }
              }
            }
            ${ActivityTypeFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/active/types')
          }}
        >
          {({
            data: { activityType = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={activityType.data}
                columns={tableFields}
                pagination={graphPagination(activityType.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <ActivityTypeEdit
          edit={this.state.create}
          editFields={editFields}
          onDone={() => {
            this.setState({ create: { visible: false, record: {} } });
          }}
          modalTitle="创建"
          modalOk="创建成功"
          method="post"
          view={this}
        />
        <ActivityTypeEdit
          edit={this.state.edit}
          editFields={editFields}
          onDone={() => {
            this.setState({ edit: { visible: false, record: {} } });
          }}
          modalTitle="编辑"
          modalOk="编辑成功"
          method="put"
          view={this}
        />
      </>
    );
  }
}
