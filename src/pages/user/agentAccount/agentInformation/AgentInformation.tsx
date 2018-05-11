import * as React from 'react';
import { select } from '../../../../utils/model';
import { connect, Dispatch } from 'dva';
import { AgentInformationState, AgentInformationData } from './AgentInformation.model';
import styled from 'styled-components';
import { showMessageForResult } from '../../../../utils/showMessage';
import { IntlKeys } from '../../../../locale/zh_CN';
import withLocale from '../../../../utils/withLocale';
import { Row, Col, Form, Input, Button, Select, message } from 'antd';
import { WrappedFormUtils } from 'antd/lib/form/Form';

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
  agentId: string;
  agentType: string;
  dispatch?: Dispatch;
  // tslint:disable-next-line:no-any
  agentBase?: AgentInformationState | any;
  // tslint:disable-next-line:no-any
  form?: WrappedFormUtils | any;
}
interface State {
  agentId: string;
}
/** 代理管理资料页面 */
@withLocale
@select('agentBase')
@Form.create()
export default class AgentInformation extends React.Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.agentId !== prevState.agentId) {
      return {
        agentId: nextProps.agentId
      };
    }
    return null;
  }

  state = {
    agentId: ''
  };
  componentDidMount() {
    this.props.dispatch!({
      type: 'agentBase/getBaseInfo',
      payload: {
        id: this.state.agentId
      }
    });
  }

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let agentControl = JSON.parse(sessionStorage.joys_userInfo).member_control;
    this.props.form.validateFieldsAndScroll((err: object, values: AgentInformationData) => {
      if (!err) {
        let obj: AgentInformationData = {};
        if (agentControl.truename) {
          obj.name = values.truename;
        }
        if (agentControl.mobile) {
          obj.mobile = values.mobile;
        }
        if (agentControl.qq) {
          obj.qq = values.qq;
        }
        if (agentControl.weixin) {
          obj.weixin = values.weixin;
        }
        if (agentControl.email) {
          obj.email = values.email;
        }
        if (agentControl.skype) {
          obj.skype = values.skype;
        }
        obj.memo = values.memo;
        this.props.dispatch!({
          type: 'agentBase/doSaveInfo',
          payload: { id: this.props.agentId, obj }
        }).then(showMessageForResult);
      }
    });
  }
  render() {
    // 权限
    let agentControl = JSON.parse(sessionStorage.joys_userInfo).member_control;
    const { getFieldDecorator } = this.props.form;
    const { site = () => null, agentBase, agentType } = this.props;
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

    return (
      <InformationCon>
        <Form onSubmit={this.onSubmit}>
          <Row type="flex">
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('代理用户名')}>
                <span>{agentBase.agentBaseInfo.name}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('ID')}>
                <span>{agentBase.agentBaseInfo.id}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('会员数')}>
                <span>{agentBase.agentBaseInfo.play_num}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('真实姓名')}>
                {getFieldDecorator('truename', {
                  initialValue: agentBase.agentBaseInfo.truename
                })(<Input disabled={!agentControl.truename} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('下级代理数')}>
                <span>{agentBase.agentBaseInfo.inferisors_num}</span>
                <Button size="small" disabled={agentType === '2'}>
                  {site('添加下级代理')}
                </Button>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('上级代理')}>
                <span>{agentBase.agentBaseInfo.up_agent_name}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('登陆密码')}>
                <span>****</span>
                <Button size="small">{site('重置')}</Button>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('取款密码')}>
                <span>****</span>
                <Button size="small">{site('重置')}</Button>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('用户类型')}>
                <span>{agentBase.agentBaseInfo.type === '1' ? '层级代理' : '直属代理'}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('所属层')}>
                <span>{agentBase.agentBaseInfo.level}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('注册时间')}>
                <span>{agentBase.agentBaseInfo.created}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('最后登陆时间')}>
                <span>{agentBase.agentBaseInfo.last_login}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('注册ip')}>
                <span>{agentBase.agentBaseInfo.register_ip}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('最后登陆ip')}>
                <span>{agentBase.agentBaseInfo.login_ip}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('注册来源')}>
                <span>{agentBase.agentBaseInfo.channel}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('联系电话')}>
                {getFieldDecorator('mobile', {
                  initialValue: agentBase.agentBaseInfo.mobile
                })(<Input disabled={!agentControl.mobile} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('邮箱')}>
                {getFieldDecorator('email', {
                  initialValue: agentBase.agentBaseInfo.email
                })(<Input disabled={!agentControl.email} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('QQ')}>
                {getFieldDecorator('qq', {
                  initialValue: agentBase.agentBaseInfo.qq
                })(<Input disabled={!agentControl.qq} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('skype')}>
                {getFieldDecorator('skype', {
                  initialValue: agentBase.agentBaseInfo.skype
                })(<Input disabled={!agentControl.skype} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('微信')}>
                {getFieldDecorator('weixin', {
                  initialValue: agentBase.agentBaseInfo.weixin
                })(<Input disabled={!agentControl.weixin} />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('性别')}>
                <span>{agentBase.agentBaseInfo.gender}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('生日')}>
                <span>{agentBase.agentBaseInfo.brith}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('目标市场国家')}>
                <span>{agentBase.agentBaseInfo.country}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('语言')}>
                <span>{agentBase.agentBaseInfo.language_name}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('目标市场省份')}>
                <span>{agentBase.agentBaseInfo.province}</span>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label={site('货币')}>
                <span>{agentBase.agentBaseInfo.ctype}</span>
              </FormItem>
            </Col>

            <Col span={24}>
              <FormItem {...formItemTextareaLayout} label={site('备注')}>
                {getFieldDecorator('memo', {
                  initialValue: agentBase.agentBaseInfo.memo
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
