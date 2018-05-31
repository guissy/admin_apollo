import * as React from 'react';
import styled from 'styled-components';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'antd';
import TableUI, { graphPagination } from '../../../zongzi/pc/table/TableUI';
import { autobind } from 'core-decorators';
import withLocale from '../../../utils/withLocale';
import { GqlResult, pathBuilder } from '../../../utils/apollo';
import DiscountDetailField from './DiscountDetail.field';
import { DiscountDetail, DiscountDetailFragment } from './DiscountDetail.model';
import { messageResult } from '../../../utils/showMessage';
import Back from '../../../zongzi/pc/button/Back';

const Div = styled.div`
  strong {
    display: inline-block;
    margin-left: 10px;
    margin-right: 10px;
  }
  .selected {
    display: inline-block;
    margin-right: 10px;
  }
`;

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string, o?: object) => React.ReactNode;
}

interface Props extends Partial<Hoc> {
  detail: { id: number; name: string };
}

/** 返水详情 */
@withLocale
@compose(withApollo)
@autobind
export default class DiscountDetailPage extends React.PureComponent<Props, {}> {
  state = {
    selectedRowKeys: []
  };
  refetch: Function;

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new DiscountDetailField(this as React.PureComponent<Hoc>);
    const tableFields = fields.table(this);
    return (
      <Div>
        <Back />
        <span>
          <strong>{this.props.detail.name}</strong>
          {site('返水详情')}
        </span>
        <Mutation
          mutation={gql`
            mutation statusMutation($id: Int!, $body: StatusInput!) {
              status(id: $id, body: $body)
                @rest(
                  bodyKey: "body"
                  path: "/discountDetail/status/:id"
                  method: "post"
                  type: "StateResult"
                ) {
                state
                message
              }
            }
          `}
        >
          {(status, { data }) => (
            <>
              {this.state.selectedRowKeys.length > 0 && (
                <p>
                  <span className="selected">
                    {site('本页您选择了{total}条数据', {
                      total: this.state.selectedRowKeys.length
                    })}
                  </span>
                  <Button
                    size="small"
                    onClick={() => {
                      status({ variables: { body: { status: 1 }, id: this.props.detail.id } })
                        .then(messageResult('status'))
                        .then((v: GqlResult<'status'>) => {
                          this.refetch();
                          return v;
                        });
                    }}
                  >
                    {site('冲销')}
                  </Button>
                </p>
              )}
            </>
          )}
        </Mutation>

        <Query
          query={gql`
            query discountDetailQuery($page: Int, $page_size: Int, $pathBuilder: any) {
              discountDetail(page: $page, page_size: $page_size)
                @rest(type: "DiscountDetailResult", pathBuilder: $pathBuilder) {
                state
                message
                data {
                  ...DiscountDetailFragment
                }
              }
            }
            ${DiscountDetailFragment}
          `}
          variables={{
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/discountDetail')
          }}
        >
          {({
            data: { discountDetail = { data: [], attributes: {} } } = {},
            loading,
            refetch,
            fetchMore
          }) => {
            this.refetch = refetch;
            return (
              <TableUI
                loading={loading}
                dataSource={discountDetail.data}
                columns={tableFields}
                rowSelection={{
                  onChange: (selectedRowKeys: string[]) => {
                    this.setState({ selectedRowKeys });
                  },
                  getCheckboxProps: (record: DiscountDetail) => ({
                    disabled: record.status === 1
                    // name: record.name
                  })
                }}
                rowKey={(record: DiscountDetail) => record.id}
                pagination={graphPagination(discountDetail.attributes, fetchMore)}
              />
            );
          }}
        </Query>
      </Div>
    );
  }
}
