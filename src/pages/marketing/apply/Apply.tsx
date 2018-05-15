import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { ApplyState, ApplyItem } from './Apply.model';
import { Form, Modal, Button, Icon } from 'antd';
import withLocale from '../../../utils/withLocale';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import request from '../../../utils/request';
import { stringify } from 'querystring';
import { moneyForResult, yuan } from '../../../utils/money';
import { defaults } from 'lodash/fp';
import ApplyField from './Apply.field';
import { SearchComponent } from '../../components/form/SearchComponent';
import { FetchResult, Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import { GqlResult, Result } from '../../../utils/result';

interface Props {
  dispatch: Dispatch;
  apply: ApplyState;
  form?: WrappedFormUtils;
  site?: (p: string) => React.ReactNode;
}
/** 优惠申请 */
@withLocale
@Form.create()
@select('')
export default class Apply extends React.PureComponent<Props, {}> {
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
    pageSize: 10
  };

  componentDidMount() {
    this.loadTableData();
    // 取下拉
  }
  loadTableData = (page: number = this.state.page, pageSize: number = this.state.pageSize) => {
    return request(
      `/active/applys?${stringify({
        page: page,
        page_size: pageSize
      })}`
    )
      .then(
        moneyForResult<ApplyItem[]>({
          data: {
            $for: {
              coupon_money: yuan, // 分转元
              deposit_money: yuan,
              withdraw_require: yuan
            }
          }
        })
      )
      .then(payload => this.props.dispatch({ type: 'apply/update', payload }));
  }
  onChange = (page: number, pageSize: number) => {
    this.setState({
      page,
      pageSize
    });
    this.loadTableData(page, pageSize);
  }
  writeMemo = (record: ApplyItem) => {
    this.setState({
      editVisible: true,
      editing: {
        id: record.id,
        content: record.memo
      }
    });
  }
  doPass = (record: ApplyItem) => {
    request(`/active/apply/status`, {
      method: 'put',
      body: JSON.stringify({
        id: record.id,
        memo: record.memo,
        status: 'pass',
        user_id: record.user_id,
        user_name: record.user_name
      })
    })
      .then(res => showMessageForResult(res, '已通过'))
      .then(() => {
        this.loadTableData();
      });
  }
  doReject = (record: ApplyItem) => {
    request(`/active/apply/status`, {
      method: 'put',
      body: JSON.stringify({
        id: record.id,
        memo: record.memo,
        status: 'rejected',
        user_id: record.user_id,
        user_name: record.user_name
      })
    })
      .then(res => showMessageForResult(res, '已拒绝'))
      .then(() => {
        this.loadTableData();
      });
  }
  getDetail = (record: ApplyItem) => {
    this.setState({
      detailModalVisible: true,
      isDetailLoading: true
    });
    request(`/active/apply/${record.id}`).then(result => {
      if (result.state === 0) {
        this.setState({
          detailData: result.data,
          isDetailLoading: false
        });
      }
    });
  }
  handleDetailModalCancel = () => {
    this.setState({
      detailModalVisible: false
    });
  }
  onEdit = () => {
    this.setState({
      editVisible: false
    });
  }
  // tslint:disable-next-line:no-any
  onDiscountSubmit = (values: { pre_coupon_money: string; coupon_money: string; id: string }) => {
    delete values.pre_coupon_money;
    values.coupon_money = (Number(values.coupon_money) * 100).toString();
    this.setState({
      editDiscountVisible: false
    });
    return request(`/active.discount/${this.state.rowData.id}`, {
      method: 'PATCH',
      body: JSON.stringify(values)
    })
      .then(res => showMessageForResult(res, '编辑成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  editDiscount = (record: ApplyItem) => {
    this.setState({
      editDiscountVisible: true,
      rowData: { ...record }
    });
    console.log('☞☞☞ 9527 Apply 163', 'editDiscount', record);
  }
  discountCancel = () => {
    this.setState({
      editDiscountVisible: false
    });
  }
  // tslint:disable-next-line:no-any
  onWithdrawSubmit = (values: any) => {
    delete values.pre_withdraw_require;
    values.withdraw_require = values.withdraw_require * 100;
    this.setState({
      editWithdrawVisible: false
    });
    return request(`/active.withdraw.require/${this.state.rowData.id}`, {
      method: 'PATCH',
      body: JSON.stringify(values)
    })
      .then(res => showMessageForResult(res, '修改成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  editWithdraw = (record: ApplyItem) => {
    this.setState({
      editWithdrawVisible: true,
      rowData: record
    });
  }
  withdrawCancel = () => {
    this.setState({
      editWithdrawVisible: false
    });
  }
  cancel = () => {
    this.setState({
      editVisible: false,
      editing: {
        content: ''
      }
    });
  }
  onEditSubmit = (values: ApplyItem) => {
    this.setState({
      editVisible: false
    });
    return request(`/active/apply.comment/${values.id}`, {
      method: 'PUT',
      body: JSON.stringify(values)
    })
      .then(res => showMessageForResult(res, '编辑成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  render(): React.ReactElement<HTMLElement> {
    const { site = () => null, form, apply: applyOk } = this.props;
    const apply2 = defaults(
      {
        data: [] as ApplyItem[],
        isDetailLoading: true
      } as ApplyState,
      applyOk
    );
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
          onSubmit={values => this.loadTableData(1, 20)}
        />
        <Query
          query={gql`
            query applyQuery($page: Int, $page_size: Int) {
              apply(page: $page, page_size: $page_size)
                @rest(
                  type: "ApplyResult"
                  path: "/active/applys"
                  params: { page: $page, page_size: $page_size }
                ) {
                data {
                  active_id
                  active_name
                  active_title
                  agent_id
                  apply_time
                  content
                  coupon_money
                  deposit_money
                  email
                  id
                  ip
                  issue_mode
                  level
                  memo
                  mobile
                  process_time
                  state
                  status
                  type_id
                  type_name
                  user_id
                  user_name
                  withdraw_require
                }
              }
            }
          `}
          variables={{
            page: 1,
            page_size: 20
          }}
        >
          {({ data: { apply = { data: [], attributes: {} } } }) => (
            <TableComponent
              dataSource={apply.data}
              columns={tableFields}
              form={form}
              pagination={getPagination(apply.attributes, this.onChange)}
            />
          )}
        </Query>
        <Modal
          visible={this.state.detailModalVisible}
          title="Title"
          onCancel={this.handleDetailModalCancel}
          footer={[
            <Button key="back" onClick={this.handleDetailModalCancel}>
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
          {(memo, { data }) => (
            <EditFormComponent
              form={this.props.form}
              fieldConfig={editFields}
              modalTitle={site('编辑')}
              modalOk={site('修改备注成功')}
              modalVisible={editVisible}
              onCancel={() => this.cancel()}
              onSubmit={(values: ApplyItem) => {
                return memo({ variables: { body: values, id: values.id } }).then(
                  (v: GqlResult<'memo'>) => v.data.memo
                );
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
          {(coupon, { data }) => {
            // console.log('☞☞☞ 9527 Apply 374', this.state);
            return (
              <EditFormComponent
                form={form}
                fieldConfig={couponFields}
                modalTitle={site('修改优惠金额')}
                modalOk={site('修改优惠金额成功')}
                modalVisible={editDiscountVisible}
                onCancel={() => this.discountCancel()}
                onSubmit={(values: ApplyItem) => {
                  return coupon({ variables: { body: values, id: values.id } }).then(
                    (v: GqlResult<'coupon'>) => v.data.coupon
                  );
                }}
                values={this.state.rowData}
                view={this}
              />
            );
          }}
        </Mutation>

        {/* 修改取款条件 */}
        <EditFormComponent
          form={form}
          fieldConfig={withdrawFields}
          modalTitle={site('修改取款条件')}
          modalVisible={editWithdrawVisible}
          onCancel={() => this.withdrawCancel()}
          onSubmit={this.onWithdrawSubmit}
          record={this.state.rowData}
          view={this}
        />
      </>
    );
  }
}
