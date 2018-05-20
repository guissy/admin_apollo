import * as React from 'react';
import { autobind } from 'core-decorators';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { ActivityApplyItem, ActivityApplyItemFragment } from './ActivityApply.model';
import { Modal, Button } from 'antd';
import withLocale from '../../../utils/withLocale';
import { EditFormUI } from '../../components/form/EditFormUI';
import TableComponent, {
  getPagination,
  graphPagination
} from '../../components/table/TableComponent';
import ActivityApplyField from './ActivityApply.field';
import { SearchUI } from '../../components/form/SearchUI';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import ActivityApplyEdit from './ActivityApply.edit';

interface Hoc {
  client: ApolloClient<object>;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 优惠申请 */
@withLocale
@compose(withApollo)
@autobind
export default class ActivityApplyPage extends React.PureComponent<Props, {}> {
  refetch: Function;
  state = {
    detail: {
      visible: false,
      record: {} as ActivityApplyItem
    },
    memo: {
      visible: false,
      record: {} as ActivityApplyItem
    },
    coupon: {
      visible: false,
      record: {} as ActivityApplyItem
    },
    withdraw: {
      visible: false,
      record: {} as ActivityApplyItem
    },
    searchValues: {}
  };

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new ActivityApplyField(this as React.PureComponent<Hoc>);
    const editFields = fields.filterBy('edit');
    const couponFields = fields.filterBy('coupon');
    const withdrawFields = fields.filterBy('withdraw');
    const searchFields = fields.filterBy('search');
    const detailFields = fields.detail(this.state.detail.record);
    const tableFields = fields.table(this);
    const setState = this.setState.bind(this);
    return (
      <>
        <SearchUI
          fieldConfig={searchFields}
          pageSize={20}
          onSubmit={(values: { apply_time: string[]; pathBuilder: (o: object) => string }) => {
            let [apply_time_from, apply_time_to] = values.apply_time;
            delete values.apply_time;
            const searchValues = {
              ...values,
              apply_time_from,
              apply_time_to,
              page: 1,
              page_size: 20
            };
            this.setState({ searchValues });
            return this.refetch(searchValues);
          }}
        />
        <Query
          query={
            // tslint:disable
            gql`
              query applyQuery(
                $page: Int
                $page_size: Int
                $user_name: String = ""
                $level: Int = ""
                $active_title: String = ""
                $apply_time_from: String = ""
                $apply_time_to: String = ""
                $pathBuilder: any
              ) {
                apply(
                  page: $page
                  page_size: $page_size
                  user_name: $user_name
                  level: $level
                  active_title: $active_title
                  apply_time_from: $apply_time_from
                  apply_time_to: $apply_time_to
                ) @rest(type: "ActivityApplyResult", pathBuilder: $pathBuilder) {
                  state
                  message
                  data {
                    ...ActivityApplyItemFragment
                  }
                }
              }
              ${ActivityApplyItemFragment}
            ` // tslint:enable
          }
          variables={{
            user_name: '',
            level: '',
            active_title: '',
            apply_time_from: '',
            apply_time_to: '',
            page: 1,
            page_size: 20,
            pathBuilder: pathBuilder('/active/applys')
          }}
        >
          {({ data: { apply = { data: [], attributes: {} } }, loading, refetch, fetchMore }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={apply.data}
                columns={tableFields}
                pagination={graphPagination(apply.attributes, fetchMore)}
              />
            );
          }}
        </Query>
        <Modal
          visible={this.state.detail.visible}
          title={site('详情')}
          onCancel={() => {
            this.setState({
              detail: { visible: false }
            });
          }}
          footer={
            <Button
              onClick={() => {
                this.setState({ detail: { visible: false } });
              }}
            >
              关闭
            </Button>
          }
        >
          <div>{detailFields}</div>
        </Modal>
        {/* 编辑 */}
        <Mutation
          mutation={gql`
            mutation memoMutation($body: MemoInput!, $id: Int!) {
              memo(body: $body, id: $id)
                @rest(
                  bodyKey: "body"
                  path: "/active/apply.comment/:id"
                  method: "put"
                  type: "MemoResult"
                ) {
                state
                message
              }
            }
          `}
        >
          {memo => (
            <EditFormUI
              fieldConfig={editFields}
              modalTitle={site('编辑')}
              modalOk={site('修改备注成功')}
              modalVisible={this.state.memo.visible}
              onCancel={() => {
                this.setState({
                  memo: { visible: false, record: {} }
                });
              }}
              onSubmit={(values: ActivityApplyItem) => {
                return memo({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'memo'>) => {
                    writeFragment(client, 'ActivityApplyItem', values);
                    this.setState({
                      memo: { visible: false, record: {} }
                    });
                    return v.data && v.data.memo;
                  }
                );
              }}
              values={this.state.memo.record}
            />
          )}
        </Mutation>
        <ActivityApplyEdit
          withdraw={this.state.withdraw}
          withdrawFields={withdrawFields}
          coupon={this.state.coupon}
          couponFields={couponFields}
          setState={setState}
        />
      </>
    );
  }
}
