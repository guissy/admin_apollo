import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import TableUI, { graphPagination } from '../../../components/table/TableUI';
import { autobind } from 'core-decorators';
import withLocale from '../../../../utils/withLocale';
import { pathBuilder } from '../../../../utils/apollo';
import MemberAuditField from './MemberAudit.field';
import { MemberAudit, MemberAuditFragment } from './MemberAudit.model';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 会员稽核信息 */
@withLocale
@compose(withApollo)
@autobind
export default class MemberAuditPage extends React.PureComponent<Props, {}> {
  state = {
    create: {
      visible: false,
      record: {} as MemberAudit
    },
    edit: {
      visible: false,
      record: {} as MemberAudit
    }
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new MemberAuditField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <>
        <Query
          query={gql`
            query memberAuditQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              memberAudit(page: $page, page_size: $page_size)
                @rest(type: "MemberAuditResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...MemberAuditFragment
                }
              }
            }
            ${MemberAuditFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/memberAudit')
          }}
        >
          {({
            data: { memberAudit = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={memberAudit.data}
                columns={tableFields}
                pagination={graphPagination(memberAudit.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </>
    );
  }
}
