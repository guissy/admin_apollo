import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Select, Tag, Form, Input } from 'antd';
import { DepositCopyState, DepositCopyData } from './DepositCopy.model';
import TableActionComponent from '../../components/table/TableActionComponent';
import { EditFormUI } from '../../components/form/EditFormUI';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import LanguageComponent from '../../components/language/LanguageComponent';
import LinkComponent from '../../components/link/LinkComponent';
import Editor from '../../components/richTextEditor/Editor';
import ApplyComponent from './ApplyComponent';
import DetailModal from '../../components/modal/DetailModal';
import { showMessageForResult } from '../../../utils/showMessage';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import ButtonBarComponent from '../../components/button/ButtonBarComponent';
import { WrappedFormUtils } from 'antd/lib/form/Form';
interface Depositprops {
  form?: WrappedFormUtils;
  dispatch: Dispatch;
  depositcopy: DepositCopyState;
  site: (p: IntlKeys) => React.ReactNode;
}
const Option = Select.Option;
/** 存款文案 */
@withLocale
@Form.create()
@select('depositcopy')
export default class DepositCopy extends React.PureComponent<Depositprops, {}> {
  state = {
    actiontype: '',
    editVisible: false,
    addVisible: false,
    detailViewVisible: false,
    item: null,
    name: '',
    itemObj: {},
    editObj: {},
    id: ''
  };
  // 查询
  config = (useFor: 'search' | 'create' | 'edit' | 'table' | 'view') => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('文案名称'),
        dataIndex: 'name',
        formItemRender: () => <Input />,
        formInitialValue: '',
        formRules: rules
      },
      {
        title: site('语言'),
        dataIndex: 'language',
        formItemRender: () =>
          useFor !== 'table' ? <LanguageComponent labelInValue={true} /> : null,
        render: (text: string, record: DepositCopyData) => record.language_name,
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
        title: site('使用状态'),
        dataIndex: 'status',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string) => {
          if (text === 'enabled') {
            return <Tag className="account-opened">{site('启用')}</Tag>;
          } else if (text === 'disabled') {
            return <Tag className="account-close">{site('停用')}</Tag>;
          } else {
            return <Tag className="status-refused">{site('删除')}</Tag>;
          }
        }
      },
      {
        title: site('活动内容'),
        dataIndex: 'content',
        notInTable: true,
        formItemRender: () => <Editor id="1212" />,
        render: (text: string) => <div dangerouslySetInnerHTML={{ __html: text }} />,
        formInitialValue: '',
        formRules: rules
      },
      {
        title: site('使用于'),
        dataIndex: 'apply_to',
        formInitialValue: '',
        formItemRender: () => <ApplyComponent />,
        render: (text: string) => {
          if (text === 'wechat_deposit') {
            return site('微信存款');
          } else if (text === 'company_deposit') {
            return site('公司存款');
          } else if (text === 'unionpay_deposit') {
            return site('第三方网银');
          } else if (text === 'alipay_deposit') {
            return site('支付宝存款');
          } else if (text === 'global') {
            return site('全局');
          } else {
            return '未知';
          }
        },
        formRules: rules
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
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        notInView: true,
        render: (text: string, record: DepositCopyData) => {
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
      }
    ];
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'depositcopy/query',
      payload: {
        page: this.props.depositcopy.page,
        page_size: this.props.depositcopy.page_size
      }
    });
  }
  onEdit = (item: DepositCopyData) => {
    this.setState({
      actiontype: 'edit',
      editVisible: true,
      editObj: {
        name: item.name,
        apply_to: item.apply_to,
        language: { key: item.language_id, label: item.language_name },
        content: item.content
      },
      id: item.id
    });
  }
  onView = (item: DepositCopyData) => {
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
  onStatus = (item: DepositCopyData) => {
    this.props
      .dispatch({
        type: 'depositcopy/doEnable',
        payload: {
          id: item.id,
          params: {
            language_id: item.language_id,
            pf: item.pf,
            apply_to: item.apply_to,
            status: item.status === 'enabled' ? 'disabled' : 'enabled'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onApply = (item: DepositCopyData) => {
    this.props
      .dispatch({
        type: 'depositcopy/doApply',
        payload: {
          id: item.id,
          params: {
            language_id: item.language_id,
            pf: item.pf,
            approve_status: 'applying',
            apply_to: item.apply_to,
            status: item.status
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onDelete = (item: DepositCopyData) => {
    this.props
      .dispatch({
        type: 'depositcopy/doDelete',
        payload: {
          id: item.id,
          pf: item.pf
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  loadData = () => {
    this.props.dispatch({
      type: 'depositcopy/query',
      payload: {
        page: this.props.depositcopy.attributes.number,
        page_size: this.props.depositcopy.attributes.size
      }
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
  addDeposit = () => {
    this.setState({
      actiontype: 'add',
      addVisible: !this.state.addVisible
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'depositcopy/query',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  // tslint:disable-next-line:no-any
  onSubmit = (values: any) => {
    values.language_id = values.language.key;
    values.language_name = values.language.label;
    delete values.language;
    let type: string;
    let data: object;
    let title: string;
    if (this.state.actiontype === 'add') {
      type = 'depositcopy/doAdd';
      data = values;
    } else {
      type = 'depositcopy/doEdit';
      data = { id: this.state.id, params: values };
    }
    return this.props.dispatch({
      type: type,
      payload: data
    });
  }
  render() {
    const { site = () => '', form, depositcopy } = this.props;
    const { addVisible, editVisible, editObj, detailViewVisible, itemObj } = this.state;
    return (
      <div>
        <ButtonBarComponent onCreate={this.addDeposit} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          onSubmit={this.onSubmit}
          modalTitle={site('新增代理文案')}
          onDone={this.loadData}
          modalVisible={addVisible}
          onCancel={this.closeAdd}
        />
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑代理文案')}
          modalVisible={editVisible}
          values={editObj}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeEdit}
        />
        <TableComponent
          dataSource={depositcopy.data}
          pagination={getPagination(depositcopy.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
        <DetailModal
          title="代理文案详情"
          visible={detailViewVisible}
          columns={this.config('view')}
          itemObj={itemObj}
          onClose={this.onViewCallback}
        />
      </div>
    );
  }
}
