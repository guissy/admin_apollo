import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { Form, Input, Select, Tag, DatePicker } from 'antd';
import { AnnouncementData, AnnouncementState } from './AnnouncementManage.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormUI } from '../../components/form/EditFormUI';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { SearchUI } from '../../components/form/SearchUI';
import moment from 'moment';
import ButtonBarComponent from '../../components/button/ButtonBarComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import AddAnnouncement from './AddAnnouncement';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import Editor from '../../components/richTextEditor/Editor';

interface NoticeProps {
  dispatch: Dispatch;
  announcementManage: AnnouncementState;
  site?: (p: IntlKeys) => React.ReactNode;
  form?: WrappedFormUtils;
}
const Option = Select.Option;
interface State {
  // tslint:disable-next-line:no-any
  editobj: any;
  addVisible: boolean;
  id: string | number;
  editVisible: boolean;
}
/** 公告管理 */
@withLocale
@Form.create()
@select('announcementManage')
export default class AnnouncementManage extends React.PureComponent<NoticeProps, State> {
  state = {
    addVisible: false,
    id: 0,
    editVisible: false,
    editobj: {}
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'announcementManage/query',
      payload: {
        page: 1,
        page_size: 20
      }
    });
    this.props.dispatch({
      type: 'announcementManage/doUseLevel',
      payload: {}
    });
  }
  config = (useFor: 'create' | 'table' | 'search' | 'edit') => {
    const { site = () => '' } = this.props;
    const { userLevel } = this.props.announcementManage;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('发送类型'),
        dataIndex: 'send_type',
        formItemRender: () =>
          useFor === 'create' ? (
            <Select>
              <Option value="1">{site('会员层级')}</Option>
              <Option value="2">{site('代理')}</Option>
              <Option value="3">{site('自定义')}</Option>
            </Select>
          ) : null,
        formRules: rules,
        notInTable: true
      },
      {
        title: site('消息类型'),
        dataIndex: 'type',
        notInTable: true,
        formItemRender: () =>
          useFor === 'create' || useFor === 'search' ? (
            <Select>
              <Option value="2">{site('全部')}</Option>
              <Option value="1">{site('重要')}</Option>
              <Option value="0">{site('一般')}</Option>
            </Select>
          ) : null,
        render: (text: string, record: AnnouncementData) => {
          return text === '1' ? (
            <Tag className="audit-ed">{site('重要消息')}</Tag>
          ) : (
            <Tag className="audit-no">{site('一般消息')}</Tag>
          );
        }
      },
      {
        title: site('公告标题'),
        dataIndex: 'title',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null)
      },
      {
        title: site('内容'),
        dataIndex: 'content',
        formInitialValue: '',
        notInTable: true,
        formItemRender: () => (useFor === 'edit' ? <Editor id="121212" /> : null)
      },
      {
        title: site('弹出类型'),
        dataIndex: 'popup_type',
        formInitialValue: '',
        notInTable: true,
        render: (text: string) => text,
        formItemRender: () => (useFor === 'edit' ? <Input disabled={true} /> : null)
      },
      {
        title: site('接收人'),
        dataIndex: 'recipient',
        notInTable: true,
        render: (text: string) => text,
        formItemRender: () => (useFor === 'edit' ? <Input disabled={true} /> : null)
      },
      {
        title: site('发送人'),
        dataIndex: 'admin_name',
        notInTable: true,
        render: (text: string) => text,
        formItemRender: () => (useFor === 'edit' ? <Input disabled={true} /> : null)
      },
      {
        title: site('起始时间'),
        dataIndex: 'start_time,end_time',
        formInitialValue: '',
        notInTable: true,
        formItemRender: () => <DatePicker.RangePicker />,
        formRules: rules
      },
      {
        title: site('弹出类型'),
        dataIndex: 'popup_type',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: AnnouncementData) => text
      },
      {
        title: site('接收人'),
        dataIndex: 'recipient',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('发送人'),
        dataIndex: 'admin_name',
        formItemRender: () => (useFor === 'table' ? <Input /> : null)
      },
      {
        title: site('发送人'),
        dataIndex: 'recipient_origin',
        notInTable: true,
        formItemProps: () => (useFor === 'edit' ? { style: { display: 'none' } } : ''),
        formItemRender: () => (useFor === 'edit' ? <Input /> : null)
      },
      {
        title: site('发送类型'),
        dataIndex: 'send_type',
        notInTable: true,
        formItemProps: () => (useFor === 'edit' ? { style: { display: 'none' } } : ''),
        formItemRender: () => (useFor === 'edit' ? <Input /> : null)
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        notInTable: true,
        formItemProps: () => (useFor === 'edit' ? { style: { display: 'none' } } : ''),
        formItemRender: () => (useFor === 'edit' ? <Input /> : null)
      },
      {
        title: site('语言'),
        dataIndex: 'language_id',
        notInTable: true,
        formItemProps: () => (useFor === 'edit' ? { style: { display: 'none' } } : ''),
        formItemRender: () => (useFor === 'edit' ? <Input /> : null)
      },
      {
        title: site('开始时间'),
        dataIndex: 'start_time',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('结束时间'),
        dataIndex: 'end_time',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        formItemRender: () =>
          useFor === 'search' ? (
            <Select>
              <Option value="0">{site('全部')}</Option>
              <Option value="1">{site('启用')}</Option>
              <Option value="2">{site('停用')}</Option>
            </Select>
          ) : null,
        render: (text: string, record: AnnouncementData) => {
          return text === '1' ? (
            <Tag className="audit-ed">{site('启用')}</Tag>
          ) : (
            <Tag className="audit-no">{site('停用')}</Tag>
          );
        }
      },
      {
        title: site('操作'),
        dataIndex: '',
        notInView: true,
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: AnnouncementData) => {
          return (
            <TableActionComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onEdit(record)}
                hidden={record.status === '1'}
              >
                {site('编辑')}
              </LinkComponent>
              <LinkComponent confirm={true} onClick={() => this.onStatus(record)}>
                {record.status === '1' ? site('停用') : site('启用')}
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
  onStatus = (item: AnnouncementData) => {
    this.props
      .dispatch({
        type: 'announcementManage/doStatus',
        payload: {
          id: item.id,
          params: {
            status: item.status === '1' ? 2 : 1
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onEdit = (obj: AnnouncementData) => {
    this.setState({
      editVisible: !this.state.editVisible,
      editobj: obj,
      id: obj.id
    });
  }
  loadData = () => {
    this.props.dispatch({
      type: 'announcementManage/query',
      payload: {
        page: this.props.announcementManage.attributes.number,
        page_size: this.props.announcementManage.attributes.size
      }
    });
  }
  onDelete = (obj: AnnouncementData) => {
    this.props
      .dispatch({
        type: 'announcementManage/doDelete',
        payload: {
          id: obj.id
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  addNotice = () => {
    this.setState({
      addVisible: !this.state.addVisible
    });
  }
  closeAdd = () => {
    this.setState({
      addVisible: !this.state.addVisible
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'announcementManage/query',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  closeEdit = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  onSubmit = (values: AnnouncementData) => {
    console.log(this.state.editobj);
    switch (values.popup_type) {
      case '登录弹出':
        values.popup_type = 1;
        break;
      case '首页弹出':
        values.popup_type = 2;
        break;
      case '滚动公告':
        values.popup_type = 3;
        break;
      default:
        console.info(`🐞: `, '无匹配类型');
    }
    if (values.send_type === '1' && values.recipient === '所有层级') {
      values.recipient = '';
    } else if (values.send_type === '1' && values.recipient.length > 0) {
      values.recipient = values.recipient_origin;
    }
    delete values.recipient_origin;
    return this.props.dispatch({
      type: 'announcementManage/doEdit',
      payload: { id: this.state.id, params: values }
    });
  }
  render() {
    const { form, site = () => null, announcementManage } = this.props;
    const { addVisible, editVisible, editobj } = this.state;
    return (
      <div>
        <SearchUI
          form={form}
          fieldConfig={this.config('search')}
          actionType="announcementManage/query"
          pageSize={20}
        />
        <ButtonBarComponent onCreate={this.addNotice} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑')}
          modalVisible={editVisible}
          values={editobj}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeEdit}
        />
        <AddAnnouncement
          form={form}
          modalTitle={site('新增消息')}
          modalVisible={addVisible}
          onCancel={this.closeAdd}
        />
        <TableComponent
          dataSource={announcementManage.data}
          pagination={getPagination(announcementManage.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
      </div>
    );
  }
}
