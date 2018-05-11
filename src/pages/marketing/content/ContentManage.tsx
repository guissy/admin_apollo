import * as React from 'react';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { ContentManageState, Record, Type } from './ContentManage.model';
import { Form, Tag, Input, Select, Radio, DatePicker } from 'antd';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { EditFormComponent } from '../../components/form/EditFormComponent';
import UploadComponent from '../../components/upload/UploadComponent';
import Editor from '../../components/richTextEditor/Editor';
import TableComponent, { getPagination } from '../../components/table/TableComponent';
import TableActionComponent from '../../components/table/TableActionComponent';
import LinkComponent from '../../components/link/LinkComponent';
import environment from '../../../utils/environment';
import { naturalNumPattern } from '../../../utils/formRule';
import { SearchComponent, SearchFormConfig } from '../../components/form/SearchComponent';
import LanguageComponent from '../../components/language/LanguageComponent';
import { RadioChangeEvent } from 'antd/lib/radio/interface';
import { showMessageForResult } from '../../../utils/showMessage';
import { WrappedFormUtils } from 'antd/es/form/Form';
import CheckboxComponent from '../../components/checkbox/CheckboxComponent';
import ButtonBarComponent from '../../components/buttonBar/ButtonBarComponent';
import { Result } from '../../../utils/result';

interface Props {
  dispatch: Dispatch;
  contentManage: ContentManageState;
  form?: WrappedFormUtils;
  site?: (p: IntlKeys) => string;
}
interface State {
  editVisible: boolean;
  addVisible: boolean;
  radioValue: string;
  types: Array<string>;
  edit: object;
  page: number;
  pageSize: number;
}

