import * as React from 'react';
import { autobind } from 'core-decorators';
import ApolloClient from 'apollo-client/ApolloClient';
import { compose, Mutation, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { ApplyItem, ApplyItemFragment } from './Apply.model';
import { Form, Modal, Button, Icon } from 'antd';
import withLocale from '../../../utils/withLocale';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import ApplyField from './Apply.field';
import { SearchComponent } from '../../components/form/SearchComponent';
import { GqlResult } from '../../../utils/result';
import { stringify } from 'querystring';
import { pathBuilder } from '../../../utils/apollo';

interface Hoc {
  client: ApolloClient<object>;
  form: WrappedFormUtils;
  site: (p: string) => React.ReactNode;
}

interface Props extends Partial<Hoc> {}

/** 优惠申请 */
@withLocale
@Form.create()
@compose(withApollo)
@autobind
export default class Apply extends React.PureComponent<Props, {}> {
  refetch: Function;
  state = {
    newVisible: false,
    editVisible: false,
    editDiscountVisible: false,
    editing: {},
    detailModalVisible: false,
    isDetailLoading: false,
    editWithdrawVisible: false,
    detailData: {} as ApplyItem,
    rowData: {},
    page: 1,
    pageSize: 10,
    searchValues: {}
  };

  onChange(page: number, pageSize: number) {
    // todo: 翻页
  }

  onShowDetail(record: ApplyItem) {
    this.setState({
      detailModalVisible: true,
      detailData: record
    });
  }
  onShowDetailClose() {
    this.setState({
      detailModalVisible: false
    });
  }

  onEditMemo(record: ApplyItem) {
    this.setState({
      editVisible: true,
      editing: record
    });
  }
  onEditMemoClose() {
    this.setState({
      editVisible: false,
      editing: {}
    });
  }

  onEditDiscount(record: ApplyItem) {
    this.setState({
      editDiscountVisible: true,
      rowData: record
    });
  }
  onEditDiscountClose() {
    this.setState({
      editDiscountVisible: false
    });
  }

  onEditWithdraw(record: ApplyItem) {
    this.setState({
      editWithdrawVisible: true,
      rowData: record
    });
  }
  onEditWithdrawClose() {
    this.setState({
      editWithdrawVisible: false
    });
  }

  render(): React.ReactElement<HTMLElement> {
    const { site = () => '', form, client } = this.props as Hoc;
    const { editDiscountVisible, editVisible, editWithdrawVisible } = this.state;
    const fields = new ApplyField();
    const editFields = fields.filterBy('edit');
    const couponFields = fields.filterBy('coupon');
    const withdrawFields = fields.filterBy('withdraw');
    const searchFields = fields.filterBy('search');
    const tableFields = fields.table(this);
    return (
      <>
        <SearchComponent
          form={form}
          fieldConfig={searchFields}
          pageSize={20}
          onSubmit={(values: { apply_time: string[]; pathBuilder: (o: object) => string }) => {
            let [apply_time_from, apply_time_to] = values.apply_time;
            delete values.apply_time;
            values.pathBuilder = pathBuilder('/active/applys');
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
                form={form}
                pagination={getPagination(apply.attributes, this.onChange)}
              />
            );
          }}
        </Query>
        <Modal
          visible={this.state.detailModalVisible}
          title="Title"
          onCancel={this.onShowDetailClose}
          footer={[
            <Button key="back" onClick={this.onShowDetailClose}>
              关闭
            </Button>
          ]}
        >
          {this.state.isDetailLoading ? (
            <div>
              <Icon type="loading" style={{ fontSize: 16, color: '#08c', textAlign: 'center' }} />
            </div>
          ) : (
            <div>
              <p>用户名称：{this.state.detailData.user_name}</p>
              <p>联系电话：{this.state.detailData.mobile}</p>
              <p>邮箱：{this.state.detailData.email}</p>
              <p>申请活动： {this.state.detailData.active_name}</p>
              <p>活动内容：{this.state.detailData.content}</p>
              <p>备注：{this.state.detailData.memo}</p>
            </div>
          )}
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
              form={this.props.form}
              fieldConfig={editFields}
              modalTitle={site('编辑')}
              modalOk={site('修改备注成功')}
              modalVisible={editVisible}
              onCancel={() => this.onEditMemoClose()}
              onSubmit={(values: ApplyItem) => {
                return memo({ variables: { body: values, id: values.id } })
                  .then((v: GqlResult<'memo'>) => v.data.memo)
                  .then(v => {
                    client.writeFragment({
                      id: `ApplyItem:${values.id}`,
                      fragment: ApplyItemFragment,
                      data: {
                        ...this.state.editing,
                        ...values
                      }
                    });
                    return v;
                  });
              }}
              values={this.state.editing}
            />
          )}
        </Mutation>
        {/* 修改优惠金额 */}
        <Mutation
          mutation={gql`
            mutation couponMutation($body: CouponInput!, $id: Int!) {
              coupon(body: $body, id: $id)
                @rest(
                  bodyKey: "body"
                  path: "/active.discount/:id"
                  method: "PATCH"
                  type: "CouponResult"
                ) {
                state
                message
              }
            }
          `}
        >
          {coupon => (
            <EditFormComponent
              form={form}
              fieldConfig={couponFields}
              modalTitle={site('修改优惠金额')}
              modalOk={site('修改优惠金额成功')}
              modalVisible={editDiscountVisible}
              onCancel={() => this.onEditDiscountClose()}
              onSubmit={(values: ApplyItem) => {
                return coupon({ variables: { body: values, id: values.id } })
                  .then((v: GqlResult<'coupon'>) => v.data.coupon)
                  .then(v => {
                    client.writeFragment({
                      id: `ApplyItem:${values.id}`,
                      fragment: ApplyItemFragment,
                      data: {
                        ...this.state.rowData,
                        ...values
                      }
                    });
                    return v;
                  });
              }}
              values={this.state.rowData}
              view={this}
            />
          )}
        </Mutation>
        {/* 修改取款条件 */}
        <Mutation
          mutation={gql`
            mutation withdrawMutation($body: WithdrawInput!, $id: Int!) {
              withdraw(body: $body, id: $id)
                @rest(
                  bodyKey: "body"
                  path: "/active.withdraw/:id"
                  method: "PATCH"
                  type: "WithdrawResult"
                ) {
                state
                message
              }
            }
          `}
        >
          {withdraw => (
            <EditFormComponent
              form={form}
              fieldConfig={withdrawFields}
              modalTitle={site('修改取款条件')}
              modalVisible={editWithdrawVisible}
              onCancel={() => this.onEditWithdrawClose()}
              onSubmit={(values: ApplyItem) => {
                return withdraw({ variables: { body: values, id: values.id } })
                  .then((v: GqlResult<'withdraw'>) => v.data.withdraw)
                  .then(v => {
                    client.writeFragment({
                      id: `ApplyItem:${values.id}`,
                      fragment: ApplyItemFragment,
                      data: {
                        ...this.state.rowData,
                        ...values
                      }
                    });
                    return v;
                  });
              }}
              values={this.state.rowData}
              view={this}
            />
          )}
        </Mutation>
      </>
    );
  }
}
