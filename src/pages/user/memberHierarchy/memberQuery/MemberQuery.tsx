import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { MemberQueryState } from './MemberQuery.model';
import { showMessageForResult } from '../../../../utils/showMessage';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale, { siteFunction } from '../../../../utils/withLocale';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { Form, Input, Modal, Button, Select, Switch, Row, Col, Table, Popconfirm } from 'antd';

const Option = Select.Option;

const MemberQueryWrap = styled.div`
  .header-label {
    line-height: 32px;
    text-align: center;
  }
  .btn-margin {
    margin-left: 10px;
  }
`;

interface Props {
  form?: WrappedFormUtils;
  site?: siteFunction;
  dispatch?: Dispatch;
  memberQuery?: MemberQueryState;
}

/** 会员层级 -- 会员查询 */
@withLocale
@Form.create()
@select('memberQuery')
export default class MemberQuery extends React.PureComponent<Props, {}> {
  state = {
    isLoading: false,
    queryName: ''
  };
  componentDidMount() {
    this.props.dispatch!({
      type: 'memberQuery/queryAllMemberHierarchy',
      payload: {}
    });
  }
  // tslint:disable-next-line:no-any
  onSetQueryName = (e: any) => {
    this.setState({
      queryName: e.target.value
    });
  }
  onQueryMembers = () => {
    this.props.dispatch!({
      type: 'memberQuery/loadData',
      payload: {
        members: this.state.queryName
      }
    });
  }
  // 会员锁定
  onLock = (id: string, checked: boolean) => {
    const list: Array<Array<string>> = [];
    const v = checked ? '1' : '0';
    list.push([id, v]);
    this.props.dispatch!({
      type: 'memberQuery/lockMembers',
      payload: {
        list: list
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.props.dispatch!({
          type: 'memberQuery/loadData',
          payload: {
            members: this.state.queryName
          }
        });
      });
  }
  // 会员分层
  onLayeredChange = (record: { id: string; lock: string }, value: string) => {
    if (record.lock === '1') {
      // 层级锁定
      console.log('层级锁定');
      return;
    }
    const list: Array<Array<string>> = [];
    list.push([record.id, value]);
    this.props.dispatch!({
      type: 'memberQuery/layeredMembers',
      payload: {
        list: list
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.props.dispatch!({
          type: 'memberQuery/loadData',
          payload: {
            members: this.state.queryName
          }
        });
      });
  }
  render() {
    const { site = () => '', form, memberQuery = {} as MemberQueryState } = this.props;
    const config = [
      {
        title: site('会员账号'),
        dataIndex: 'name'
      },
      {
        title: site('所属代理'),
        dataIndex: 'agnet'
      },
      {
        title: site('会员加入时间'),
        dataIndex: 'created'
      },
      {
        title: site('最后登录时间'),
        dataIndex: 'last_login'
      },
      {
        title: site('存款次数'),
        dataIndex: 'deposit_total'
      },
      {
        title: site('存款总额'),
        dataIndex: 'deposit_money'
      },
      {
        title: site('最大存款总额'),
        dataIndex: 'deposit_max'
      },
      {
        title: site('提现次数'),
        dataIndex: 'withdraw_total'
      },
      {
        title: site('提现总数'),
        dataIndex: 'withdraw_money'
      },
      {
        title: site('分层'),
        dataIndex: 'action',
        render: (text: string, record: { lid: string }) => {
          return (
            <Select
              defaultValue={record.lid}
              style={{ width: 120 }}
              onChange={this.onLayeredChange.bind(this, record)}
            >
              {memberQuery.levelList.map((item: { id: string; name: string }, index: number) => {
                return (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          );
        }
      },
      {
        title: site('锁定'),
        dataIndex: 'action1',
        render: (text: string, record: { id: string; lock: string }) => {
          return (
            <Switch
              defaultChecked={record.lock !== '0'}
              onChange={this.onLock.bind(this, record.id)}
            />
          );
        }
      }
    ];
    return (
      <MemberQueryWrap>
        <Row>
          <Col span={2} className="header-label">
            {site('用户名:')}
          </Col>
          <Col span={4}>
            <Input onChange={this.onSetQueryName} />
          </Col>
          <Col span={18}>
            <Button className="btn-margin" type="primary" onClick={this.onQueryMembers}>
              {site('查询')}
            </Button>
          </Col>
        </Row>
        <Table dataSource={memberQuery ? memberQuery.data : []} columns={config} />
      </MemberQueryWrap>
    );
  }
}
