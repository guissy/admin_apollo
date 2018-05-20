import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { AgentAuditState } from './AgentAudit.model';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { SearchUI, SearchFormConfig } from '../../components/form/SearchUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { showMessageForResult } from '../../../utils/showMessage';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale, { siteFunction } from '../../../utils/withLocale';
import { Form, Input, Tag, Select } from 'antd';

const Option = Select.Option;

interface Props {
  form?: WrappedFormUtils;
  site?: siteFunction;
  dispatch?: Dispatch;
  agentAudit?: AgentAuditState;
}

/** 代理审核 */
@withLocale
@Form.create()
@select('agentAudit')
export default class AgentAudit extends React.PureComponent<Props, {}> {
  state = {};
  componentDidMount() {
    this.loadData();
  }
  loadData = () => {
    this.props.dispatch!({
      type: 'agentAudit/queryAgentAudit',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  // 分页
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'agentAudit/queryAgentAudit',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  //   拒绝或通过操作
  onOperateAgent = (id: string, status: string) => {
    this.props.dispatch!({
      type: 'agentAudit/operateAgentAudit',
      payload: {
        id: id,
        status: status
      }
    })
      .then(showMessageForResult)
      .then(() => {
        this.loadData();
      });
  }
  config = (useFor: 'table' | 'search'): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    return [
      {
        title: site('代理用户名'),
        dataIndex: 'name',
        formItemRender: () => (useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('电话号码'),
        dataIndex: 'mobile',
        formItemRender: () => null
      },
      {
        title: site('电子邮箱'),
        dataIndex: 'email',
        formItemRender: () => null
      },
      {
        title: site('姓名'),
        dataIndex: 'truename',
        formItemRender: () => null
      },
      {
        title: site('注册时间'),
        dataIndex: 'created',
        formItemRender: () => null
      },
      {
        title: site('加入来源'),
        dataIndex: 'channel',
        formItemRender: () => null,
        render: (text: string, record: { channel: string }) => {
          if (record.channel === '1') {
            return 'H5';
          } else if (record.channel === '2') {
            return 'PC';
          } else if (record.channel === '3') {
            return '厅主后台创建';
          } else {
            return '代理后台创建';
          }
        }
      },
      {
        title: site('注册IP'),
        dataIndex: 'ip',
        formItemRender: () => null
      },
      {
        title: site('处理人'),
        dataIndex: 'admin_user',
        formItemRender: () => null
      },
      {
        title: site('审核状态'),
        dataIndex: 'status',
        formItemRender: () => {
          if (useFor === 'search') {
            return (
              <Select>
                <Option value={'0'}>{site('未审核')}</Option>
                <Option value={'2'}>{site('已拒绝')}</Option>
              </Select>
            );
          } else {
            return null;
          }
        },
        render: (text: string, record: { status: string }) => {
          if (record.status === '0') {
            return <Tag className="audit-ing">{site('未审核')}</Tag>;
          } else if (record.status === '3') {
            return <Tag className="account-close">{site('停用')}</Tag>;
          } else {
            return <Tag className="audit-refused">{site('已拒绝')}</Tag>;
          }
        }
      },
      {
        title: site('操作'),
        dataIndex: 'action',
        formItemRender: () => null,
        render: (text: string, record: { id: string; status: string }) => {
          return (
            <TableActionComponent>
              <LinkComponent
                hidden={record.status === '2'}
                confirm={true}
                onClick={() => this.onOperateAgent(record.id, '2')}
              >
                {site('拒绝')}
              </LinkComponent>
              <LinkComponent
                hidden={record.status === '2'}
                confirm={true}
                onClick={() => this.onOperateAgent(record.id, '1')}
              >
                {site('通过')}
              </LinkComponent>
              {/* todo资料跳转 */}
              <LinkComponent>{site('资料')}</LinkComponent>
            </TableActionComponent>
          );
        }
      }
    ];
  }
  render() {
    const { site = () => '', form, agentAudit = {} as AgentAuditState } = this.props;
    const { data, attributes } = agentAudit;
    return (
      <div>
        {/* 搜索 */}
        <SearchUI
          form={form}
          fieldConfig={this.config('search')}
          actionType="agentAudit/queryAgentAudit"
          pageSize={30}
        />
        {/* 代理审核表格列表 */}
        <TableComponent
          dataSource={data ? data : []}
          columns={this.config('table')}
          form={form}
          pagination={getPagination(attributes, this.onPageChange)}
        />
      </div>
    );
  }
}
