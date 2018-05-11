import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import { MemberInformationState } from './Information.model';
import styled from 'styled-components';
import { showMessageForResult } from '../../../../utils/showMessage';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { Row, Col, Form, Input, Button, Select, message } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const InformationCon = styled.div`
  .button-con {
    text-align: center;
  }
`;

interface Props {
  site?: (p: IntlKeys) => React.ReactNode;
  userId: number;
  // tslint:disable-next-line:no-any
  dispatch?: Dispatch | any;
  // tslint:disable-next-line:no-any
  memberInformation?: MemberInformationState | any;
  // tslint:disable-next-line:no-any
  form?: any;
}
interface State {}

@withLocale
@select('memberInformation')
@Form.create()
// tslint:disable-next-line:top-level-comment
export default class Information extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
  }
  componentWillMount() {
    this.props.dispatch({
      type: 'memberInformation/loadData',
      payload: {
        id: this.props.userId
      }
    });
    this.props.dispatch({
      type: 'memberInformation/loadQuestion'
    });
  }
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.userId !== this.props.userId) {
      // 清除表单
      this.props.form.resetFields();
      this.props
        .dispatch({
          type: 'memberInformation/loadData',
          payload: {
            id: nextProps.userId
          }
        })
        .then(() => {
          console.log(this.props.memberInformation);
        });
    }
  }
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // tslint:disable-next-line:no-any
    this.props.form.validateFieldsAndScroll((err: any, values: any) => {
      if (!err) {
        let memberControl = JSON.parse(sessionStorage.joys_userInfo).member_control;
        // tslint:disable-next-line:no-any
        let param: any = {};
        // tslint:disable-next-line:no-any
        let obj: any = {};
        if (memberControl.true_name) {
          obj.name = values.truename;
        }
        if (memberControl.idcard) {
          obj.idcard = values.idcard;
        }
        if (memberControl.mobile) {
          obj.mobile = values.mobile;
        }
        if (memberControl.qq) {
          obj.qq = values.qq;
        }
        if (memberControl.weixin) {
          obj.weixin = values.weixin;
        }
        if (memberControl.email) {
          obj.email = values.email;
        }
        if (memberControl.skype) {
          obj.skype = values.skype;
        }
        if (memberControl.nationality) {
          obj.postcode = values.postcode;
        }
        if (memberControl.address) {
          obj.address = values.address;
        }
        if (memberControl.answer) {
          obj.qid = values.qid;
          obj.answer = values.answer;
        }
        obj.comment = values.comment;
        param.id = this.props.userId;
        param.obj = obj;
        this.props
          .dispatch({
            type: 'memberInformation/saveInformation',
            payload: param
          })
          .then(showMessageForResult);
      }
    });
  }
  render() {
    // 权限
    let memberControl = JSON.parse(sessionStorage.joys_userInfo).member_control;
    const { getFieldDecorator } = this.props.form;
    const { site = () => null } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 }
      }
    };
    const formItemTextareaLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 3 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 21 }
      }
    };
    // tslint:disable-next-line:no-any
    const answerList = this.props.memberInformation.answerArr.map((option: any) => {
      return (
        <Option value={option.id} key={option.id}>
          {option.question}
        </Option>
      );
    });
    return (
      <InformationCon>
        <Form onSubmit={this.onSubmit}>
          <Row type="flex">
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('用户名')}>
                <span>{this.props.memberInformation.userInfoObj.username}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('ID')}>
                <span>{this.props.memberInformation.userInfoObj.id}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('标签')}>
                <span>{this.props.memberInformation.userInfoObj.tags}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('真实姓名')}>
                {getFieldDecorator('truename', {
                  initialValue: this.props.memberInformation.userInfoObj.truename
                })(<Input disabled={!memberControl.true_name} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('登陆密码')}>
                <span>****</span>
                <Button size="small">{site('重置')}</Button>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('取款密码')}>
                <span>****</span>
                <Button size="small">{site('重置')}</Button>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('用户类型')}>
                <span>{this.props.memberInformation.userInfoObj.user_type}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('会员层级')}>
                <span>{this.props.memberInformation.userInfoObj.level}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('注册时间')}>
                <span>{this.props.memberInformation.userInfoObj.created}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('最后登陆时间')}>
                <span>{this.props.memberInformation.userInfoObj.last_login}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('注册ip')}>
                <span>{this.props.memberInformation.userInfoObj.ip}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('最后登陆ip')}>
                <span>{this.props.memberInformation.userInfoObj.last_ip}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('注册来源')}>
                <span>{this.props.memberInformation.userInfoObj.channel}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('国家')}>
                <span>{this.props.memberInformation.userInfoObj.country}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('省市')}>
                <span>
                  {this.props.memberInformation.userInfoObj.province +
                    this.props.memberInformation.userInfoObj.city}
                </span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('国籍')}>
                <span>{this.props.memberInformation.userInfoObj.nationality}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('货币')}>
                <span>{this.props.memberInformation.userInfoObj.ctype}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('语言')}>
                <span>{this.props.memberInformation.userInfoObj.language_name}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('生日')}>
                <span>{this.props.memberInformation.userInfoObj.brith}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('性别')}>
                <span>{this.props.memberInformation.userInfoObj.sex}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('身份证号码')}>
                {getFieldDecorator('idcard', {
                  initialValue: this.props.memberInformation.userInfoObj.idcard
                })(<Input disabled={!memberControl.idcard} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('手机')}>
                {getFieldDecorator('mobile', {
                  initialValue: this.props.memberInformation.userInfoObj.mobile
                })(<Input disabled={!memberControl.mobile} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('QQ')}>
                {getFieldDecorator('qq', {
                  initialValue: this.props.memberInformation.userInfoObj.qq
                })(<Input disabled={!memberControl.qq} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('微信')}>
                {getFieldDecorator('weixin', {
                  initialValue: this.props.memberInformation.userInfoObj.weixin
                })(<Input disabled={!memberControl.weixin} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('邮箱')}>
                {getFieldDecorator('email', {
                  initialValue: this.props.memberInformation.userInfoObj.email
                })(<Input disabled={!memberControl.email} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('skype')}>
                {getFieldDecorator('skype', {
                  initialValue: this.props.memberInformation.userInfoObj.skype
                })(<Input disabled={!memberControl.skype} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('地址')}>
                {getFieldDecorator('address', {
                  initialValue: this.props.memberInformation.userInfoObj.address
                })(<Input disabled={!memberControl.address} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('邮编')}>
                {getFieldDecorator('postcode', {
                  initialValue: this.props.memberInformation.userInfoObj.postcode
                })(<Input disabled={!memberControl.nationality} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('安全问题')}>
                {getFieldDecorator('qid', {
                  initialValue: this.props.memberInformation.userInfoObj.question_id
                })(<Select disabled={!memberControl.answer}>{answerList}</Select>)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('安全答案')}>
                {getFieldDecorator('answer', {
                  initialValue: this.props.memberInformation.userInfoObj.answer
                })(<Input disabled={!memberControl.answer} />)}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem {...formItemTextareaLayout} label={site('备注')}>
                {getFieldDecorator('comment', {
                  initialValue: this.props.memberInformation.userInfoObj.comment
                })(<TextArea />)}
              </FormItem>
            </Col>
          </Row>
          <Row className="button-con">
            <Button htmlType="submit" type="primary">
              {site('保存基本资料')}
            </Button>
          </Row>
        </Form>
      </InformationCon>
    );
  }
}
