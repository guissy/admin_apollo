import * as React from 'react';
import { Form, Radio, Tabs, Select, message, Input, Checkbox } from 'antd';
import { AnnouncementState } from './AnnouncementManage.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import showMessage, { showMessageForResult } from '../../../utils/showMessage';
import { Result } from '../../../utils/result';
import { FormComponent } from '../../components/form/FormCompoent';
import { SearchFormConfig } from '../../components/form/SearchComponent';
import styled from 'styled-components';
import LanguageComponent from '../../components/language/LanguageComponent';
import Editor from '../../components/richTextEditor/Editor';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { WrappedFormUtils } from 'antd/es/form/Form';
import {
  EditConsumer,
  EditFormComponent,
  EditContext
} from '../../components/form/EditFormComponent';
import { DatePicker } from 'antd';
import CheckboxComponent from '../../components/checkbox/CheckboxComponent';
import RecipientSwitch from './RecipientSwitch';
interface NoticeState {
  editContext: Partial<EditContext>;
  newVisible: boolean;
  editVisible: boolean;
  checkedList: Array<string>;
  indeterminate: boolean;
  checkAll: boolean;
}
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
/** 弹出框和接收人联动 */
// tslint:disable-next-line:no-any
function TypesSwitch(props: any) {
  return (
    <EditConsumer>{(editContext: EditContext) => SendTypeSwitch(editContext, props)}</EditConsumer>
  );
}

// tslint:disable-next-line:no-any
function SendTypeSwitch(editContext: EditContext, props: any) {
  switch (editContext.propupType) {
    case 1:
      return (
        <RadioGroup
          value={props.value}
          onChange={e => {
            editContext.setState({ sendType: e.target.value });
            props.onChange(e.target.value);
          }}
        >
          <Radio value={1}>{'会员'}</Radio>
          <Radio value={2}>{'代理'}</Radio>
          <Radio value={3}>{'自定义'}</Radio>
        </RadioGroup>
      );
    case 2:
    case 3:
      return (
        <RadioGroup
          value={props.value}
          onChange={e => {
            editContext.setState({ sendType: e.target.value });
            props.onChange(e.target.value);
          }}
        >
          <Radio value={1}>{'会员'}</Radio>
          <Radio value={2}>{'代理'}</Radio>
        </RadioGroup>
      );
    default:
      return null;
  }
}

/** 弹出类型和内容联动 */
// tslint:disable-next-line:no-any
function ContentSwitch(props: any) {
  return <EditConsumer>{(editContext: EditContext) => Content(editContext, props)}</EditConsumer>;
}
// tslint:disable-next-line:no-any
function Content(editContext: EditContext, props: any) {
  return (
    <div>
      <Input.TextArea hidden={editContext.sendType !== 3} />
      <div hidden={editContext.sendType === 3}>
        <Editor id="212111" value={props.value} onChange={props.onChange} />
      </div>
    </div>
  );
}

