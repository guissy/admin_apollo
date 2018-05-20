import * as React from 'react';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { DiscountState, Record } from './Discount.model';
import { SearchUI } from '../../components/form/SearchUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import DiscountDetail from './detail/DiscountDetail';
import AddDiscount from './add/AddDiscount';
import { Form, Input } from 'antd';
import { WrappedFormUtils } from 'antd/es/form/Form';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';

interface Props {
  dispatch: Dispatch;
  discount: DiscountState;
  form?: WrappedFormUtils;
  site?: (p: IntlKeys) => React.ReactNode;
}
interface State {
  id: string;
  name: string;
  detailVisible: boolean;
  tableVisible: boolean;
  addDiscountVisible: boolean;
}
/** 返水活动 */

@withLocale
@Form.create()
@select('discount')
export default class Discount extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      id: '',
      name: '',
      detailVisible: false,
      tableVisible: true,
      addDiscountVisible: false
    };
  }
  doOpen = (values: Record) => {
    this.setState({
      id: values.id,
      name: values.name,
      detailVisible: true,
      tableVisible: false,
      addDiscountVisible: false
    });
  }
  config = () => {
    const { site = () => '' } = this.props;
    return [
      {
        title: site('活动名称'),
        dataIndex: 'name',
        formItemRender: () => <Input />,
        render: (text: string, record: Record) => <a onClick={() => this.doOpen(record)}>{text}</a>
      },
      {
        title: site('有效时间'),
        dataIndex: 'effect_time',
        formItemRender: () => null
      },
      {
        title: site('实际发放人数/实际发放金额'),
        dataIndex: 'people_coupon',
        formItemRender: () => null
      },
      {
        title: site('创建时间'),
        dataIndex: 'created',
        formItemRender: () => null
      },
      {
        title: site('创建人'),
        dataIndex: 'created_uname',
        formItemRender: () => null
      },
      {
        title: site('打码量(%)'),
        dataIndex: 'withdraw_per',
        formItemRender: () => null
      },
      {
        title: site('层级'),
        dataIndex: 'member_level',
        formItemRender: () => null
      },
      {
        title: site('游戏类型'),
        dataIndex: 'games',
        formItemRender: () => null
      }
    ];
  }
  componentDidMount() {
    this.loadTableData(1, 10);
  }
  loadTableData = (page: number, pageSize: number) => {
    this.props.dispatch({
      type: 'discount/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    this.loadTableData(page, pageSize);
  }
  changeVisible = () => {
    this.setState({
      detailVisible: false,
      tableVisible: true,
      addDiscountVisible: false
    });
  }
  onNew = () => {
    this.setState({
      detailVisible: false,
      tableVisible: false,
      addDiscountVisible: true
    });
  }
  render() {
    const { form, discount } = this.props;
    return (
      <section>
        {/* 返水详情 */}
        {this.state.detailVisible ? (
          <DiscountDetail
            id={this.state.id}
            name={this.state.name}
            changeVisible={this.changeVisible}
          />
        ) : (
          ''
        )}
        {/* 新增反水活动页 */}
        {this.state.addDiscountVisible ? <AddDiscount /> : ''}
        {/* 返水活动 */}
        {this.state.tableVisible ? (
          <div>
            <ButtonBarComponent onCreate={this.onNew} />
            <SearchUI
              form={this.props.form}
              fieldConfig={this.config()}
              actionType="discount/loadData"
              pageSize={30}
            />
            <TableComponent
              dataSource={discount.data}
              columns={this.config()}
              form={form}
              pagination={getPagination(discount.attributes, this.onPageChange)}
            />
          </div>
        ) : (
          ''
        )}
      </section>
    );
  }
}
