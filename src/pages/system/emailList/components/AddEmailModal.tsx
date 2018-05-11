import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import Editor from '../../../components/richTextEditor/Editor';
import {
  Table,
  Icon,
  Divider,
  Tag,
  Checkbox,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Select,
  Input,
  message
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import withLocale from '../../../../utils/withLocale';
import { IntlKeys } from '../../../../locale/zh_CN';
import { userLevels } from '../EmailList.service';
import showMessage, { messageError } from '../../../../utils/showMessage';
const Option = Select.Option;
const FormItem = Form.Item;
const { TextArea } = Input;

interface Props {
  dispatch?: Dispatch;
  // tslint:disable-next-line:no-any
  form?: any;
  site?: (p: IntlKeys) => React.ReactNode;
  visible: boolean;
  onChange: Function;
}

interface UserLevelsItem {
  admin_id: null;
  comment: null;
  created: string;
  deposit_etime: string;
  deposit_max: string;
  deposit_min: string;
  deposit_money: string;
  deposit_stime: string;
  deposit_times: string;
  id: string;
  level_id: null;
  max_deposit_money: string;
  memo: string;
  name: string;
  num: string;
  register_etime: string;
  register_stime: string;
  t_default: string;
  tid: string;
  updated: string;
  withdraw_count: string;
  withdraw_times: string;
}

interface State {
  userLevels: Array<UserLevelsItem>;
}

/** 添加邮件modal */
@Form.create()
@withLocale
@select('emailList')
export default class AddEmailModal extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      userLevels: []
    };
  }

  componentWillMount() {
    const result = userLevels();
    // tslint:disable-next-line:no-any
    result.then((res: any) => {
      if (res.state === 0) {
        this.setState({
          userLevels: res.data
        });
      }
    });
  }

  onSubmit = () => {
    const { site = () => null } = this.props;
    const { getFieldsValue, validateFields } = this.props.form;
    const submitData = getFieldsValue();
    // tslint:disable-next-line:no-any
    validateFields((err: any, values: any) => {
      if (!err) {
        submitData.hyper_text === 1
          ? (submitData.hyper_text = true)
          : (submitData.hyper_text = false);
        submitData.type_value = '1';
        this.props.dispatch!({
          type: 'emailList/addEmail',
          payload: submitData
        });
        this.props.onChange(false);
        this.props.form.resetFields();
      } else {
        messageError('表单校验不通过');
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { site = () => '' } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
      }
    };

    return (
      <div>
        <Modal
          title={site('新增邮件')}
          width="70%"
          onOk={this.onSubmit}
          onCancel={() => {
            this.props.onChange(false);
            this.props.form.resetFields();
          }}
          visible={this.props.visible}
          bodyStyle={{ height: '700px', overflow: 'scroll' }}
        >
          <Form>
            <FormItem {...formItemLayout} label={site('超文本格式')}>
              {getFieldDecorator('hyper_text', {
                initialValue: 1
              })(
                <Select>
                  <Option value={1}>是</Option>
                  <Option value={2}>否</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={site('邮件标题')}>
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮件标题'
                  }
                ],
                initialValue: ''
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={site('邮件内容')}>
              {getFieldDecorator('content', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮件内容'
                  }
                ],
                initialValue: 'test'
              })(<Editor id={'content'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label={site('发送类型')}>
              {getFieldDecorator('send_type', {
                initialValue: 1,
                rules: [
                  {
                    required: true,
                    message: '请选择发送类型'
                  }
                ]
              })(
                <Select>
                  <Option value={1}>{site('会员层级')}</Option>
                  <Option value={2}>{site('代理')}</Option>
                  <Option value={3}>{site('自定义')}</Option>
                </Select>
              )}
            </FormItem>
            {getFieldValue('send_type') === 1 ? (
              <FormItem {...formItemLayout} label={site('会员层级')}>
                {getFieldDecorator('type_value', {
                  rules: [
                    {
                      required: true,
                      message: '请选择会员层级'
                    }
                  ],
                  initialValue: ''
                })(
                  <Select>
                    {this.state.userLevels.map(item => {
                      return (
                        <Option value={item.id} key={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            ) : (
              ''
            )}
            {getFieldValue('send_type') === 2 ? (
              <FormItem {...formItemLayout} label={site('选择代理')}>
                {getFieldDecorator('type_value', {
                  initialValue: '1'
                })(<Checkbox>{site('全部代理')}</Checkbox>)}
              </FormItem>
            ) : (
              ''
            )}
            {getFieldValue('send_type') === 3 ? (
              <FormItem {...formItemLayout} label={site('自定义接收人')}>
                {getFieldDecorator('type_value', {
                  rules: [
                    {
                      required: true,
                      message: '请输入自定义接收人'
                    }
                  ],
                  initialValue: ''
                })(<TextArea rows={3} />)}
              </FormItem>
            ) : (
              ''
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}
