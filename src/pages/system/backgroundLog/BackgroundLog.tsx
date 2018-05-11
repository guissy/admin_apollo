import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Table, Tag, Input, Select, DatePicker } from 'antd';
import withLocale from '../../../utils/withLocale';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { SearchComponent, SearchFormConfig } from '../../components/form/SearchComponent';
import { IntlKeys } from '../../../locale/zh_CN';
import { BackgroundLogState } from './BackgroundLog.model';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const Option = Select.Option;

interface Props {
  tableData: Array<object>;
  isLoading: boolean;
  dispatch: Dispatch;
  site: (p: IntlKeys) => React.ReactNode;
  backgroundLog: BackgroundLogState;
  form: WrappedFormUtils;
}

interface State {}

/** 后台操作日志 */
@withLocale
@select('backgroundLog')
export default class BackgroundLog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'backgroundLog/loadData',
      payload: {
        page: '1',
        pageSize: '10'
      }
    });
  }

  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'backgroundLog/loadData',
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
        title: '操作者',
        dataIndex: 'created_uname',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '被操作者',
        dataIndex: 'user_name',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '操作IP',
        dataIndex: 'ip',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '操作类型',
        dataIndex: 'op_type',
        notInTable: true,
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              <Option value="add">{site('新增')}</Option>
              <Option value="delete">{site('删除')}</Option>
              <Option value="update">{site('修改')}</Option>
              <Option value="check">{site('审核')}</Option>
              <Option value="login">{site('登录')}</Option>
              <Option value="logout">{site('登出')}</Option>
            </Select>
          );
        }
      },
      {
        title: site('结果'),
        dataIndex: 'result',
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
        title: site('起止时间'),
        dataIndex: 'date_from,date_to',
        formItemRender: () => <DatePicker.RangePicker />
      }
    ];
  }

  render() {
    const columns = [
      {
        title: this.props.site('记录编号'),
        dataIndex: 'id'
      },
      {
        title: this.props.site('操作者'),
        dataIndex: 'created_uname'
      },
      {
        title: this.props.site('被操作者'),
        dataIndex: 'user_name'
      },
      {
        title: this.props.site('模块名称'),
        dataIndex: 'module'
      },
      {
        title: this.props.site('操作类型'),
        dataIndex: 'op_type'
      },
      {
        title: 'IP',
        dataIndex: 'ip'
      },
      {
        title: this.props.site('操作时间'),
        dataIndex: 'created'
      },
      {
        title: this.props.site('详细信息'),
        dataIndex: 'remark'
      },
      {
        title: this.props.site('结果'),
        dataIndex: 'result',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className={'account-opened'}>{this.props.site('成功')}</Tag>;
          } else if (text === '0') {
            return <Tag className={'account-close'}>{this.props.site('失败')}</Tag>;
          } else {
            return '';
          }
        }
      }
    ];

    return (
      <div>
        <SearchComponent
          form={this.props.form}
          fieldConfig={this.config('search')}
          actionType="backgroundLog/loadData"
          pageSize={20}
        />
        <TableComponent
          columns={columns}
          dataSource={this.props.backgroundLog.tableData}
          pagination={getPagination(this.props.backgroundLog.attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
