import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import environment from '../../../utils/environment';
import { Button, Col, Form, Input, Radio, Row, Select, Table, Tag } from 'antd';
import styled from 'styled-components';
import { AdListState, AdListData } from './AdList.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { FormComponentProps } from 'antd/lib/form';
import DetailModal, { ViewFormConfig } from '../../components/modal/DetailModal';
import UploadComponent from '../../components/upload/UploadComponent';
import LanguageComponent from '../../components/language/LanguageComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import { showMessageForResult } from '../../../utils/showMessage';

interface Props extends FormComponentProps {
  dispatch: Dispatch;
  adList: AdListState;
  site: (p: IntlKeys) => React.ReactNode;
  form: WrappedFormUtils;
}
interface State {}
const Option = Select.Option;
const RadioGroup = Radio.Group;
const Thumbnail = styled.img`
  height: 20px;
  width: auto;
`;
const WrapRow = styled(Row)`
  margin-bottom: 10px;
`;
const position: Array<{ value: string; text: string }> = [
  { text: '首页', value: 'home' },
  { text: '电子页', value: 'egame' },
  { text: '体育页', value: 'sport' },
  { text: '代理页', value: 'agent' },
  { text: '优惠页', value: 'coupon' }
];
const TodoItems = position.map(todo => (
  <Option value={todo.value} key={todo.value}>
    {todo.text}
  </Option>
));
/** 轮播广告 */
@withLocale
@select('adList')
@Form.create()
export default class AdList extends React.PureComponent<Props, State> {
  state = {
    pf: 'pc',
    actiontype: '',
    editVisible: false,
    detailViewVisible: false,
    addVisible: false,
    name: '',
    itemObj: {},
    editObj: {},
    title: '',
    id: ''
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'adList/query',
      payload: {
        page: '1',
        page_size: this.props.adList.page_size,
        pf: this.state.pf
      }
    });
  }
  config = (useFor: 'create' | 'edit' | 'table' | 'view'): ViewFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: site('轮播广告名称'),
        dataIndex: 'name',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('使用平台'),
        dataIndex: 'pf',
        notInTable: true,
        formItemRender: () => (
          <Select>
            <Option value={'pc'}>PC</Option>
            <Option value={'h5'}>H5</Option>
          </Select>
        ),
        formRules: rules
      },
      {
        title: site('使用于'),
        dataIndex: 'position',
        formItemRender: () => (useFor !== 'table' ? <Select>{TodoItems}</Select> : null),
        render: (text: string, record: object) => {
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
        title: site('缩略图'),
        dataIndex: 'picture',
        formItemRender: () => (useFor === 'table' ? <Select>{TodoItems}</Select> : null),
        render: (text: string, record: AdListData) => (
          <span>
            <Thumbnail src={`${environment.imgHost}${record.picture}`} alt="无法正常显示" />
          </span>
        )
      },
      {
        title: site('跳转链接'),
        dataIndex: 'link',
        formItemRender: () => (useFor !== 'table' ? <Input /> : null),
        formRules: () => [
          {
            type: 'url',
            message: '网址格式为http://www.***.com或者https://www.***.com'
          }
        ],
        notInTable: true
      },
      {
        title: site('语言'),
        dataIndex: 'language',
        formItemRender: () =>
          useFor === 'create' || useFor === 'edit' ? (
            <LanguageComponent labelInValue={true} />
          ) : null,
        render: (text: string, record: AdListData) => record.language_name,
        formRules: rules
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
        title: site('轮播图片'),
        dataIndex: 'picture',
        formItemRender: () =>
          useFor !== 'table' ? (
            <UploadComponent onChange={this.onUploadDone} folder={'adlist'} />
          ) : null,
        formRules: rules,
        notInTable: true
      },
      {
        title: site('操作'),
        dataIndex: '',
        formItemRender: () => null,
        notInView: true,
        render: (text: string, record: AdListData) => {
          return (
            <TableActionComponent>
              <LinkComponent
                confirm={true}
                onClick={() => this.onView(record)}
                hidden={record.approve === 'pending'}
              >
                {record.approve === 'pending' ? site('申请') : site('查看')}
              </LinkComponent>
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
                onClick={() => this.onEdit(record)}
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
        type: 'adList/query',
        payload: {
          page: 1,
          page_size: 20,
          pf: e.target.value
        }
      });
    }
  }
  onDelete = (item: AdListData) => {
    this.props
      .dispatch({
        type: 'adList/doDelete',
        payload: {
          id: item.id,
          pf: item.pf
        }
      })
      .then(data => showMessageForResult(data))
      .then(() => this.loadData());
  }
  onView = (item: AdListData) => {
    this.setState({
      itemObj: item,
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  onApply = (item: AdListData) => {
    this.props
      .dispatch({
        type: 'adList/doApply',
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
  onEdit = (item: AdListData) => {
    this.setState({
      actiontype: 'edit',
      editVisible: true,
      editObj: {
        name: item.name,
        pf: item.pf,
        position: item.position,
        link: item.link,
        language: { key: item.language_id, label: item.language_name },
        sort: item.sort,
        picture: item.picture
      },
      id: item.id
    });
  }
  closeEdit = () => {
    this.setState({
      editVisible: !this.state.editVisible
    });
  }
  onStatus = (item: AdListData) => {
    this.props
      .dispatch({
        type: 'adList/doEnable',
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
  handleCancel = (e: object) => {
    this.setState({
      visible: false
    });
  }
  addAdlist = () => {
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
    values.language_id = values.language.key;
    values.language_name = values.language.label;
    delete values.language;
    let type: string;
    let data: object;
    let title: string;
    if (this.state.actiontype === 'add') {
      type = 'adList/doAdd';
      data = values;
    } else {
      type = 'adList/doEdit';
      data = { id: this.state.id, params: values };
    }
    return this.props.dispatch({
      type: type,
      payload: data
    });
  }
  loadData = () => {
    this.props.dispatch({
      type: 'adList/query',
      payload: {
        page: this.props.adList.attributes.number,
        page_size: this.props.adList.attributes.size,
        pf: this.state.pf
      }
    });
  }
  onViewCallback = () => {
    this.setState({
      itemObj: {},
      detailViewVisible: !this.state.detailViewVisible
    });
  }
  onPageChange = (page: number, pageSize: number) => {
    return this.props.dispatch!({
      type: 'adList/query',
      payload: {
        page: page,
        page_size: pageSize,
        pf: this.state.pf
      }
    });
  }
  render() {
    const { site = () => null, form, adList } = this.props;
    const { addVisible, editVisible, editObj, detailViewVisible, itemObj } = this.state;
    return (
      <div>
        <WrapRow>
          <Col span={3}>
            <RadioGroup onChange={this.handleChange} value={this.state.pf}>
              <Radio value={'pc'}>pc</Radio>
              <Radio value={'h5'}>h5</Radio>
            </RadioGroup>
          </Col>
          <Col span={3} push={18}>
            <Button type="primary" onClick={this.addAdlist}>
              {site('新增轮播广告')}
            </Button>
          </Col>
        </WrapRow>
        <EditFormComponent
          form={form}
          fieldConfig={this.config('create')}
          modalTitle={site('新增轮播广告')}
          modalVisible={addVisible}
          onDone={this.loadData}
          onSubmit={this.handleSubmit}
          onCancel={this.closeAdd}
        />
        <EditFormComponent
          form={form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑轮播广告')}
          modalVisible={editVisible}
          values={editObj}
          onDone={this.loadData}
          onSubmit={this.handleSubmit}
          onCancel={this.closeEdit}
        />
        <TableComponent
          dataSource={adList.data}
          pagination={getPagination(adList.attributes, this.onPageChange)}
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
