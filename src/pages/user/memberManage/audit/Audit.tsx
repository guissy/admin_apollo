import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { MemberAuditState } from './Audit.model';
import TableComponent, { getPagination } from '../../../components/table/TableComponent';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { Button, Tag } from 'antd';

const AuditCon = styled.div`
  .header {
    margin-bottom: 10px;
    h2 {
      text-align: center;
    }
    .btn-con {
      text-align: right;
    }
  }
`;

interface Props {
  site?: (p: IntlKeys) => React.ReactNode;
  dispatch?: Dispatch;
  userId: number;
  memberAudit?: MemberAuditState;
}

/** 会员稽核信息 */
@withLocale
@select('memberAudit')
// tslint:disable-next-line:top-level-comment
export default class Audit extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.dispatch!({
      type: 'memberAudit/loadData',
      payload: {
        id: this.props.userId,
        obj: {
          type: 'withdraw',
          page: 1,
          page_size: 20
        }
      }
    });
  }
  onAudit = () => {
    // todo刷新表格没做
    console.log(this.props.memberAudit);
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    this.props.dispatch!({
      type: 'memberAudit/loadData',
      payload: {
        id: this.props.userId,
        obj: {
          type: 'withdraw',
          page: page,
          page_size: pageSize
        }
      }
    });
  }
  config = (useFor: 'table') => {
    const { site = () => null } = this.props;
    return [
      {
        title: site('存款金额'),
        dataIndex: 'money',
        formItemRender: () => null
      },
      {
        title: site('优惠金额'),
        dataIndex: 'coupon_money',
        formItemRender: () => null
      },
      {
        title: site('有效投注额'),
        dataIndex: 'valid_bet',
        formItemRender: () => null
      },
      {
        title: site('常态打码量'),
        dataIndex: 'withdraw_bet_principal',
        formItemRender: () => null
      },
      {
        title: site('优惠打码量'),
        dataIndex: 'withdraw_bet_coupon',
        formItemRender: () => null
      },
      {
        title: site('是否到达投注额'),
        dataIndex: 'is_pass',
        render: (val: boolean) => {
          if (val) {
            return <Tag className="account-opened">{site('是')}</Tag>;
          } else {
            return <Tag className="account-close">{site('否')}</Tag>;
          }
        },
        formItemRender: () => null
      },
      {
        title: site('扣除优惠'),
        dataIndex: 'deduct_coupon',
        formItemRender: () => null
      },
      {
        title: site('扣除行政费'),
        dataIndex: 'deduct_admin_fee',
        formItemRender: () => null
      }
    ];
  }
  render() {
    const { site = () => null, memberAudit = {} as MemberAuditState } = this.props;
    const { data, attributes } = memberAudit;
    return (
      <AuditCon>
        <div className="header">
          <h2>{site('即时稽核')}</h2>
          <div className="btn-con">
            <Button type="primary" size="small" onClick={this.onAudit}>
              {site('即时稽核')}
            </Button>
          </div>
          <div className="tips">
            <span>
              {site('当前会员所在层级行政费比例:') + String(data.level_config.withdraw_expenese)}
            </span>
            <span> | </span>
            <span>{site('行政费上限:') + String(data.level_config.max_expenese)}</span>
            <span> | </span>
            <span>{site('免稽核额度:') + String(data.level_config.nocheck)}</span>
          </div>
        </div>
        <TableComponent
          dataSource={memberAudit ? data.list : []}
          columns={this.config('table')}
          pagination={getPagination(attributes, this.onPageChange)}
        />
        <div>
          <div>
            <span>{site('常态稽核:') + String(data.total_admin_fee) + site('元')}</span>
            <span> | </span>
            <span>{site('优惠稽核:') + String(data.total_coupon) + site('元')}</span>
            <span> | </span>
            <span>{site('出款手续费:') + String(data.total_fee) + site('元')}</span>
          </div>
          <div>
            {site('共需扣除费用:') +
              String(data.total_admin_fee + data.total_coupon + data.total_fee) +
              site('元')}
          </div>
        </div>
      </AuditCon>
    );
  }
}
