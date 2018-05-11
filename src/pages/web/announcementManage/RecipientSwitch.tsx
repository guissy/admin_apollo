import * as React from 'react';
import { Input } from 'antd';
import { AnnouncementState } from './AnnouncementManage.model';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { throttle } from 'lodash/fp';
import { Dispatch } from 'dva';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { EditConsumer, EditContext } from '../../components/form/EditFormComponent';
import CheckboxComponent from '../../components/checkbox/CheckboxComponent';
import { delay } from 'redux-saga';
interface NoticeState {
  diy: string;
  member: Array<string>;
  agent: string;
}

/** 消息管理新增发送类型和接收类型联动 */
@withLocale
@select('announcementManage')
export default class RecipientSwitch extends React.PureComponent<
  RecipientSwitchProps,
  NoticeState
> {
  unmount: boolean;
  state = {
    diy: '',
    member: [],
    agent: '',
    editContext: { propupType: 1, sendType: 0 }
  };
  onChange = throttle(1500, (value: object) => {
    delay(500).then(() => {
      if (typeof this.props.onChange === 'function') {
        if (!this.unmount) {
          this.props.onChange(value);
        }
      }
    });
  });

  // tslint:disable-next-line:no-any
  input(editContext: Partial<EditContext>, announcementManage: any) {
    const { userLevel } = announcementManage;
    switch (editContext.sendType) {
      case 1:
        return (
          <CheckboxComponent
            formatOut={'array'}
            options={userLevel}
            value={this.props.value && this.props.value.member}
            onChange={value => {
              this.setState({ member: value });
              this.props.onChange({
                member: value,
                agent: 'agent',
                diy: this.state.diy
              });
            }}
          />
        );
      case 2:
        if (this.props.value && this.props.value.agent !== 'agent') {
          this.onChange({
            member: this.state.member,
            agent: 'agent',
            diy: this.state.diy
          });
        }
        return null;
      case 3:
        return (
          <Input.TextArea
            value={this.props.value && this.props.value.diy}
            onChange={e => {
              const value = e.target.value;
              this.setState({ diy: value });
              this.props.onChange({
                member: this.state.member,
                agent: 'agent',
                diy: value
              });
            }}
            placeholder="注:自定义接收人只能是会员用户/账号(多个请用英文逗号隔开)"
          />
        );
      default:
        return '请先选择接收类型';
    }
  }
  componentDidMount() {
    this.unmount = false;
  }
  componentWillUnmount() {
    this.unmount = true;
  }
  render() {
    const { announcementManage } = this.props;
    console.log();
    return (
      <EditConsumer>
        {(editContext: EditContext) => this.input(editContext, announcementManage)}
      </EditConsumer>
    );
  }
}
interface RecipientSwitchProps {
  value?: RecipientValue;
  onChange?: (value: object) => void;
  announcementManage?: AnnouncementState;
}

interface RecipientValue {
  member: Array<string>;
  agent: string;
  diy: string;
}
