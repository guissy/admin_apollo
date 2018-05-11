import * as React from 'react';
import Pie from './components/PieChart';
import Bar from './components/BarChart';
import Line from './components/LineChart';
import styled from 'styled-components';
import { Row, Col, Table, Card, Tag } from 'antd';
import { select } from '../../utils/model';
import { connect, Dispatch } from 'dva';
// tslint:disable-next-line:no-sass-in-page
import styles from './Dashboard.scss';
import { DashboardState, TodayState } from './Dashboard.model';

const Wrap = styled.section`
  margin-top: 24px;
`;

/** 仪表盘：聚合 */
@select('dashboard')
export default class Dashboard extends React.PureComponent<Props, State> {
  state = {};

  componentDidMount() {
    this.props.dispatch!({ type: 'dashboard/today', payload: {} });
    this.props.dispatch!({ type: 'dashboard/channel', payload: {} });
  }

  render() {
    const {
      active_members = 0,
      new_members = 0,
      online_members = 0,
      deposit_money = 0,
      best_times = 0,
      best_money = 0
    } =
      this.props.dashboard || ({} as TodayState);

    // 今日表格数据
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: string) => <span>{text}</span>
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age'
      },
      {
        title: 'Address',
        dataIndex: 'address',
        key: 'address'
      },
      {
        title: 'Action',
        key: 'action',
        render: (text: string, record: {}) => <span />
      }
    ];

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park'
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park'
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park'
      }
    ];

    return (
      <Wrap>
        <Row gutter={24}>
          <Col span={4}>
            <Card bordered={false} className={styles.totalWrap}>
              <div className={`${styles.total} ${styles.color1}`}>{active_members}</div>
              <Card.Meta description="今日活跃用户" />
            </Card>
          </Col>
          <Col span={4}>
            <Card bordered={false} className={styles.totalWrap}>
              <div className={`${styles.total} ${styles.color2}`}>{new_members}</div>
              <Card.Meta description="今日新增用户" />
            </Card>
          </Col>
          <Col span={4}>
            <Card bordered={false} className={styles.totalWrap}>
              <div className={`${styles.total} ${styles.color3}`}>{online_members}</div>
              <Card.Meta description="今日上线用户数" />
            </Card>
          </Col>
          <Col span={4}>
            <Card bordered={false} className={styles.totalWrap}>
              <div className={`${styles.total} ${styles.color4}`}>{deposit_money}</div>
              <Card.Meta description="今日存款总金额" />
            </Card>
          </Col>
          <Col span={4}>
            <Card bordered={false} className={styles.totalWrap}>
              <div className={`${styles.total} ${styles.color5}`}>{best_times}</div>
              <Card.Meta description="今日总订单数" />
            </Card>
          </Col>
          <Col span={4}>
            <Card bordered={false} className={styles.totalWrap}>
              <div className={`${styles.total} ${styles.color6}`}>{best_money}</div>
              <Card.Meta description="今日总订单金额" />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Card className={styles.chartWrap}>
              <Pie />
            </Card>
          </Col>
          <Col span={12}>
            <Card className={styles.chartWrap}>
              <Bar />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={12}>
            <Card className={styles.chartWrap}>
              <Line />
            </Card>
          </Col>
          <Col span={12}>
            <Card className={styles.chartWrap}>
              <Line />
            </Card>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Card className={styles.chartWrap}>
              <Table
                className={styles.tableWrap}
                bordered={true}
                title={() => '今日盈利金额前十名'}
                pagination={false}
                columns={columns}
                dataSource={data}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={styles.chartWrap}>
              <Table
                className={styles.tableWrap}
                bordered={true}
                title={() => '今日盈利金额前十名'}
                pagination={false}
                columns={columns}
                dataSource={data}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card className={styles.chartWrap}>
              <Table
                className={styles.tableWrap}
                bordered={true}
                title={() => '今日盈利金额前十名'}
                pagination={false}
                columns={columns}
                dataSource={data}
              />
            </Card>
          </Col>
        </Row>
      </Wrap>
    );
  }
}

interface Props {
  dispatch?: Dispatch;
  dashboard: DashboardState;
}

interface State {}
