import * as React from 'react';
import { autobind } from 'core-decorators';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { ApplyItem, ApplyItemFragment } from './Apply.model';
import { Modal, Button, Icon } from 'antd';
import withLocale from '../../../utils/withLocale';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import ApplyField from './Apply.field';
import { SearchComponent } from '../../components/form/SearchComponent';
import { GqlResult, pathBuilder, writeFragment } from '../../../utils/apollo';
import ApplyEdit from './Apply.edit';
import { PureComponent } from 'react';

interface Hoc {
  client: ApolloClient<object>;
  form: WrappedFormUtils;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 优惠申请 */
@withLocale
@compose(withApollo)
@autobind
export default class Apply extends React.PureComponent<Props, {}> {
  refetch: Function;
  state = {
    detail: {
      visible: false,
      record: {} as ApplyItem
    },
    memo: {
      visible: false,
      record: {} as ApplyItem
    },
    coupon: {
      visible: false,
      record: {} as ApplyItem
    },
    withdraw: {
      visible: false,
      record: {} as ApplyItem
    },
    page: 1,
    pageSize: 10,
    searchValues: {}
  };

  onChange(page: number, pageSize: number) {
    // todo: 翻页
  }

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', client } = this.props as Hoc;
    const fields = new ApplyField(this as PureComponent<Hoc>);
    const editFields = fields.filterBy('edit');
    const couponFields = fields.filterBy('coupon');
    const withdrawFields = fields.filterBy('withdraw');
    const searchFields = fields.filterBy('search');
    const tableFields = fields.table(this);
    const setState = this.setState.bind(this);
    return (
      <>
        <SearchComponent
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
                ) @rest(type: "ApplyResult", pathBuilder: $pathBuilder) {
                  state
                  message
                  data {
                    ...ApplyItemFragment
                  }
                }
              }
              ${ApplyItemFragment}
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
          {({ data: { apply = { data: [], attributes: {} } }, loading, refetch }) => {
            this.refetch = refetch;
            return (
              <TableComponent
                loading={loading}
                dataSource={apply.data}
                columns={tableFields}
                pagination={getPagination(apply.attributes, this.onChange)}
              />
            );
          }}
        </Query>
        <Modal
          visible={this.state.detail.visible}
          title={site('详情')}
          onCancel={() => {
            this.setState({
              detail: { visible: false, record: {} }
            });
          }}
          footer={
            <Button
              onClick={() => {
                this.setState({ detail: { visible: false, record: {} } });
              }}
            >
              关闭
            </Button>
          }
        >
          <div>
            <p>用户名称：{this.state.detail.record.user_name}</p>
            <p>联系电话：{this.state.detail.record.mobile}</p>
            <p>邮箱：{this.state.detail.record.email}</p>
            <p>申请活动： {this.state.detail.record.active_name}</p>
            <p>活动内容：{this.state.detail.record.content}</p>
            <p>备注：{this.state.detail.record.memo}</p>
          </div>
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
            <EditFormComponent
              fieldConfig={editFields}
              modalTitle={site('编辑')}
              modalOk={site('修改备注成功')}
              modalVisible={this.state.memo.visible}
              onCancel={() => {
                this.setState({
                  memo: { visible: false, record: {} }
                });
              }}
              onSubmit={(values: ApplyItem) => {
                return memo({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'memo'>) => {
                    writeFragment(client, 'ApplyItem', values);
                    this.setState({
                      memo: { visible: false, record: {} }
                    });
                    return v.data.memo;
                  }
                );
              }}
              values={this.state.memo.record}
            />
          )}
        </Mutation>
        <ApplyEdit
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
