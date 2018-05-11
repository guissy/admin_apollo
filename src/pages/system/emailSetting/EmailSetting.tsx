import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import styled from 'styled-components';
import {
  Radio,
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
  Card,
  message
} from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { EmailSettingState } from './EmailSetting.model';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { messageError } from '../../../utils/showMessage';
const FormItem = Form.Item;
const { Option } = Select;

const Wrap = styled.div`
  width: 100%;
`;
const Content = styled(Card)`
  width: 500px;
  height: 300px;
  margin: 0 auto;
`;
const SubmitWrap = styled.div`
  display: flex;
  justify-content: flex-end;
`;
const SaveBtn = styled(Button)`
  margin-right: 40px;
`;

interface Props {
  dispatch: Dispatch;
  form: WrappedFormUtils;
  emailSetting: EmailSettingState;
  site: (p: IntlKeys) => React.ReactNode;
}

interface State {
  is_ssl: string;
  mailaddress: string;
  mailhost: string;
  mailname: string;
  mailpass: string;
  mailport: string;
  verification: string;
  isLoading: boolean;
}

/** 邮件服务器 */
@withLocale
@Form.create()
@select('emailSetting')
export default class EmailSetting extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      is_ssl: '',
      mailaddress: '',
      mailhost: '',
      mailname: '',
      mailpass: '',
      mailport: '',
      verification: '',
      isLoading: false
    };
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps: Props) {
    this.setState({
      ...nextProps.emailSetting
    });
  }

  loadData = () => {
    this.props.dispatch({
      type: 'emailSetting/loadData',
      payload: {}
    });
  }

  onSubmit = () => {
    const { validateFields, getFieldsValue } = this.props.form;
    validateFields((err, values) => {
      if (!err) {
        this.setState({
          ...this.state,
          isLoading: true
        });
        this.props
          .dispatch({
            type: 'emailSetting/saveSetting',
            payload: getFieldsValue()
          })
          .then(() => {
            this.setState({
              isLoading: false
            });
          });
      } else {
        messageError('表单校验不通过');
      }
    });
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      }
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <Form>
        <Wrap>
          <Content>
            <FormItem {...formItemLayout} label={this.props.site('SMTP服务器')}>
              {getFieldDecorator('mailhost', {
                rules: [
                  {
                    required: true,
                    message: '请选择SMTP服务器类型'
                  }
                ],
                initialValue: this.state.mailhost
              })(
                <Select>
                  <Option value="smtp.gmail.com">{this.props.site('gmail谷歌邮箱服务器')}</Option>
                  <Option value="smtp.qq.com">{this.props.site('qq邮箱服务器')}</Option>
                  <Option value="smtp.mail.yahoo.com">{this.props.site('yahoo邮箱服务器')}</Option>
                  <Option value="smtp.163.com">{this.props.site('163邮箱服务器')}</Option>
                </Select>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label={this.props.site('邮箱地址')}>
              {getFieldDecorator('mailaddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱地址'
                  }
                ],
                initialValue: this.state.mailaddress
              })(<Input />)}
            </FormItem>
            <FormItem {...formItemLayout} label={this.props.site('邮箱密码')}>
              {getFieldDecorator('mailpass', {
                rules: [
                  {
                    required: true,
                    message: '请输入邮箱密码'
                  }
                ],
                initialValue: this.state.mailpass
              })(<Input />)}
            </FormItem>
            <SubmitWrap>
              <SaveBtn loading={this.state.isLoading} onClick={this.onSubmit} type="primary">
                {this.props.site('保存')}
              </SaveBtn>
            </SubmitWrap>
          </Content>
        </Wrap>
      </Form>
    );
  }
}
