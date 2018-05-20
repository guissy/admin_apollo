import * as React from 'react';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { select } from '../../../../utils/model';
import { Dispatch } from 'dva';
import { QueryDetailState, Record, Game } from './QueryDetail.model';
import { SearchUI, SearchFormConfig } from '../../../components/form/SearchUI';
import TableComponent, { getPagination } from '../../../components/table/TableComponent';
import { Form, Button, Tag } from 'antd';
import { showMessageForResult } from '../../../../utils/showMessage';
import { WrappedFormUtils } from 'antd/es/form/Form';

interface Props {
  dispatch?: Dispatch;
  querydetail?: QueryDetailState;
  form?: WrappedFormUtils;
  site?: (p: IntlKeys) => React.ReactNode;
  queryData: object;
  changeVisible: Function;
}

interface State {
  selectedRowKeys: string[];
  tableData: Array<Record>;
  validBetNum: number;
  couponNum: number;
}
/** 查询详情 */

@withLocale
@Form.create()
@select('querydetail')
export default class QueryDetail extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const value = prevState.tableData;
    if (nextProps.querydetail && nextProps.querydetail.data !== value) {
      return { ...prevState, tableData: nextProps.querydetail.data };
    } else {
      return prevState;
    }
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
      tableData: this.props.querydetail ? this.props.querydetail.data : [],
      validBetNum: 1,
      couponNum: 1
    };
  }
  loadTableData = (page: number, pageSize: number) => {
    const queryData = this.props.queryData;
    this.props.dispatch!({
      type: 'querydetail/loadData',
      payload: {
        page: page,
        page_size: pageSize,
        ...queryData
      }
    });
  }
  componentDidMount() {
    console.log('props', this.props);
    this.loadTableData(1, 10);
  }
  // 按有效投注排序
  sortByBet = () => {
    if (this.props.querydetail) {
      const tableData = this.state.tableData.slice().sort((a, b) => {
        if (this.state.validBetNum % 2 === 1) {
          return Number(a.valid_bet) - Number(b.valid_bet);
        } else {
          return Number(b.valid_bet) - Number(a.valid_bet);
        }
      });
      this.setState({
        tableData,
        validBetNum: this.state.validBetNum + 1
      });
    }
  }
  // 按优惠金额排序
  sortByCoupon = () => {
    if (this.props.querydetail) {
      const tableData = this.state.tableData.slice().sort((a, b) => {
        if (this.state.couponNum % 2 === 1) {
          return Number(a.coupon) - Number(b.coupon);
        } else {
          return Number(b.coupon) - Number(a.coupon);
        }
      });
      this.setState({
        tableData,
        couponNum: this.state.couponNum + 1
      });
    }
  }
  config = () => {
    const { site = () => '' } = this.props;
    return [
      {
        title: site('会员账号'),
        dataIndex: 'user_name'
      },
      {
        title: site('层级'),
        dataIndex: 'level_name'
      },
      {
        title: site('代理账号'),
        dataIndex: 'agent_name'
      },
      {
        title: (
          <div>
            <p>
              <a onClick={this.sortByBet}>{site('上:有效总投注')}</a>
            </p>
            <p>
              <a onClick={this.sortByCoupon}>{site('下:优惠小计')}</a>
            </p>
          </div>
        ),
        dataIndex: 'valid_coupon',
        render: (text: string, record: Record) => {
          return (
            <div>
              <p>{String(text).split(',')[0]}</p>
              <p style={{ color: 'blue' }}>{String(text).split(',')[1]}</p>
            </div>
          );
        }
      }
    ];
  }
  onPageChange = (page: number, pageSize: number) => {
    this.loadTableData(page, pageSize);
  }
  onSelectChange = (selectedRowKeys: string[]) => {
    this.setState({ selectedRowKeys });
  }
  // 返回返水活动页
  goBack = () => {
    this.props.changeVisible();
  }
  render() {
    const { site = () => '', form, querydetail, queryData } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange
      // getCheckboxProps: (record: Record) => ({
      //   name: record.name
      // })
    };
    // 动态取游戏部分的表头数据
    // tslint:disable-next-line:no-any
    let columns: any = this.config();
    if (querydetail && querydetail.data[0]) {
      const addColumns = querydetail.data[0].games.map((item: Game, key: number) => ({
        title: site(item.game_name),
        dataIndex: `game_${key}`,
        render: (text: string, record: Record) => {
          return (
            <div>
              <p>{String(text).split(',')[0]}</p>
              <p style={{ color: 'blue' }}>{String(text).split(',')[1]}</p>
            </div>
          );
        }
      }));
      columns = [...columns, ...addColumns];
    }
    return (
      <section>
        <div>
          <Button type="primary" onClick={this.goBack}>
            {site('返回')}
          </Button>
        </div>
        {queryData && querydetail ? (
          <div>
            <span>
              {site(`当前查询条件:  日期:${queryData.date_from}至${queryData.date_to} 
          游戏平台:${queryData.game_name}`)}
              {queryData.user_name
                ? site(`会员名:${queryData.user_name}`)
                : site(`会员层级:${queryData.level_name}`)}
            </span>
            <TableComponent
              dataSource={this.state.tableData}
              rowSelection={rowSelection}
              columns={columns}
              rowKey={(record: Record) => record.id}
              form={form}
              pagination={getPagination(querydetail.attributes, this.onPageChange)}
            />
          </div>
        ) : (
          ''
        )}
      </section>
    );
  }
}
