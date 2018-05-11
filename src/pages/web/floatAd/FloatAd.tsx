import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import environment from '../../../utils/environment';
import { Button, Col, Form, Input, message, Radio, Row, Select, Table, Tag } from 'antd';
import styled from 'styled-components';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { FloatAdState, FloatAdData } from './FloatAd.model';
import UploadComponent from '../../components/upload/UploadComponent';
import LanguageComponent from '../../components/language/LanguageComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { SearchComponent } from '../../components/form/SearchComponent';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import { WrappedFormUtils } from 'antd/es/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';

interface Props {
  dispatch: Dispatch;
  floatAd: FloatAdState;
  site: (p: IntlKeys) => React.ReactNode;
  form?: WrappedFormUtils;
}

interface State {}

const Option = Select.Option;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Thumbnail = styled.img`
  height: 20px;
  width: auto;
`;
const WrapRow = styled(Row)`
  margin-bottom: 10px;
`;
const position: Array<{ value: string; text: string }> = [
  { text: '左中', value: 'left-middle' },
  { text: '右中', value: 'right-middle' },
  { text: '左下', value: 'left-bottom' },
  { text: '右下', value: 'right-bottom' }
];
const TodoItems = position.map(todo => (
  <Option value={todo.value} key={todo.value}>
    {todo.text}
  </Option>
));

