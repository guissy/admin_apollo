import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import styled from 'styled-components';
import { Form, Icon, Select, Tag, Modal, Input, Button } from 'antd';
import { ProxyCopyState, ProxyCopyData } from './ProxyCopy.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import TableActionComponent from '../../components/table/TableActionComponent';
import Editor from '../../components/richTextEditor/Editor';
import LanguageComponent from '../../components/language/LanguageComponent';
import DetailModal, { ViewFormConfig } from '../../components/modal/DetailModal';
import { EditFormUI } from '../../components/form/EditFormUI';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import LinkComponent from '../../components/link/LinkComponent';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';

interface Props {
  dispatch: Dispatch;
  proxycopy: ProxyCopyState;
  site: (p: IntlKeys) => React.ReactNode;
  form: WrappedFormUtils;
}
interface State {}
const Option = Select.Option;
const proxytype: Array<{ value: string; label: string }> = [
  { label: '赚取佣金', value: '赚取佣金' },
  { label: '如何运作', value: '如何运作' },
  { label: '关于我们', value: '关于我们' }
];
const ProxyItems = proxytype.map(todo => (
  <Option value={todo.value} key={todo.value}>
    {todo.label}
  </Option>
));
/** 代理文案 */
@withLocale
@select('proxycopy')
@Form.create()
export default class ProxyCopy extends React.PureComponent<Props, State> {
  state = {
    visible: false,
    addVisible: false,
    editVisible: false,
    detailViewVisible: false,
    name: '',
    itemObj: {},
    editObj: {},
    actiontype: '',
    id: ''
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'proxycopy/query',
      payload: {
        page: this.props.proxycopy.page,
        page_size: this.props.proxycopy.page_size
      }
    });
  }
  config = (useFor: 'create' | 'edit' | 'table' | 'view'): ViewFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('文案类型'),
        dataIndex: 'name',
        formItemRender: () => <Select>{ProxyItems}</Select>,
        formRules: rules
      },
      {
        title: site('语言'),
        dataIndex: 'language',
        formItemRender: () =>
          useFor === 'create' || useFor === 'edit' ? (
            <LanguageComponent labelInValue={true} />
          ) : null,
        render: (text: string, record: ProxyCopyData) => record.language_name,
        formRules: rules
      },
      {
        title: site('审核状态'),
        dataIndex: 'approve_status',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string) => {
          if (text === 'pass') {
            return <Tag className="audit-ed">{site('已通过')}</Tag>;
          } else if (text === 'pending') {
            return <Tag className="audit-no">{site('待申请')}</Tag>;
          } else if (text === 'rejected') {
            return <Tag className="audit-refused">{site('已拒绝')}</Tag>;
          } else {
            return <Tag className="audit-ing">{site('申请中')}</Tag>;
          }
        }
      },
      {
        title: site('排序'),
        dataIndex: 'sort',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null),
        notInTable: true,
        formRules: () => [
          {
            required: true,
            pattern: /^[0-9]*$/,
            transform: (value: number) => Number(value),
            message: '请输入整数'
          }
        ]
      },
      {
        title: site('使用状态'),
        dataIndex: 'status',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string) => {
          if (text === 'enabled') {
            return <Tag className="account-opened">{site('启用')}</Tag>;
          } else {
            return <Tag className="account-close">{site('停用')}</Tag>;
          }
        }
      },
      {
        title: site('生成时间'),
        dataIndex: 'created',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string) => text
      },
      {
        title: site('操作'),
        dataIndex: 'action',
        notInView: true,
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: ProxyCopyData) => {
          return (
            <TableActionComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onView(record)}
                hidden={record.approve_status === 'pending'}
              >
                {record.approve_status === 'pending' ? site('申请') : site('查看')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onApply(record)}
                hidden={record.approve_status !== 'pending'}
              >
                {record.approve_status === 'pending' ? site('申请') : site('查看')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onStatus(record)}
                hidden={record.approve_status !== 'pass'}
              >
                {record.status === 'enabled' ? site('停用') : site('启用')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onEdit(record)}
                hidden={record.approve_status !== 'pending'}
              >
                {site('编辑')}
              </LinkComponent>
              <LinkComponent confirm={true} onClick={() => this.onDelete(record)}>
                {site('删除')}
              </LinkComponent>
            </TableActionComponent>
          );
        }
      },
      {
        title: site('文案内容'),
        dataIndex: 'content',
        notInTable: true,
        formInitialValue: '',
        formItemRender: () => (useFor !== 'table' ? <Editor id="123" /> : null),
        render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />,
        formRules: rules
      }
    ];
  }
  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
  onApply = (item: ProxyCopyData) => {
    this.props
      .dispatch({
        type: 'proxycopy/doApply',
        payload: {
          id: item.id,
          params: {
            language_id: item.language_id,
            pf: item.pf,
            approve_status: 'applying'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onStatus = (item: ProxyCopyData) => {
    this.props
      .dispatch({
        type: 'proxycopy/doEnable',
        payload: {
          id: item.id,
          params: {
            language_id: item.language_id,
            pf: item.pf,
            status: item.status === 'enabled' ? 'disabled' : 'enabled'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  loadData = () => {
    this.props.dispatch({
      type: 'proxycopy/query',
      payload: {
        page: this.props.proxycopy.attributes.number,
        page_size: this.props.proxycopy.attributes.size
      }
    });
  }
  onView = (item: ProxyCopyData) => {
    this.setState({
      itemObj: item,
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  onViewCallback = () => {
    this.setState({
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  onDelete = (item: ProxyCopyData) => {
    this.props
      .dispatch({
        type: 'proxycopy/doDelete',
        payload: {
          id: item.id
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onEdit = (item: ProxyCopyData) => {
    this.setState({
      editVisible: true,
      actiontype: 'edit',
      editObj: {
        name: item.name,
        language: { key: item.language_id, label: item.language_name },
        sort: item.sort,
        content: item.content
      },
      id: item.id
    });
  }
  addProxy = () => {
    this.setState({
      addVisible: !this.state.addVisible,
      actiontype: 'add'
    });
  }
  // tslint:disable-next-line:no-any
  handleSubmit = (values: any) => {
    values.language_id = values.language.key;
    values.language_name = values.language.label;
    values.pf = 'pc';
    delete values.language;
    let type: string;
    let data: object;
    if (this.state.actiontype === 'add') {
      type = 'proxycopy/doAdd';
      data = values;
    } else {
      type = 'proxycopy/doEdit';
      data = { id: this.state.id, params: values };
    }
    return this.props.dispatch({
      type: type,
      payload: data
    });
  }
  closeAdd = () => {
    this.setState({
      addVisible: !this.state.addVisible
    });
  }
  closeEdit = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'adList/query',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  render() {
    const { site = () => null, form, proxycopy } = this.props;
    const { addVisible, detailViewVisible, itemObj, editVisible, editObj } = this.state;
    return (
      <div>
        <ButtonBarComponent onCreate={this.addProxy} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增轮播广告')}
          modalVisible={addVisible}
          onDone={this.loadData}
          onSubmit={this.handleSubmit}
          onCancel={this.closeAdd}
        />
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑代理文案')}
          modalVisible={editVisible}
          values={editObj}
          onDone={this.loadData}
          onSubmit={this.handleSubmit}
          onCancel={this.closeEdit}
        />
        <TableComponent
          dataSource={proxycopy.data}
          pagination={getPagination(proxycopy.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
        <DetailModal
          title="轮播广告详情"
          visible={detailViewVisible}
          columns={this.config('view')}
          itemObj={itemObj}
          onClose={this.onViewCallback}
        />
      </div>
    );
  }
}
