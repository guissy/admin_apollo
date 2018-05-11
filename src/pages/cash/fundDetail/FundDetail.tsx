import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Table, Tag, Button, Modal, Input, Select, DatePicker } from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { FundDetailState, TableRow } from './FundDetail.model';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import LinkComponent from '../../components/link/LinkComponent';
import showMessage from '../../../utils/showMessage';
import QuickDate from '../../components/date/QuickDateComponent';
import { SearchComponent, SearchFormConfig } from '../../components/form/SearchComponent';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const Option = Select.Option;

interface Props {
  dispatch: Dispatch;
  site: (p: IntlKeys, values?: object) => React.ReactNode;
  fundDetail: FundDetailState;
  form: WrappedFormUtils;
}

interface DealCategoryItemChildren {
  id: number;
  name: string;
}

interface DealCategoryItem {
  id: number;
  name: string;
  children: Array<DealCategoryItemChildren>;
}

interface State {
  subordinateBrokerageTable: Array<object>;
  subordinateBrokerageTableLoading: boolean;
  modalVisible: boolean;
  account: string;
  level: number;
  dealCategory: Array<DealCategoryItem>;
  dealType: Array<DealCategoryItemChildren>;
}

/** 现金流水 */
@withLocale
@select('fundDetail')
export default class FundDetail extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subordinateBrokerageTable: [],
      subordinateBrokerageTableLoading: false,
      modalVisible: false,
      account: '',
      level: 0,
      dealCategory: [],
      dealType: []
    };
  }

  componentWillMount() {
    this.props
      .dispatch({
        type: 'fundDetail/queryFundsFlows',
        payload: {}
      })
      .then(result => {
        if (result.state === 0) {
          this.setState({ dealCategory: result.data });
        }
      });
    this.props.dispatch({
      type: 'fundDetail/loadData',
      payload: {
        start_time: '',
        date_to: '',
        page: '1',
        page_size: '10'
      }
    });
  }

  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'fundDetail/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }

  // 查询
  config = (useFor: 'search' | 'create' | 'edit' | 'table'): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: '用户名',
        dataIndex: 'username',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '体系',
        dataIndex: 'no',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '交易类别',
        dataIndex: 'deal_category',
        notInTable: true,
        formItemRender: () => {
          return (
            <Select
              style={{ width: 120 }}
              // tslint:disable-next-line:no-any
              onChange={(value: any) => {
                this.setState({
                  dealType: this.state.dealCategory[value - 1].children
                });
              }}
            >
              <Option value="">{site('全部')}</Option>
              {this.state.dealCategory.map((item, index) => {
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
        title: site('交易类型'),
        dataIndex: 'deal_type',
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              {this.state.dealType.map((item, index) => {
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
        title: site('交易时间'),
        dataIndex: 'start_time,end_time',
        formItemRender: () => <QuickDate />
      }
    ];
  }

  render() {
    const columns = [
      {
        title: this.props.site('用户名'),
        dataIndex: 'username',
        render: (text: string) => {
          return <div>{text}</div>;
        }
      },
      {
        title: this.props.site('交易时间'),
        dataIndex: 'created'
      },
      {
        title: this.props.site('交易流水号'),
        dataIndex: 'deal_number'
      },
      {
        title: this.props.site('交易类别'),
        dataIndex: 'deal_category',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className={'account-opened'}>{this.props.site('收入')}</Tag>;
          } else if (text === '2') {
            return <Tag className={'account-close'}>{this.props.site('支出')}</Tag>;
          } else {
            return '';
          }
        }
      },
      {
        title: this.props.site('交易类型'),
        dataIndex: 'deal_type_name'
      },
      {
        title: this.props.site('交易金额'),
        dataIndex: 'deal_money'
      },
      {
        title: this.props.site('交易后余额'),
        dataIndex: 'balance'
      },
      {
        title: this.props.site('备注'),
        dataIndex: 'memo'
      }
    ];

    return (
      <div>
        <SearchComponent
          form={this.props.form}
          fieldConfig={this.config('search')}
          actionType="fundDetail/loadData"
          pageSize={10}
        />
        <TableComponent
          columns={columns}
          dataSource={this.props.fundDetail.tableData}
          pagination={getPagination(this.props.fundDetail.attributes, this.onPageChange)}
          footer={() => {
            return (
              <div>
                金额小计：{this.props.fundDetail.attributes.page_money_sum}{' '}
                <span style={{ margin: '0 3px' }} />
                金额总计：{this.props.fundDetail.attributes.total_money_sum}
              </div>
            );
          }}
        />
      </div>
    );
  }
}
