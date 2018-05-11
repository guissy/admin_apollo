import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import { MemberAccountBalanceState } from './Balance.model';
import styled from 'styled-components';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { Row, Col, Button, Spin } from 'antd';

const AccountBalanceWrap = styled.div`
  .header {
    margin-bottom: 20px;
    h2 {
      text-align: center;
    }
    span {
      margin-right: 5px;
    }
    .header-btn {
      text-align: right;
      button {
        margin-left: 5px;
      }
    }
  }
  .container {
    .con-list {
      > div {
        margin-bottom: 10px;
        .label {
          margin-right: 10px;
          background: #eeeeee;
        }
      }
    }
  }
`;

interface Props {
  site?: (p: IntlKeys) => React.ReactNode;
  userId: number;
  // tslint:disable-next-line:no-any
  dispatch?: Dispatch | any;
  // tslint:disable-next-line:no-any
  memberAccountBalance?: MemberAccountBalanceState | any;
}

@withLocale
@select('memberAccountBalance')
// tslint:disable-next-line:top-level-comment
export default class Balance extends React.PureComponent<Props> {
  constructor(props: Props) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'memberAccountBalance/loadData',
      payload: {
        id: this.props.userId,
        params: {
          type: 'balance'
        }
      }
    });
  }
  onRefish = () => {
    this.props.dispatch({
      type: 'memberAccountBalance/loadData',
      payload: {
        id: this.props.userId,
        params: {
          type: 'balance',
          refresh: 1
        }
      }
    });
  }
  render() {
    const { site = () => null } = this.props;
    const arrList: Array<object> =
      this.props.memberAccountBalance.accountBalanceInfo.children || [];
    // tslint:disable-next-line:no-any
    let rowString: any = arrList.map(
      (item: { game_type: string; balance: string }, index: number) => {
        return (
          <Col span={12} key={index}>
            <span className="label">{item.game_type}</span>
            <span>{item.balance}</span>
          </Col>
        );
      }
    );
    return (
      <AccountBalanceWrap>
        <Spin size="large" spinning={this.props.memberAccountBalance.loading}>
          <div className="header">
            <h2>{site('账户余额')}:</h2>
            <div>
              <span>{site('货币')}:</span>
              <span>{this.props.memberAccountBalance.accountBalanceInfo.currency_name}</span>
              <span>{site('最后更新时间')}:</span>
              <span>{this.props.memberAccountBalance.accountBalanceInfo.updated}</span>
              <div className="header-btn">
                <Button type="primary" size="small" onClick={this.onRefish}>
                  {site('刷新余额')}
                </Button>
                <Button type="primary" size="small">
                  {site('调整余额')}
                </Button>
              </div>
            </div>
          </div>
          <div className="container">
            <Row type="flex" className="con-list">
              <Col span={12}>
                <span className="label">{site('主账户')}</span>
                <span>{this.props.memberAccountBalance.accountBalanceInfo.balance}</span>
              </Col>
              <Col span={12}>
                <span className="label">{site('提款冻结')}</span>
                <span>{this.props.memberAccountBalance.accountBalanceInfo.freeze_withdraw}</span>
              </Col>
              {rowString}
              <Col span={24}>
                <span className="label">{site('总余额')}</span>
                <span>{this.props.memberAccountBalance.accountBalanceInfo.amount}</span>
              </Col>
            </Row>
          </div>
        </Spin>
      </AccountBalanceWrap>
    );
  }
}
