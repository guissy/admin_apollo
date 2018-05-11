import * as React from 'react';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { select } from '../../../../utils/model';
import { Dispatch } from 'dva';
import { DiscountDetailState, Record, Game } from './DiscountDetail.model';
import { SearchComponent, SearchFormConfig } from '../../../components/form/SearchComponent';
import TableComponent, { getPagination } from '../../../components/table/TableComponent';
import { Form, Button, Tag } from 'antd';
import { showMessageForResult } from '../../../../utils/showMessage';
import { WrappedFormUtils } from 'antd/es/form/Form';

interface Props {
  dispatch?: Dispatch;
  discountdetail?: DiscountDetailState;
  form?: WrappedFormUtils;
  site?: (p: IntlKeys) => React.ReactNode;
  id: string;
  name: string;
  changeVisible: Function;
}

interface State {
  id: string;
  name: string;
  selectedRowKeys: string[];
  tableData: Array<Record>;
  validBetNum: number;
  couponNum: number;
}
/** 返水详情 */

@withLocale
@Form.create()
@select('discountdetail')
export default class DiscountDetail extends React.PureComponent<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const value = prevState.tableData;
    if (nextProps.discountdetail && nextProps.discountdetail.data !== value) {
      return { ...prevState, tableData: nextProps.discountdetail.data };
    } else {
      return prevState;
    }
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      id: this.props.id,
      name: this.props.name,
      selectedRowKeys: [],
      tableData: this.props.discountdetail ? this.props.discountdetail.data : [],
      validBetNum: 1,
      couponNum: 1
    };
  }
  loadTableData = (page: number, pageSize: number, id: string) => {
    this.props.dispatch!({
      type: 'discountdetail/loadData',
      payload: {
        page: page,
        page_size: pageSize,
        id: id
      }
    });
  }
  componentDidMount() {
    this.loadTableData(1, 10, this.props.id);
  }
  // 按有效投注排序
  sortByBet = () => {
    if (this.props.discountdetail) {
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
    if (this.props.discountdetail) {
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
        title: site('返水状态'),
        dataIndex: 'status',
        render: (text: string, record: Record) => {
          return (
            <div>
              {record.revoked === '0' ? (
                <Tag className="audit-ed">{site('已返')}</Tag>
              ) : (
                <Tag className="audit-refused">{site('冲销')}</Tag>
              )}
            </div>
          );
        }
      },
      {
        title: site('代理商'),
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
    this.loadTableData(page, pageSize, this.state.id);
  }
  onSelectChange = (selectedRowKeys: string[]) => {
    this.setState({ selectedRowKeys });
  }
  // 返回返水活动页
  goBack = () => {
    this.props.changeVisible();
  }
  // 冲销
  doRevoke = () => {
    return this.props.dispatch!({
      type: 'discountdetail/doRevoke',
      payload: {
        id: this.state.id,
        detail_id: this.state.selectedRowKeys
      }
    })
      .then(res => showMessageForResult(res, '冲销成功'))
      .then(() => this.props.changeVisible());
  }
  render() {
    const { site = () => '', form, discountdetail } = this.props;
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      onChange: this.onSelectChange,
      getCheckboxProps: (record: Record) => ({
        disabled: record.revoked === '1',
        name: record.name
      })
    };
    // 动态取游戏部分的表头数据
    // tslint:disable-next-line:no-any
    let columns: any = this.config();
    if (discountdetail && discountdetail.data[0]) {
      const addColumns = discountdetail.data[0].games.map((item: Game, key: number) => ({
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
        <span>
          {site(this.props.name)}
          {site('返水详情')}
        </span>
        {discountdetail && selectedRowKeys.length > 0 ? (
          <p>
            {site(`本页您选择了${selectedRowKeys.length}条数据`)}
            <Button size="small" onClick={this.doRevoke} loading={discountdetail.revokeLoading}>
              {site('冲销')}
            </Button>
          </p>
        ) : (
          ''
        )}
        {discountdetail ? (
          <TableComponent
            dataSource={this.state.tableData}
            rowSelection={rowSelection}
            columns={columns}
            rowKey={(record: Record) => record.detail_id}
            form={form}
            pagination={getPagination(discountdetail.attributes, this.onPageChange)}
          />
        ) : (
          ''
        )}
      </section>
    );
  }
}
