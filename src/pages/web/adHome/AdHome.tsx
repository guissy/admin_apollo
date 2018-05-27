import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Button, Col, Form, Input, Row, Select, Tag } from 'antd';
import styled from 'styled-components';
import { AdHomeState, AdHomeData } from './AdHome.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import DetailModal from '../../components/modal/DetailModal';
import LanguageComponent from '../../components/language/LanguageComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormUI } from '../../components/form/EditFormUI';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import Editor from '../../components/richTextEditor/Editor';
import ButtonBarComponent from '../../components/button/ButtonBarComponent';

interface AdProps {
  dispatch: Dispatch;
  adHome: AdHomeState;
  site: (p: IntlKeys) => React.ReactNode;
  form?: WrappedFormUtils;
}
interface State {}
const Option = Select.Option;
const FormItem = Form.Item;
const WrapRow = styled(Row)`
  margin-bottom: 10px;
`;
/** 文案管理 */
@withLocale
@select('adHome')
@Form.create()
export default class AdHome extends React.PureComponent<AdProps, State> {
  state = {
    visible: false,
    addVisible: false,
    editVisible: false,
    actiontype: '',
    item: null,
    name: '',
    itemObj: {},
    editobj: {},
    viewVisible: false,
    id: ''
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'adHome/query',
      payload: {
        page: 1,
        page_size: this.props.adHome.page_size
      }
    });
  }
  config = (useFor: 'create' | 'edit' | 'table' | 'view') => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('文案管理名称'),
        dataIndex: 'name',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null),
        render: (text: string) => text,
        formRules: rules
      },
      {
        title: site('语言'),
        dataIndex: 'language',
        formItemRender: () =>
          useFor !== 'table' ? <LanguageComponent labelInValue={true} /> : null,
        render: (text: string, record: AdHomeData) => record.language_name,
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
        title: site('生成时间'),
        dataIndex: 'created',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        notInView: true,
        render: (text: string) => text
      },
      {
        title: site('状态'),
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
        title: site('排序'),
        dataIndex: 'sort',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null),
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
        title: site('操作'),
        notInView: true,
        dataIndex: '',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: AdHomeData) => {
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
        formItemRender: () => (useFor !== 'table' ? <Editor id="1212" /> : null),
        render: (text: string, record: AdHomeData) => (
          <div dangerouslySetInnerHTML={{ __html: text }} />
        ),
        formRules: rules
      }
    ];
  }
  onEdit = (item: AdHomeData) => {
    this.setState({
      editVisible: true,
      editobj: {
        name: item.name,
        language: { key: item.language_id, label: item.language_name },
        sort: item.sort,
        content: item.content
      },
      actiontype: 'edit',
      id: item.id
    });
  }
  onStatus = (item: AdHomeData) => {
    this.props
      .dispatch({
        type: 'adHome/doEnable',
        payload: {
          id: item.id,
          params: {
            language_id: item.id,
            pf: item.pf,
            status: item.status === 'enabled' ? 'disabled' : 'enabled'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onApply = (item: AdHomeData) => {
    this.props
      .dispatch({
        type: 'adHome/doApply',
        payload: {
          id: item.id,
          params: {
            language_id: item.id,
            pf: item.pf,
            approve_status: 'applying'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  loadData = () => {
    this.props.dispatch({
      type: 'adHome/query',
      payload: {
        page: this.props.adHome.attributes.numebr,
        page_size: this.props.adHome.attributes.size
      }
    });
  }
  onView = (item: AdHomeData) => {
    this.setState({
      itemObj: item,
      viewVisible: !this.state.viewVisible
    });
  }
  onViewCallback = () => {
    this.setState({
      itemObj: {},
      viewVisible: !this.state.viewVisible
    });
  }
  onDelete = (item: AdHomeData) => {
    this.props
      .dispatch({
        type: 'adHome/doDelete',
        payload: {
          id: item.id
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  addAdHome = () => {
    this.setState({
      actiontype: 'add',
      addVisible: true
    });
  }
  // tslint:disable-next-line:no-any
  onSubmit = (values: any) => {
    values.language_id = values.language.key;
    values.language_name = values.language.label;
    values.pf = 'pc';
    delete values.language;
    let type: string;
    let data: object;
    if (this.state.actiontype === 'add') {
      type = 'adHome/doAdd';
      data = values;
    } else {
      type = 'adHome/doEdit';
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
  handleAddCancel = () => {
    this.setState({
      addVisible: false
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
    const { site = () => null, form, adHome } = this.props;
    const { addVisible, editVisible, editobj, viewVisible, itemObj } = this.state;
    return (
      <div>
        <ButtonBarComponent onCreate={this.addAdHome} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增文案管理')}
          modalVisible={addVisible}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeAdd}
        />
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑文案')}
          modalVisible={editVisible}
          values={editobj}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeEdit}
        />
        <TableComponent
          dataSource={adHome.data}
          pagination={getPagination(adHome.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
        <DetailModal
          title="文案管理详情"
          visible={viewVisible}
          columns={this.config('view')}
          itemObj={itemObj}
          onClose={this.onViewCallback}
        />
      </div>
    );
  }
}
