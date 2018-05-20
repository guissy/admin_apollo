import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import { Table, Icon, Divider, Tag, Input, Select, DatePicker } from 'antd';
import withLocale from '../../../utils/withLocale';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { SearchUI, SearchFormConfig } from '../../components/form/SearchUI';
import { IntlKeys } from '../../../locale/zh_CN';
import { MemberLogState } from './MemberLog.model';
import { WrappedFormUtils } from 'antd/lib/form/Form';
const Option = Select.Option;

interface Props {
  tableData: Array<object>;
  isLoading: boolean;
  dispatch: Dispatch;
  site: (p: IntlKeys) => React.ReactNode;
  memberLog: MemberLogState;
  form: WrappedFormUtils;
}

interface State {}

/** 会员操作日志 */
@withLocale
@select('memberLog')
export default class MemberLog extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'memberLog/loadData',
      payload: {
        page: '1',
        page_size: '20'
      }
    });
  }

  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'memberLog/loadData',
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
        title: 'IP',
        dataIndex: 'ip',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '域名',
        dataIndex: 'domain',
        notInTable: true,
        formItemRender: () => <Input />
      },
      {
        title: '类型',
        dataIndex: 'type',
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
        dataIndex: 'status',
        formItemRender: () => {
          return (
            <Select style={{ width: 120 }}>
              <Option value="1">{site('成功')}</Option>
              <Option value="0">{site('失败')}</Option>
            </Select>
          );
        }
      },
      {
        title: site('起止时间'),
        dataIndex: 'date_begin,date_end',
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
        title: this.props.site('用户'),
        dataIndex: 'name'
      },
      {
        title: this.props.site('域名'),
        dataIndex: 'domain'
      },
      {
        title: this.props.site('操作类型'),
        dataIndex: 'log_type'
      },
      {
        title: this.props.site('状态'),
        dataIndex: 'status',
        render: (text: string) => {
          if (text === '1') {
            return <Tag className={'account-opened'}>{this.props.site('成功')}</Tag>;
          } else if (text === '0') {
            return <Tag className={'account-close'}>{this.props.site('失败')}</Tag>;
          } else {
            return '';
          }
        }
      },
      {
        title: this.props.site('操作时间'),
        dataIndex: 'created'
      },
      {
        title: this.props.site('操作IP'),
        dataIndex: 'log_ip'
      },
      {
        title: this.props.site('操作详细信息'),
        dataIndex: 'log_value'
      }
    ];
    return (
      <div>
        <SearchUI
          form={this.props.form}
          fieldConfig={this.config('search')}
          actionType="memberLog/loadData"
          pageSize={20}
        />
        <TableComponent
          columns={columns}
          dataSource={this.props.memberLog.tableData}
          pagination={getPagination(this.props.memberLog.attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