/** 浮动图 */
@withLocale
@select('floatAd')
@Form.create()
export default class FloatAd extends React.PureComponent<Props, State> {
  state = {
    pf: 'pc',
    visible: false,
    actiontype: '',
    addVisible: false,
    item: null,
    name: '',
    itemObj: {},
    editObj: {},
    title: '',
    marginVisible: false,
    editVisible: false,
    detailViewVisible: false,
    id: ''
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'floatAd/query',
      payload: {
        page: this.props.floatAd.page,
        page_size: this.props.floatAd.page_size
      }
    });
  }
  // tslint:disable-next-line:no-any
  onUploadDone = (data: any) => {
    showMessageForResult(data);
  }
  // 查询
  config = (useFor: 'search' | 'create' | 'edit' | 'table' | 'margin') => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('图片名称'),
        dataIndex: 'name',
        formItemRender: () => (useFor === 'create' || useFor === 'edit' ? <Input /> : null),
        formInitialValue: '',
        formRules: rules
      },
      /** 边距设置配置 见git history */
      {
        title: site('图片名称'),
        dataIndex: 'name',
        notInTable: true,
        formItemRender: () => (useFor === 'search' ? <Input /> : null),
        formInitialValue: ''
      },
      {
        title: site('跳转链接'),
        dataIndex: 'link',
        formItemRender: () => (useFor === 'create' || useFor === 'edit' ? <Input /> : null),
        notInTable: true,
        formInitialValue: ''
      },
      {
        title: site('语言'),
        dataIndex: 'language',
        formItemRender: () =>
          useFor === 'create' || useFor === 'edit' ? (
            <LanguageComponent labelInValue={true} placeholder={'请选择语言s'} />
          ) : null,
        render: (text: string, record: FloatAdData) => record.language_name,
        formInitialValue: '',
        formRules: rules
      },
      {
        title: site('缩略图'),
        dataIndex: 'picture',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        key: 'picture',
        render: (text: string, record: FloatAdData) => (
          <span>
            <Thumbnail src={`${environment.imgHost}${record.picture}`} alt="无法正常显示" />
          </span>
        )
      },
      {
        title: site('图片'),
        dataIndex: 'picture',
        formItemRender: () =>
          useFor === 'create' || useFor === 'edit' ? (
            <UploadComponent onChange={this.onUploadDone} />
          ) : null,
        formInitialValue: '',
        notInTable: true,
        formRules: rules
      },
      {
        title: site('显示位置'),
        dataIndex: 'position',
        formItemRender: () =>
          useFor === 'create' || useFor === 'edit' ? (
            <RadioGroup>
              <Radio value={'left-middle'}>{site('左中')}</Radio>
              <Radio value={'right-middle'}>{site('右中')}</Radio>
              <Radio value={'left-bottom'}>{site('左下')}</Radio>
              <Radio value={'right-bottom'}>{site('右下')}</Radio>
            </RadioGroup>
          ) : null,
        formInitialValue: '',
        render: (text: string) => {
          let k: string = '';
          position.forEach((item: { value: string; text: string }) => {
            if (item.value === text) {
              k = item.text;
            }
          });
          return k;
        },
        formRules: rules
      },
      {
        title: site('平台'),
        dataIndex: 'pf',
        formItemRender: () =>
          useFor === 'create' || useFor === 'edit' ? (
            <Select placeholder="请选择">
              <Option value={'pc'}>PC</Option>
            </Select>
          ) : null,
        formInitialValue: '',
        notInTable: true,
        formRules: rules
      },
      {
        title: site('审核状态'),
        dataIndex: 'approve',
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
        formItemRender: () => (useFor === 'create' || useFor === 'edit' ? <Input /> : null),
        formInitialValue: '',
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
        title: site('状态'),
        dataIndex: 'status',
        formInitialValue: '',
        render: (text: string) => {
          if (text === 'enabled') {
            return <Tag className="account-opened">{site('启用')}</Tag>;
          } else {
            return <Tag className="account-close">{site('停用')}</Tag>;
          }
        },
        formItemRender: () =>
          useFor === 'search' ? (
            <Select>
              <Select.Option value="" key="0">
                {site('全部')}
              </Select.Option>
              <Select.Option value="disabled" key="1">
                {site('停用')}
              </Select.Option>
              <Select.Option value="enabled" key="2">
                {site('启用')}
              </Select.Option>
            </Select>
          ) : null
      },
      {
        title: site('操作'),
        dataIndex: '',
        formItemRender: () => (useFor === 'table' ? <Input /> : null),
        render: (text: string, record: FloatAdData) => {
          return (
            <TableActionComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onApply(record)}
                hidden={record.approve !== 'pending'}
              >
                {record.approve === 'pending' ? site('申请') : site('查看')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onStatus(record)}
                hidden={record.approve !== 'pass'}
              >
                {record.status === 'enabled' ? site('停用') : site('启用')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.doEdit(record)}
                hidden={record.approve !== 'pending'}
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
  onDelete = (item: FloatAdData) => {
    this.props
      .dispatch({
        type: 'floatAd/doDelete',
        payload: {
          id: item.id,
          pf: item.pf
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onView = (item: FloatAdData) => {
    this.setState({
      itemObj: item,
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  onApply = (item: FloatAdData) => {
    this.props
      .dispatch({
        type: 'floatAd/doApply',
        payload: {
          id: item.id,
          params: {
            language_id: item.language_id,
            pf: item.pf,
            position: item.position,
            approve: 'applying'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  doEdit = (item: FloatAdData) => {
    this.setState({
      editVisible: !this.state.editVisible,
      editObj: {
        name: item.name,
        pf: item.pf,
        position: item.position,
        link: item.link,
        language: { key: item.language_id, label: item.language_name },
        sort: item.sort,
        picture: item.picture
      },
      actiontype: 'edit',
      id: item.id
    });
  }
  onStatus = (item: FloatAdData) => {
    this.props
      .dispatch({
        type: 'floatAd/doEnable',
        payload: {
          id: item.id,
          params: {
            language_id: item.language_id,
            pf: item.pf,
            position: item.position,
            status: item.status === 'enabled' ? 'disabled' : 'enabled'
          }
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  loadData = () => {
    this.props.dispatch({
      type: 'floatAd/query',
      payload: {
        page: this.props.floatAd.page,
        page_size: this.props.floatAd.page_size,
        pf: this.state.pf
      }
    });
  }
  addCkManage = () => {
    this.setState({
      addVisible: !this.state.addVisible,
      actiontype: 'add'
    });
  }
  closeAdd = (e: object) => {
    this.setState({
      addVisible: !this.state.addVisible
    });
  }
  closeEdit = (e: object) => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  // tslint:disable-next-line:no-any
  handleSubmit = (values: any) => {
    values.language_id = values.language.key;
    values.language_name = values.language.label;
    delete values.language;
    let type: string;
    let data: object;
    if (this.state.actiontype === 'add') {
      type = 'floatAd/doAdd';
      data = values;
    } else {
      type = 'floatAd/doEdit';
      data = { id: this.state.id, params: values };
    }
    return this.props.dispatch({
      type: type,
      payload: data
    });
  }
  onViewCallback = () => {
    this.setState({
      itemObj: {},
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  addMargin = () => {
    this.setState({
      marginVisible: !this.state.marginVisible
    });
  }
  handleMarngin = () => {
    console.log('12');
  }
  handleMarnginCancel = () => {
    this.setState({
      marginVisible: !this.state.marginVisible
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
    const { site = () => null, form, floatAd } = this.props;
    const { addVisible, editVisible, detailViewVisible, editObj, itemObj } = this.state;
    return (
      <div>
        <SearchComponent
          form={form}
          fieldConfig={this.config('search')}
          actionType="floatAd/query"
          pageSize={20}
        />
        <EditFormComponent
          form={form}
          fieldConfig={this.config('create')}
          onSubmit={this.handleSubmit}
          modalTitle={site('新增浮动图')}
          onDone={this.loadData}
          modalVisible={addVisible}
          onCancel={this.closeAdd}
        />
        <EditFormComponent
          form={form}
          fieldConfig={this.config('edit')}
          onSubmit={this.handleSubmit}
          modalTitle={site('编辑浮动图')}
          onDone={this.loadData}
          modalVisible={editVisible}
          onCancel={this.closeEdit}
          values={editObj}
        />
        <WrapRow>
          <Col span={3}>
            <Button type="primary" onClick={this.addMargin}>
              {site('浮动图边距设置')}
            </Button>
          </Col>
          <Col span={3} push={18}>
            <Button type="primary" onClick={this.addCkManage}>
              {site('新增浮动图')}
            </Button>
          </Col>
        </WrapRow>
        <TableComponent
          dataSource={floatAd.data}
          pagination={getPagination(floatAd.attributes, this.onPageChange)}
          columns={this.config('table')}
        />
      </div>
    );
  }
}
