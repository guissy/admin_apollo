import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Table, Tag, Button, Modal, Input, Select } from 'antd';
import withLocale from '../../../utils/withLocale';
import { IntlKeys } from '../../../locale/zh_CN';
import { SubAgentRebateState, TableRow } from './SubAgentRebate.model';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { SearchComponent, SearchFormConfig } from '../../components/form/SearchComponent';
import TagButton from '../../components/tagButton/TagButtonComponent';
import showMessage from '../../../utils/showMessage';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const Option = Select.Option;

interface Props {
  dispatch: Dispatch;
  site: (p: IntlKeys, values?: object) => React.ReactNode;
  subAgentRebate: SubAgentRebateState;
  form: WrappedFormUtils;
}

interface CommissionPeriodNamesItem {
  id: string;
  period_name: string;
}

interface State {
  subordinateBrokerageTable: Array<object>;
  subordinateBrokerageTableLoading: boolean;
  modalVisible: boolean;
  account: string;
  level: number;
  commissionPeriodNames: Array<CommissionPeriodNamesItem>;
}

/** 下级佣金统计 */
@withLocale
@select('subAgentRebate')
export default class SubAgentRebate extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      subordinateBrokerageTable: [],
      subordinateBrokerageTableLoading: false,
      modalVisible: false,
      account: '',
      level: 0,
      commissionPeriodNames: []
    };
  }

  componentWillMount() {
    this.props
      .dispatch({
        type: 'subAgentRebate/commissionPeriod',
        payload: {}
      })
      .then(result => {
        if (result.state === 0) {
          this.setState({ commissionPeriodNames: result.data });
        }
      });
    this.props.dispatch({
      type: 'subAgentRebate/loadData',
      payload: {
        page: '1',
        pageSize: '20'
      }
    });
  }

  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'subAgentRebate/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }

  onSubordinateBrokerage = (data: TableRow, level: number) => {
    this.setState({
      modalVisible: true,
      account: data.uname,
      level: Number(level) + 1,
      subordinateBrokerageTableLoading: true
    });
    this.props
      .dispatch({
        type: 'subAgentRebate/querySubordinateBrokerage',
        payload: {
          period: data.period,
          agent_id: data.uid,
          level: level + 1,
          page: 1,
          page_size: 20
        }
      })
      .then(res => {
        if (res.state === 0) {
          // tslint:disable-next-line:no-any
          res.data.map((item: any) => {
            item.bkge_amount = Number(item.bkge_amount) / 100;
            item.bkge_amount = item.bkge_amount.toFixed(2);
            item.commission = Number(item.commission) / 100;
            item.commission = item.commission.toFixed(2);
          });
          this.setState({
            subordinateBrokerageTable: res.data,
            subordinateBrokerageTableLoading: false
          });
        } else {
          showMessage(false);
        }
      });
  }

  // 查询
  config = (useFor: 'search' | 'create' | 'edit' | 'table'): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: '代理账号',
        dataIndex: 'uname',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '期数名称',
        dataIndex: 'period_name',
        notInTable: true,
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              {this.state.commissionPeriodNames.map((item, index) => {
                return (
                  <Option value={item.period_name} key={index}>
                    {item.period_name}
                  </Option>
                );
              })}
            </Select>
          );
        }
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              <Option value="">{site('全部')}</Option>
              <Option value="0">{site('未发放')}</Option>
              <Option value="1">{site('已发放')}</Option>
            </Select>
          );
        }
      }
    ];
  }

  render() {
    const columns = [
      {
        title: this.props.site('期数名称'),
        dataIndex: 'period_name'
      },
      {
        title: this.props.site('代理用户名'),
        dataIndex: 'uname'
      },
      {
        title: this.props.site('下级佣金'),
        dataIndex: 'settings',
        render: (text: string, record: TableRow) => {
          return record.settings.map((item, index) => {
            return (
              <TagButton key={index} onClick={() => this.onSubordinateBrokerage(record, index)}>
                {item.toFixed(2)}
              </TagButton>
            );
          });
        }
      },
      {
        title: this.props.site('总计'),
        dataIndex: 'total'
      },
      {
        title: this.props.site('状态'),
        dataIndex: 'status',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className={'account-opened'}>{this.props.site('已发放')}</Tag>;
          } else if (text === '0') {
            return <Tag className={'account-close'}>{this.props.site('未发放')}</Tag>;
          } else {
            return <Tag className={'account-close'}>{this.props.site('转下期')}</Tag>;
          }
        }
      },
      {
        title: this.props.site('操作'),
        render: (text: string, record: TableRow) => {
          return (
            <LinkComponent
              onClick={() => {
                this.props.dispatch({
                  type: 'subAgentRebate/commis',
                  payload: {
                    ids: [record.id],
                    uids: [record.uid]
                  }
                });
              }}
            >
              {this.props.site('发放')}
            </LinkComponent>
          );
        }
      }
    ];

    return (
      <div>
        <Modal
          title={this.props.site(`代理账号:【{account}】下的【{level}】级退佣详情`, this.state)}
          visible={this.state.modalVisible}
          onOk={() => this.setState({ modalVisible: false })}
          onCancel={() => this.setState({ modalVisible: false })}
        >
          <TableComponent
            columns={[
              {
                title: this.props.site('下级代理账号'),
                dataIndex: 'username'
              },
              {
                title: this.props.site('下级代理当期佣金'),
                dataIndex: 'bkge_amount'
              },
              {
                title: this.props.site('退佣比例(%)'),
                dataIndex: 'rate'
              },
              {
                title: this.props.site('退佣'),
                dataIndex: 'commission'
              }
            ]}
            dataSource={this.state.subordinateBrokerageTable}
            loading={this.state.subordinateBrokerageTableLoading}
            rowKey={(index: number) => ''}
          />
        </Modal>
        <SearchComponent
          form={this.props.form}
          fieldConfig={this.config('search')}
          actionType="subAgentRebate/loadData"
          pageSize={20}
        />
        <TableComponent
          columns={columns}
          dataSource={this.props.subAgentRebate.tableData}
          pagination={getPagination(this.props.subAgentRebate.attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