/** 公告管理 */
@withLocale
@Form.create()
@select('announcementManage')
export default class AddAnnouncement extends React.PureComponent<NoticeProps, NoticeState> {
  static getDerivedStateFromProps = (nextProps: NoticeProps, prevState: NoticeState) => {
    return {
      newVisible: nextProps.modalVisible
    };
  }
  state = {
    checkedList: [],
    checkAll: false,
    indeterminate: true,
    newVisible: false,
    editVisible: false,
    editContext: { propupType: 1, sendType: 0 }
  };
  config = (useFor: 'login' | 'home' | 'scroll'): SearchFormConfig[] => {
    const { site = () => '', announcementManage } = this.props;
    const rules = () => [{ required: true }];
    return [
      {
        title: '弹出类型',
        dataIndex: 'popup_type',
        formInitialValue: 1,
        formItemRender: () => {
          return (
            <RadioGroup
              onChange={e => this.setState({ editContext: { propupType: e.target.value } })}
            >
              <Radio value={1}>{site('登录弹出')}</Radio>
              <Radio value={2}>{site('首页弹出')}</Radio>
              <Radio value={3}>{site('滚动公告')}</Radio>
            </RadioGroup>
          );
        },
        notInTable: true,
        formRules: rules
      },
      {
        title: site('接收类型'),
        dataIndex: 'send_type',
        formItemRender: () => <TypesSwitch _this={this} />,
        formRules: rules
      },
      {
        title: site('接收人'),
        dataIndex: 'recipient',
        formInitialValue: { member: ['1'], agent: '', diy: '' },
        formItemRender: () => <RecipientSwitch />,
        formRules: rules
      },
      {
        title: site('语言'),
        dataIndex: 'language_id',
        formItemRender: () => <LanguageComponent />,
        formRules: rules
      },
      {
        title: site('标题'),
        dataIndex: 'title',
        formItemRender: () => <Input />,
        formRules: rules
      },
      {
        title: site('文案内容'),
        dataIndex: 'content',

        formItemRender: () => <ContentSwitch _this={this} />,
        formRules: rules
      },
      {
        title: site('起始时间'),
        dataIndex: 'start_time,end_time',
        formInitialValue: '',
        formItemRender: () => <DatePicker.RangePicker />,
        formRules: rules
      }
    ];
  }
  // 保存成功后弹提示
  showMessage = (result: Result<object>) => {
    const { site = () => '' } = this.props;
    if (typeof result === 'object' && 'state' in result) {
      const { state } = result;
      if (state === 0) {
        showMessage(true);
      } else {
        showMessage(false);
        console.info(`🐞: `, result.message);
      }
    } else {
      console.error(
        'modal.ts 中的 effects 其中返回值是从后端拿到 {state:0, message: \'OK\', data: [] } '
      );
    }
  }
  // tslint:disable-next-line:no-any
  onCheckChange = (checkedList: any) => {
    console.log('121', checkedList.length === this.props.announcementManage.userLevel.length);
    this.setState({
      checkedList,
      indeterminate:
        !!checkedList.length && checkedList.length < this.props.announcementManage.userLevel.length,
      checkAll: checkedList.length === this.props.announcementManage.userLevel.length
    });
  }
  // tslint:disable-next-line:no-any
  onCheckAllChange = (e: any) => {
    this.setState({
      checkedList: e.target.checked ? [] : [],
      indeterminate: false,
      checkAll: e.target.checked
    });
  }
  // tslint:disable-next-line:no-any
  onSubmit = (values: any) => {
    if (values.send_type === 1) {
      if (values.recipient.member.length === this.props.announcementManage.userLevel.length) {
        values.recipient = '';
      } else {
        values.recipient = values.recipient.member.join(',');
      }
    } else if (values.send_type === 2) {
      values.recipient = '';
    } else {
      values.recipient = values.recipient.diy;
    }
    return this.props.dispatch!({
      type: 'announcementManage/doAdd',
      payload: values
    });
  }
  loadData = () => {
    this.props.dispatch!({
      type: 'announcementManage/query',
      payload: {
        page: this.props.announcementManage.attributes.number,
        page_size: this.props.announcementManage.attributes.size
      }
    });
  }
  // 点击新增显示模态框
  onNew = () => {
    this.setState({ newVisible: !this.state.newVisible });
  }
  render() {
    const { site = () => '' } = this.props;
    const {
      onSubmit,
      onCancel,
      modalTitle,
      form,
      actionType,
      submitText = site('确定'),
      onDone
    } = this.props;
    const { getFieldDecorator } = form;
    const { newVisible, editVisible, editContext } = this.state;
    return (
      <EditFormComponent
        form={form}
        fieldConfig={this.config('login')}
        modalTitle={site('新增公告')}
        onSubmit={this.onSubmit}
        onDone={this.loadData}
        modalVisible={newVisible}
        onCancel={onCancel}
        editContext={editContext}
      />
    );
  }
}
interface NoticeProps {
  dispatch?: Dispatch;
  form?: any; // tslint:disable-line:no-any
  actionType?: string; // namespace/effect
  modalTitle?: string | React.ReactNode; // 模态框标题
  submitText?: string; // 确认按钮文字
  modalVisible?: boolean; // 是否显示模态框
  site?: (words: IntlKeys) => string;
  values?: object; // 当前行要编辑的记录
  onSubmit?: (values: object) => Promise<Result<object> | void>; // 提交事件，返回Promise，用于关闭模态框，清理表单
  onCancel?: (e: React.MouseEvent<HTMLButtonElement>) => void; // 关闭事件
  onDone?: (result: Result<object> | void) => void; // onSubmit后的回调
  announcementManage: AnnouncementState;
}
