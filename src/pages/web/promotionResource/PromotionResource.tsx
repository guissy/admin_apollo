import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Form, Input, Select, Tag } from 'antd';
import styled from 'styled-components';
import { ResourcesState, ResourcesData } from './PromotionResource.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import SystemSetting from '../../components/richTextEditor/Editor';
import LanguageComponent from '../../components/language/LanguageComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormUI } from '../../components/form/EditFormUI';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import environment from '../../../utils/environment';
import UploadComponent from '../../components/upload/UploadComponent';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';

interface PromotionResourceProps {
  dispatch: Dispatch;
  promotionResource: ResourcesState;
  site: (p: IntlKeys) => React.ReactNode;
  form?: WrappedFormUtils;
}
const Option = Select.Option;
const FormItem = Form.Item;
const Thumbnail = styled.img`
  height: 20px;
  width: auto;
`;
const games: Array<{ value: string; text: string }> = [
  { text: '体育', value: '35' },
  { text: '电子', value: '46' },
  { text: '捕鱼', value: '51' }
];
const TodoItems = (
  <Select>
    {games.map(todo => (
      <Option value={todo.value} key={todo.value}>
        {todo.text}
      </Option>
    ))}
  </Select>
);
/** 代理推广资源 */
@withLocale
@select('promotionResource')
@Form.create()
export default class PromotionResource extends React.PureComponent<PromotionResourceProps> {
  state = {
    visible: false,
    addVisible: false,
    editVisible: false,
    actiontype: '',
    name: '',
    editobj: {},
    id: ''
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'promotionResource/query',
      payload: {
        page: 1,
        page_size: 20
      }
    });
  }
  config = (useFor: 'create' | 'edit' | 'table' | 'view') => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('媒体名称'),
        dataIndex: 'name',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('宽度'),
        dataIndex: 'width',
        notInTable: true,
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
        title: site('高度'),
        dataIndex: 'length',
        notInTable: true,
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
        title: site('尺寸'),
        dataIndex: 'wh',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string) => text
      },
      {
        title: site('文件类型'),
        dataIndex: 'file_type',
        formItemRender: () =>
          useFor !== 'table' ? <Input placeholder="文件类型jpg png jpeg gif" /> : null,
        formRules: () => [
          {
            required: true,
            pattern: /^jpg|png|jpeg|gif$/,
            message: '请输入正确的文件类型'
          }
        ]
      },
      {
        title: site('缩略图'),
        dataIndex: 'picture',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: ResourcesData) => (
          <span>
            <Thumbnail src={`${environment.imgHost}${record.picture}`} alt="无法正常显示" />
          </span>
        )
      },
      {
        title: site('语言'),
        dataIndex: 'language_id',
        formItemRender: () => (useFor !== 'table' ? <LanguageComponent /> : null),
        render: (text: string, record: ResourcesData) => record.language_name,
        formRules: rules
      },
      {
        title: site('媒体类型'),
        dataIndex: 'type',
        formItemRender: () => (useFor !== 'table' ? TodoItems : null),
        render: (text: string, record: ResourcesData) => record.game_type,
        formRules: rules
      },
      {
        title: site('图片'),
        dataIndex: 'picture',
        notInTable: true,
        formItemRender: () =>
          useFor !== 'table' ? <UploadComponent onDone={this.onUploadDone} /> : null,
        formRules: rules
      },
      {
        title: site('脚本'),
        dataIndex: 'script',
        formItemRender: () => (useFor !== 'table' ? <Input.TextArea /> : null),
        formRules: rules
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        formItemRender: () =>
          useFor !== 'table' ? (
            <Select>
              <Option value="1">启用</Option>
              <Option value="0">停用</Option>
            </Select>
          ) : null,
        formRules: rules,
        render: (text: string) => {
          if (text === '1') {
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
        dataIndex: '',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        notInView: true,
        render: (text: string, record: ResourcesData) => {
          return (
            <TableActionComponent>
              <LinkComponent confirm={true} onClick={() => this.onStatus(record)}>
                {record.status === '1' ? site('停用') : site('启用')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onEdit(record)}
                hidden={record.status === '1'}
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
  // tslint:disable-next-line:no-any
  onUploadDone = (data: any) => {
    showMessageForResult(data, '上传成功');
  }
  onEdit = (item: ResourcesData) => {
    this.setState({
      editVisible: true,
      editobj: {
        name: item.name,
        language_id: item.language_id,
        width: item.width,
        length: item.length,
        file_type: item.file_type,
        type: item.type,
        picture: item.picture,
        script: item.script,
        status: item.status
      },
      actiontype: 'edit',
      id: item.id
    });
  }
  onStatus = (item: ResourcesData) => {
    this.props
      .dispatch({
        type: 'promotionResource/doEnable',
        payload: {
          id: item.id,
          params: {
            status: item.status === '1' ? '0' : '1'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  loadData = () => {
    this.props.dispatch({
      type: 'promotionResource/query',
      payload: {
        page: this.props.promotionResource.attributes.number,
        page_size: this.props.promotionResource.attributes.size
      }
    });
  }
  onDelete = (item: ResourcesData) => {
    this.props
      .dispatch({
        type: 'promotionResource/doDelete',
        payload: {
          id: item.id
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  addResources = () => {
    this.setState({
      actiontype: 'add',
      addVisible: true
    });
  }
  onSubmit = (values: object) => {
    let type: string;
    let data: object;
    if (this.state.actiontype === 'add') {
      type = 'promotionResource/doAdd';
      data = values;
    } else {
      type = 'promotionResource/doEdit';
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
      type: 'promotionResource/query',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  render() {
    const { site = () => null, form, promotionResource } = this.props;
    const { addVisible, editVisible, editobj } = this.state;

    return (
      <div>
        <ButtonBarComponent onCreate={this.addResources} />
        <EditFormUI
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增代理推广资源')}
          modalVisible={addVisible}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeAdd}
        />
        <EditFormUI
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑推广资源')}
          modalVisible={editVisible}
          values={editobj}
          onDone={this.loadData}
          onSubmit={this.onSubmit}
          onCancel={this.closeEdit}
        />
        <TableComponent
          dataSource={promotionResource.data}
          pagination={getPagination(promotionResource.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
      </div>
    );
  }
}
