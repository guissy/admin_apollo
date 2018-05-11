import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import styled from 'styled-components';
import { Tag } from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { TransferRecordState, WalletTypesItem } from './TransferRecord.model';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import LinkComponent from '../../components/link/LinkComponent';
import showMessage from '../../../utils/showMessage';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { SearchComponent, SearchFormConfig } from '../../components/form/SearchComponent';
import { DatePicker, Select, Input } from 'antd';
const Option = Select.Option;

interface Props {
  dispatch: Dispatch;
  site: (p: IntlKeys, values?: object) => React.ReactNode;
  transferRecord: TransferRecordState;
  form: WrappedFormUtils;
}

interface State {
  subordinateBrokerageTable: Array<object>;
  subordinateBrokerageTableLoading: boolean;
  modalVisible: boolean;
  account: string;
  level: number;
  walletTypes: Array<WalletTypesItem>;
}

/** 转帐记录 */
@withLocale
@select('transferRecord')
export default class TransferRecord extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subordinateBrokerageTable: [],
      subordinateBrokerageTableLoading: false,
      modalVisible: false,
      account: '',
      level: 0,
      walletTypes: []
    };
  }

  componentWillMount() {
    this.props
      .dispatch({
        type: 'transferRecord/queryWalletTypes',
        payload: {}
      })
      .then(result => {
        if (result.state === 0) {
          this.setState({
            walletTypes: result.data
          });
        }
      });
    this.props.dispatch({
      type: 'transferRecord/loadData',
      payload: {
        page: '1',
        page_size: '10'
      }
    });
  }

  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'transferRecord/loadData',
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
        title: '交易订单号',
        dataIndex: 'no',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '状态',
        dataIndex: 'status',
        notInTable: true,
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              <Option value="success">{site('成功')}</Option>
              <Option value="fail">{site('失败')}</Option>
            </Select>
          );
        }
      },
      {
        title: site('转账时间'),
        dataIndex: 'start_time,end_time',
        formItemRender: () => <DatePicker.RangePicker />
      },
      {
        title: site('转出'),
        dataIndex: 'out_id',
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              {this.state.walletTypes.map((item, index) => {
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
        title: site('转入'),
        dataIndex: 'in_id',
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              {this.state.walletTypes.map((item, index) => {
                return (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          );
        }
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
        title: this.props.site('转出钱包'),
        dataIndex: 'out_name'
      },
      {
        title: this.props.site('转入钱包'),
        dataIndex: 'in_name'
      },
      {
        title: this.props.site('转帐金额'),
        dataIndex: 'amount'
      },
      {
        title: this.props.site('操作人'),
        dataIndex: 'op_name'
      },
      {
        title: this.props.site('转帐时间'),
        dataIndex: 'created'
      },
      {
        title: this.props.site('交易订单号'),
        dataIndex: 'no'
      },
      {
        title: this.props.site('状态'),
        dataIndex: 'status',
        render: (text: string) => {
          if (text === 'success') {
            return <Tag className={'account-opened'}>{this.props.site('成功')}</Tag>;
          } else {
            return <Tag className={'account-opened'}>{this.props.site('失败')}</Tag>;
          }
        }
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
          actionType="transferRecord/loadData"
          pageSize={10}
        />
        <TableComponent
          columns={columns}
          dataSource={this.props.transferRecord.tableData}
          pagination={getPagination(this.props.transferRecord.attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
