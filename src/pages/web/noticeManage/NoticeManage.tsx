import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Button, Col, Form, Input, Select, Table, Tag, DatePicker } from 'antd';
import { NoticeData, NoticeState } from './NoticeManage.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormUI } from '../../components/form/EditFormUI';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { SearchUI } from '../../components/form/SearchUI';
import moment from 'moment';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import { showMessageForResult } from '../../../utils/showMessage';

interface NoticeProps {
  dispatch: Dispatch;
  noticeManage: NoticeState;
  site: (p: IntlKeys) => React.ReactNode;
  form?: WrappedFormUtils;
}
const Option = Select.Option;
interface State {}
/** 消息管理 */
@withLocale
@Form.create()
@select('noticeManage')
export default class NoticeManage extends React.PureComponent<NoticeProps, State> {
  state = {
    addVisible: false,
    id: 0
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'noticeManage/query',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  config = (useFor: 'create' | 'table' | 'search') => {
    const { site = () => '' } = this.props;
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
        formItemRender: () =>
          useFor === 'create' || useFor === 'search' ? (
            <Select>
              <Option value="2">{site('全部')}</Option>
              <Option value="1">{site('重要')}</Option>
              <Option value="0">{site('一般')}</Option>
            </Select>
          ) : null,
        render: (text: string, record: NoticeData) => {
          return text === '1' ? (
            <Tag className="audit-ed">{site('重要消息')}</Tag>
          ) : (
            <Tag className="audit-no">{site('一般消息')}</Tag>
          );
        }
      },
      {
        title: site('标题'),
        dataIndex: 'title',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null)
      },
      {
        title: site('内容'),
        dataIndex: 'content',
        formItemRender: () =>
          useFor === 'table' || useFor === 'create' ? <Input.TextArea /> : null,
        formRules: rules
      },

      {
        title: site('接收人'),
        dataIndex: 'recipient',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('生成时间'),
        dataIndex: 'created',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('发送时间'),
        dataIndex: 'updated',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('日期'),
        dataIndex: 'date',
        formItemRender: () =>
          useFor === 'search' ? (
            <DatePicker.RangePicker
              ranges={{
                Today: [moment(), moment()],
                'This Month': [moment(), moment().endOf('month')]
              }}
              showTime={true}
              format="YYYY/MM/DD HH:mm:ss"
              onChange={this.onChange}
            />
          ) : null,
        notInTable: true
      },
      {
        title: site('发送人'),
        dataIndex: 'admin_name',
        formItemRender: () => (useFor === 'search' || useFor === 'table' ? <Input /> : null)
      },
      {
        title: site('发布状态'),
        dataIndex: 'status',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: NoticeData) => {
          return text === '1' ? (
            <Tag className="audit-ed">{site('已发布')}</Tag>
          ) : (
            <Tag className="audit-no">{site('未发布')}</Tag>
          );
        },
        formRules: rules
      },
      {
        title: site('操作'),
        dataIndex: '',
        notInView: true,
        render: (text: string, record: NoticeData) => {
          return (
            <TableActionComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onRelease(record)}
                hidden={record.status === '1'}
              >
                {site('发布')}
              </LinkComponent>
              <LinkComponent confirm={true} onClick={() => this.onDelete(record)}>
                {site('删除')}
              </LinkComponent>
            </TableActionComponent>
          );
        },
        formItemRender: () => null
      }
    ];
  }
  onChange = v => {
    console.log(v);
  }
  onRelease = (obj: NoticeData) => {
    this.props
      .dispatch({
        type: 'noticeManage/doRelease',
        payload: {
          id: obj.id
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  loadData = () => {
    this.props.dispatch({
      type: 'noticeManage/query',
      payload: {
        page: this.props.noticeManage.attributes.number,
        page_size: this.props.noticeManage.attributes.size
      }
    });
  }
  onDelete = (obj: NoticeData) => {
    this.props
      .dispatch({
        type: 'noticeManage/doDelete',
        payload: {
          ids: obj.id
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
  onSubmit = (obj: object) => {
    return this.props.dispatch({
      type: 'noticeManage/addNotice',
      payload: obj
    });
  }
  closeAdd = () => {
    this.setState({
      addVisible: !this.state.addVisible
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'noticeManage/query',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  render() {
    const { form, site = () => null, noticeManage } = this.props;
    const { addVisible } = this.state;
    return (
      <div>
        <SearchUI
          form={form}
          fieldConfig={this.config('search')}
          actionType="noticeManage/query"
          pageSize={20}
        />
        <ButtonBarComponent onCreate={this.addNotice} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增消息')}
          modalVisible={addVisible}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeAdd}
        />
        <TableComponent
          dataSource={noticeManage.data}
          pagination={getPagination(noticeManage.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
      </div>
    );
  }
}
