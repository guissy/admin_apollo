import * as React from 'react';
import { Input, Tag, Select } from 'antd';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import ActivityApplyPage from './ActivityApply.page';
import { ActivityApply } from './ActivityApply.model';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import QuickDateComponent from '../../components/date/QuickDateComponent';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import Label from '../../components/label/Label';
import ApolloClient from 'apollo-client/ApolloClient';

const site = withLocale.site;

interface ActivityItem {
  id: number;
  name: string;
  title: string;

  [other: string]: string | number;
}

interface ActivityResult {
  data: ActivityItem[];
}

interface Activity {
  actives: ActivityResult;
}

type ActivityApplyConfig = { [key in keyof ActivityApply]: ActivityApplyConfigValue };
type ActivityApplyConfigValue = {
  edit?: React.ReactNode;
  title?: React.ReactNode;
  search?: React.ReactNode;
  coupon?: React.ReactNode;
  withdraw?: React.ReactNode;
  detail?: React.ReactNode;
  table?: React.ReactNode;
};

/** 优惠字段 */
export default class ActivityApplyField<T> extends TableFormField<T>
  implements ActivityApplyConfig {
  id = {
    edit: <input type="hidden" />,
    coupon: <input type="hidden" />,
    withdraw: <input type="hidden" />,
    table: notInTable
  };

  user_name = {
    title: site('用户名'),
    search: <Input />,
    detail: <Label />
  };

  level = {
    title: site('会员等级'),
    search: <Input />
  };

  active_name = {
    title: site('优惠活动名称')
  };

  active_title = {
    title: site('优惠活动标题')
  };

  active_id = {
    title: site('优惠活动'),
    search: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, ActivityApply, ActivityApplyPage>) => (
      <Query
        query={gql`
          query {
            actives @rest(type: "ActivityResult", path: "/actives?type=all") {
              data {
                id
                title
                name
              }
            }
          }
        `}
      >
        {({ data: { actives = { data: [] } } = {} }: ChildProps<{}, Activity, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {actives.data.map((active: { title: string; id: number }, i: number) => (
              <Select.Option key={i} value={String(active.id)}>
                {active.title}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: notInTable
  };

  deposit_money = {
    title: site('存款')
  };

  pre_coupon_money = {
    title: site('原优惠金额'),
    // 修改优惠金额
    coupon: ({ text, record }: FieldProps<string, ActivityApply, ActivityApplyPage>) => {
      return <span>{record.coupon_money}</span>;
    },
    table: notInTable
  };

  coupon_money = {
    title: site('优惠金额'),
    // 修改优惠金额
    coupon: <Input />,
    rules: [
      { required: true, message: '请输入优惠金额' },
      { pattern: moneyPattern(), message: '请输入小数点后小于两位的正数' }
    ],
    table: ({ text, record, view }: FieldProps<string, ActivityApply, ActivityApplyPage>) => {
      return record.isTotalRow ? (
        text
      ) : (
        <span
          onClick={() => {
            this.setState({
              coupon: { visible: true, record }
            });
          }}
        >
          <Tag color="blue">{text}</Tag>
        </span>
      );
    }
  };

  pre_withdraw_require = {
    title: site('原取款条件'),
    // 修改取款条件
    withdraw: ({ text, record }: FieldProps<string, ActivityApply, ActivityApplyPage>) => (
      <span>{record.withdraw_require}</span>
    ),
    table: notInTable
  };

  withdraw_require = {
    title: site('取款条件'),
    withdraw: <Input />,
    rules: [
      { required: true, message: '请输入优惠金额' },
      { pattern: moneyPattern(), message: '请输入小数点后小于两位的正数' }
    ],
    table: ({ text, record, view }: FieldProps<string, ActivityApply, ActivityApplyPage>) => {
      return record.isTotalRow ? (
        text
      ) : (
        <span
          onClick={() => {
            this.setState({
              withdraw: { visible: true, record }
            });
          }}
        >
          <Tag color="blue">{text}</Tag>
        </span>
      );
    }
  };

  apply_detail = {
    title: site('申请详情'),
    table: ({ text, record, view }: FieldProps<string, ActivityApply, ActivityApplyPage>) =>
      record.isTotalRow ? (
        ''
      ) : (
        <a
          onClick={() => {
            this.setState({
              detail: { visible: true, record }
            });
          }}
        >
          详情
        </a>
      )
  };

  apply_time = {
    title: site('申请时间'),
    search: <QuickDateComponent />
  };

  process_time = {
    title: site('处理时间')
  };

  status = {
    title: site('状态'),
    table: ({ text }: FieldProps<string, ActivityApply, ActivityApplyPage>) => {
      const STATUS = {
        pending: <Tag className="audit-ing">{site('未处理')}</Tag>,
        rejected: <Tag className="audit-refused">{site('已拒绝')}</Tag>,
        pass: <Tag className="audit-ed">{site('已通过')}</Tag>
      };
      return <div>{STATUS[text]}</div>;
    }
  };

  memo = {
    title: site('备注'),
    edit: <Input.TextArea />,
    detail: <Label />
  };

  mobile = {
    title: site('联系电话'),
    table: notInTable,
    detail: <Label />
  };

  email = {
    title: site('邮箱'),
    table: notInTable,
    detail: <Label />
  };

  content = {
    title: site('申请活动'),
    table: notInTable,
    detail: <Label />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, ActivityApply, ActivityApplyPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/active/apply/status"
                    method: "PUT"
                    type: "StatusResult"
                  ) {
                  state
                  message
                }
              }
            `}
          >
            {(status, { data }) => (
              <TableActionComponent>
                {record.status === 'pending' && (
                  <>
                    <LinkComponent
                      confirm={true}
                      onClick={() =>
                        status({ variables: { body: { id: record.id, status: 'pass' } } })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ActivityApply', {
                              id: record.id,
                              status: 'pass'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {site('通过')}
                    </LinkComponent>
                    <LinkComponent
                      confirm={true}
                      onClick={() =>
                        status({ variables: { body: { id: record.id, status: 'rejected' } } })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ActivityApply', {
                              id: record.id,
                              status: 'rejected'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {site('拒绝')}
                    </LinkComponent>
                  </>
                )}
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      memo: { visible: true, record }
                    });
                  }}
                >
                  写备注
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
        )
      );
    }
  };
  constructor(view: React.PureComponent<T & { client: ApolloClient<{}> }>) {
    super(view);
  }
}