/** 手动优惠 */
@withLocale
@Form.create()
@select('contentManage')
export default class ContentManage extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      editVisible: false,
      addVisible: false,
      radioValue: '0',
      types: [],
      edit: {},
      page: 1,
      pageSize: 10
    };
  }
  componentWillMount() {
    this.loadTableData();
    this.getTypes();
  }
  loadTableData = (page: number = this.state.page, pageSize: number = this.state.pageSize) => {
    this.props.dispatch({
      type: 'contentManage/loadData',
      payload: {
        page: page,
        page_size: pageSize
      }
    });
  }
  onChange = (page: number, pageSize: number) => {
    this.setState({
      page,
      pageSize
    });
    this.loadTableData(page, pageSize);
  }
  doStart = (data: Record) => {
    this.props
      .dispatch({
        type: 'contentManage/doStart',
        payload: {
          id: data.id,
          status: 'enabled'
        }
      })
      .then(res => showMessageForResult(res, '启用成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  doStop = (data: Record) => {
    this.props
      .dispatch({
        type: 'contentManage/doStart',
        payload: {
          id: data.id,
          status: 'disabled'
        }
      })
      .then(res => showMessageForResult(res, '停用成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  doDelete = (data: Record) => {
    this.props
      .dispatch({
        type: 'contentManage/doDelete',
        payload: {
          id: data.id,
          name: data.name
        }
      })
      .then(res => showMessageForResult(res, '删除成功'))
      .then(() => {
        this.loadTableData();
      });
  }
  getTypes = () => {
    return this.props.dispatch({
      type: 'contentManage/getTypes',
      payload: {
        page: 1,
        page_size: 100
      }
    });
  }
  doAdd = () => {
    this.setState({
      addVisible: true
    });
  }
  doEdit = (record: Record) => {
    this.setState({ editVisible: true });
    this.props
      .dispatch({
        type: 'contentManage/getEditData',
        payload: { id: record.id }
      })
      .then(result => {
        if (result.data && result.state === 0) {
          this.setState({
            radioValue: result.data.open_mode,
            edit: {
              ...result.data,
              language: { key: result.data.language_id, label: result.data.language_name },
              types: result.data.types
            }
          });
        }
      });
  }
  config = (useFor: 'create' | 'edit' | 'table'): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    const rules = () => [{ required: true }];
    const ruleNumber = () => [
      { required: true },
      { pattern: naturalNumPattern(), message: site('请输入非负整数') }
    ];
    return [
      {
        title: 'id',
        dataIndex: 'id',
        notInTable: true,
        formItemRender: () => (useFor === 'edit' ? <input type="hidden" /> : null)
      },
      {
        title: site('优惠类型'),
        dataIndex: 'types',
        render: (text: string, record: Record) => {
          const types = record.types.map((item: { name: string }, index: number) => (
            <span key={index}>{item.name}</span>
          ));
          return <div>{types}</div>;
        },
        formItemRender: () => (
          <CheckboxComponent
            options={this.props.contentManage.types}
            name="name"
            formatOut={['name', 'id']}
          />
        ),
        formRules: rules
      },
      {
        title: site('优惠活动名称'),
        dataIndex: 'name',
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        title: site('优惠活动标题'),
        dataIndex: 'title',
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        dataIndex: 'cover',
        title: site('活动图片'),
        render: (text: string) => {
          const src = `${environment.imgHost}${text}`;
          return <img src={src} style={{ height: '20px' }} />;
        },
        formItemRender: () => null
      },
      {
        title: site('开始时间'),
        dataIndex: 'begin_time,end_time',
        render: (text: string, record: Record) => record.begin_time,
        formItemRender: () => <DatePicker.RangePicker />
      },
      {
        title: site('结束时间'),
        dataIndex: 'end_time',
        formItemRender: () => null
      },
      {
        title: site('语言'),
        dataIndex: 'language',
        formItemRender: () => <LanguageComponent labelInValue={true} />,
        render: (text: string, record: Record) => record.language_name,
        formRules: rules
      },
      {
        title: site('优惠活动描述'),
        dataIndex: 'description',
        formItemRender: () => <Input.TextArea />,
        formRules: rules
      },
      {
        title: site('优惠活动页'),
        dataIndex: 'cover',
        notInTable: true,
        formItemRender: () => <UploadComponent onDone={this.uploadDone} />,
        formRules: rules
      },
      {
        title: site('排序'),
        dataIndex: 'sort',
        notInTable: true,
        formItemRender: () => <Input />,
        formRules: ruleNumber
      },
      {
        title: site('打开方式'),
        dataIndex: 'open_mode',
        notInTable: true,
        formItemRender: () => {
          return (
            <Radio.Group onChange={this.onRadioChange}>
              <Radio value={'1'}>{site('新窗口')}</Radio>
              <Radio value={'2'}>{site('本页面跳转')}</Radio>
              <Radio value={'4'}>{site('下拉展开')}</Radio>
            </Radio.Group>
          );
        },
        formRules: rules
      },
      {
        title: site('链接'),
        dataIndex: 'link',
        notInTable: true,
        formItemRender: () => (this.state.radioValue !== '4' ? <Input /> : null),
        formRules: rules
      },
      {
        title: site('PC优惠规则编辑'),
        dataIndex: 'content',
        notInTable: true,
        formItemRender: () =>
          this.state.radioValue === '4' ? <Editor id={'contentpc'} value={''} /> : null,
        formRules: rules
      },
      {
        title: site('h5优惠规则编辑'),
        dataIndex: 'content2',
        notInTable: true,
        formItemRender: () =>
          this.state.radioValue === '4' ? <Editor id={'contenth5'} value={''} /> : null,
        formRules: rules
      },
      {
        title: site('会员申请次数'),
        dataIndex: 'apply_times',
        notInTable: true,
        formItemRender: () => <Input />,
        formRules: ruleNumber
      },
      {
        dataIndex: 'created',
        title: site('建立时间'),
        formItemRender: () => null
      },
      {
        dataIndex: 'created_uname',
        title: site('建立人'),
        formItemRender: () => null
      },
      {
        dataIndex: 'updated',
        title: site('最后修改时间'),
        formItemRender: () => null
      },
      {
        dataIndex: 'updated_uname',
        title: site('修改人'),
        formItemRender: () => null
      },
      {
        title: site('状态'),
        dataIndex: 'status',
        render: (text: string) => {
          const STATUS = {
            enabled: <Tag className="audit-ed">{site('启用')}</Tag>,
            disabled: <Tag className="audit-refused">{site('停用')}</Tag>
          };
          return <div>{STATUS[text]}</div>;
        },
        formItemRender: () => {
          return (
            <Select defaultValue="enabled" style={{ width: 120 }}>
              <Select.Option value="enabled">{site('启用')}</Select.Option>
              <Select.Option value="disabled">{site('停用')}</Select.Option>
            </Select>
          );
        },
        formRules: rules
      },
      {
        dataIndex: '',
        title: site('操作'),
        formItemRender: () => null,
        render: (text: string, record: Record) => {
          const { status = '' } = record;
          return (
            <TableActionComponent>
              <LinkComponent
                confirm={true}
                hidden={status !== 'disabled'}
                onClick={() => this.doStart(record)}
              >
                {site('启用')}
              </LinkComponent>
              <LinkComponent
                confirm={true}
                hidden={status === 'disabled'}
                onClick={() => this.doStop(record)}
              >
                {site('停用')}
              </LinkComponent>
              <a onClick={() => this.doEdit(record)}>{site('修改')}</a>
              <LinkComponent confirm={true} onClick={() => this.doDelete(record)}>
                {site('删除')}
              </LinkComponent>
            </TableActionComponent>
          );
        }
      },
      {
        dataIndex: 'memo',
        title: site('备注'),
        formItemRender: () => null
      }
    ];
  }
  cancel = (value: string) => {
    value === 'editVisible'
      ? this.setState({
          editVisible: false
        })
      : this.setState({
          addVisible: false
        });
  }
  onSubmit = (values: Record & { language: { label: string; key: string } }) => {
    values.language_name = values.language.label;
    values.language_id = values.language.key;
    delete values.language;
    this.setState({
      editVisible: false
    });
    if (this.state.editVisible) {
      return this.props
        .dispatch({
          type: 'contentManage/submitEditData',
          payload: {
            id: values.id,
            data: values
          }
        })
        .then(res => showMessageForResult(res, '编辑成功'))
        .then(() => {
          this.loadTableData();
        });
    } else {
      return this.props
        .dispatch({
          type: 'contentManage/submitAddData',
          payload: values
        })
        .then(res => showMessageForResult(res, '新增成功'))
        .then(() => {
          this.loadTableData();
        });
    }
  }
  onRadioChange = (e: RadioChangeEvent) => {
    this.setState({
      radioValue: e.target.value
    });
  }
  uploadDone = (result: Result<object>) => {
    showMessageForResult(result, '上传成功');
  }
  // 查询
  searchConfig = (): SearchFormConfig[] => {
    const { site = () => '' } = this.props;
    return [
      {
        title: site('优惠类型'),
        dataIndex: 'type_id',
        formItemRender: () => {
          const options = this.props.contentManage.types.map((item: Type) => (
            <Select.Option value={item.id} key={item.id}>
              {item.name}
            </Select.Option>
          ));
          return (
            <Select style={{ width: 120 }} placeholder={site('请选择')}>
              {options}
            </Select>
          );
        }
      },
      {
        title: site('优惠活动名称'),
        dataIndex: 'name',
        formItemRender: () => <Input />
      }
    ];
  }
  render() {
    const { site = () => '', contentManage = {} as ContentManageState } = this.props;
    const { editVisible, addVisible } = this.state;
    return (
      <div>
        {/* 搜索 */}
        <SearchComponent
          form={this.props.form}
          fieldConfig={this.searchConfig()}
          actionType="contentManage/loadData"
          pageSize={30}
        />
        {/* 新增按钮 */}
        <ButtonBarComponent onCreate={this.doAdd} />
        {/* 手动优惠列表 */}
        <TableComponent
          dataSource={contentManage.data}
          columns={this.config('table')}
          form={this.props.form}
          pagination={getPagination(contentManage.attributes, this.onChange)}
        />
        {/* 编辑 */}
        <EditFormComponent
          form={this.props.form}
          fieldConfig={this.config('edit')}
          modalTitle={site('编辑')}
          modalVisible={editVisible}
          onCancel={() => this.cancel('editVisible')}
          onSubmit={this.onSubmit}
          values={this.state.edit}
        />
        {/* 新增 */}
        {contentManage.types.length > 0 && (
          <EditFormComponent
            form={this.props.form}
            fieldConfig={this.config('create')}
            modalTitle={site('新增')}
            modalVisible={addVisible}
            onCancel={() => this.cancel('addVisible')}
            onSubmit={this.onSubmit}
          />
        )}
      </div>
    );
  }
}
