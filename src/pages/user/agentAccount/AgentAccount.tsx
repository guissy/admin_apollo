import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Form, Select, Tag, Input, Checkbox, Radio, Modal } from 'antd';
import styled from 'styled-components';
import { AgentAccountState, AgentAccountData } from './AgentAccount.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { FormComponentProps } from 'antd/lib/form';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormUI } from '../../components/form/EditFormUI';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import { adminPageSize, adminPage } from '../../../utils/constant';
import { SearchUI, SearchFormConfig } from '../../components/form/SearchUI';
import QuickDateComponent from '../../components/date/QuickDateComponent';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import AgentDetail from './AgentDetail';
import { ViewFormConfig } from '../../components/modal/DetailModal';
interface Props extends FormComponentProps {
  dispatch: Dispatch;
  agentAccount: AgentAccountState;
  site: (p: IntlKeys) => React.ReactNode;
  form: WrappedFormUtils;
}
interface State {}
const RadioGroup = Radio.Group;
const Option = Select.Option;
/** 代理管理 */
@withLocale
@select('agentAccount')
@Form.create()
export default class AgentAccount extends React.PureComponent<Props, State> {
  state = {
    isDetailVisible: false,
    actiontype: '',
    addVisible: false,
    agentId: '',
    agentType: ''
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'agentAccount/query',
      payload: {
        page: adminPage,
        page_size: adminPageSize
      }
    });
  }
  config = (useFor: 'table' | 'search' | 'create'): ViewFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('查询配置'),
        dataIndex: 'similar',
        notInTable: true,
        formItemRender: () => (useFor === 'search' ? <Checkbox>模糊查询用户名</Checkbox> : null)
      },
      {
        title: site('代理账号'),
        dataIndex: 'name',
        formItemRender: () => (useFor === 'table' || useFor === 'search' ? <Input /> : null)
      },
      {
        title: site('真实姓名'),
        dataIndex: 'truename',
        formItemRender: () => (useFor !== 'search' ? <Input /> : null)
      },
      {
        title: site('代理类型'),
        dataIndex: 'agent_type',
        notInTable: true,
        formItemRender: () =>
          useFor === 'search' ? (
            <RadioGroup>
              <Radio value={2}>直属代理</Radio>
              <Radio value={1}>层级代理</Radio>
            </RadioGroup>
          ) : null
      },
      {
        title: site('类型'),
        dataIndex: 'type',
        formItemRender: () => (useFor !== 'search' ? <Input /> : null),
        render: (text: string) =>
          text === '1' ? (
            <Tag className="audit-ed">{site('层级代理')}</Tag>
          ) : (
            <Tag className="audit-no">{site('直属代理')}</Tag>
          )
      },
      {
        title: site('上级代理'),
        dataIndex: 'pname',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null)
      },
      {
        title: site('代理层级'),
        dataIndex: 'level',
        formItemRender: () => (useFor !== 'search' ? <Input /> : null)
      },
      {
        title: site('下级代理数'),
        dataIndex: 'inferisors_num',
        formItemRender: () => (useFor !== 'search' ? <Input /> : null)
      },
      {
        title: site('会员数'),
        dataIndex: 'play_num',
        render: (text: string, record: AgentAccountData) => (
          <Link to={{ pathname: '/memberManage', search: `?agent=${record.name}` }}>{text}</Link>
        ),
        formItemRender: () => (useFor !== 'search' ? <Input /> : null)
      },
      {
        title: site('账户余额'),
        dataIndex: 'balance',
        formItemRender: () => (useFor !== 'search' ? <Input /> : null)
      },
      {
        title: site('推广码'),
        dataIndex: 'code',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null)
      },
      {
        title: site('注册时间'),
        dataIndex: 'register_from,register_to',
        notInTable: true,
        formItemRender: () =>
          useFor === 'search' ? <QuickDateComponent onCallback={this.PickDate} /> : null
      },
      {
        title: site('注册时间'),
        dataIndex: 'created',
        formItemRender: () => (useFor !== 'search' ? <Input /> : null)
      },
      {
        title: site('注册来源'),
        dataIndex: 'channel',
        formItemRender: () =>
          useFor === 'search' ? (
            <Select>
              <Option value="1">{site('H5注册')}</Option>
              <Option value="2">{site('PC注册')}</Option>
              <Option value="3">{site('厅主后台创建')}</Option>
              <Option value="4">{site('代理后台创建')}</Option>
            </Select>
          ) : null,
        render: (text: string) => {
          let obj = {
            '1': <Tag className="audit-ed">{site('H5注册')}</Tag>,
            '2': <Tag className="audit-no">{site('PC注册')}</Tag>,
            '3': <Tag className="audit-ing">{site('厅主后台创建')}</Tag>,
            '4': <Tag className="audit-refused">{site('代理后台创建')}</Tag>
          };
          return obj[text];
        }
      },
      {
        title: site('在线状态'),
        dataIndex: 'online',
        formItemRender: () =>
          useFor === 'search' ? (
            <RadioGroup>
              <Radio value={1}>在线</Radio>
              <Radio value={0}>离线</Radio>
            </RadioGroup>
          ) : null,
        render: (text: string) =>
          text === '1' ? (
            <Tag className="account-opened">{site('在线')}</Tag>
          ) : (
            <Tag className="account-close ">{site('离线')}</Tag>
          )
      },
      {
        title: site('账号状态'),
        dataIndex: 'status',
        formItemRender: () =>
          useFor === 'search' ? (
            <RadioGroup>
              <Radio value={1}>启用</Radio>
              <Radio value={3}>停用</Radio>
              <Radio value={0}>未审核</Radio>
              <Radio value={2}>拒绝</Radio>
            </RadioGroup>
          ) : null,
        render: (text: string) => {
          let obj = {
            '0': <Tag className="audit-no">{site('未审核')}</Tag>,
            '1': <Tag className="account-opened">{site('启用')}</Tag>,
            '2': <Tag className="account-close">{site('拒绝')}</Tag>,
            '3': <Tag className="account-disabled">{site('停用')}</Tag>
          };
          return obj[text];
        }
      },
      {
        title: site('操作'),
        dataIndex: '',
        formItemRender: () => null,
        notInView: true,
        render: (text: string, record: AgentAccountData) => {
          return (
            <TableActionComponent>
              <LinkComponent confirm={true} onClick={() => this.onDetail(record)}>
                {site('资料')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onStatus(record)}
                hidden={record.status === '0' || record.status === '2'}
              >
                {record.status === '1' ? site('停用') : site('启用')}
              </LinkComponent>
            </TableActionComponent>
          );
        }
      }
    ];
  }
  PickDate = v => {
    console.info(`🐞: `, v);
  }
  // tslint:disable-next-line:no-any
  onUploadDone = (data: any) => {
    showMessageForResult(data);
  }
  // tslint:disable-next-line:no-any
  handleChange = (e: any) => {
    this.setState({
      pf: e.target.value
    });
    if (e.target.value) {
      this.props.dispatch({
        type: 'agentAccount/query',
        payload: {
          page: 1,
          page_size: 20,
          pf: e.target.value
        }
      });
    }
  }
  onDetail = (item: AgentAccountData) => {
    this.setState({
      isDetailVisible: !this.state.isDetailVisible,
      agentId: item.id,
      agentType: item.type
    });
  }
  onStatus = (item: AgentAccountData) => {
    this.props
      .dispatch({
        type: 'agentAccount/doEnable',
        payload: {
          ids: [item.id],
          status: item.status === '1' ? '3' : '1'
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  handleCancel = (e: object) => {
    this.setState({
      visible: false
    });
  }
  addAgent = () => {
    this.setState({
      addVisible: true,
      actiontype: 'add'
    });
  }
  closeAdd = () => {
    this.setState({
      addVisible: false
    });
  }
  // tslint:disable-next-line:no-any
  handleSubmit = (values: any) => {
    return this.props.dispatch({
      type: 'type',
      payload: 'data'
    });
  }
  loadData = () => {
    this.props.dispatch({
      type: 'agentAccount/query',
      payload: {
        page: this.props.agentAccount.attributes.number,
        page_size: this.props.agentAccount.attributes.size
      }
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'agentAccount/query',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  onCallBackPage = () => {
    this.setState({
      isDetailVisible: !this.state.isDetailVisible
    });
  }
  render() {
    const { site = () => null, form, agentAccount } = this.props;
    const { addVisible, agentId, agentType, isDetailVisible, isDestroyOnClose } = this.state;
    return (
      <div>
        <SearchUI form={form} fieldConfig={this.config('search')} pageSize={20} />
        <ButtonBarComponent onCreate={this.addAgent} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增代理')}
          modalVisible={addVisible}
          onDone={this.loadData}
          onSubmit={this.handleSubmit}
          onCancel={this.closeAdd}
        />
        <TableComponent
          dataSource={agentAccount.data}
          pagination={getPagination(agentAccount.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
        <Modal
          visible={isDetailVisible}
          width="1000px"
          closable={false}
          footer={false}
          destroyOnClose={true}
        >
          <AgentDetail callBackPage={this.onCallBackPage} agentId={agentId} agentType={agentType} />
        </Modal>
      </div>
    );
  }
}
