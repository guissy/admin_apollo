import * as React from 'react';
import { select } from '../../../utils/model';
import { connect, Dispatch } from 'dva';
import { Button, Form, Input, Checkbox, Row, Col, Icon, Layout } from 'antd';
import styled from 'styled-components';
import environment from '../../../utils/environment';
import { WrappedFormUtils } from 'antd/es/form/Form';

const PageLayout = styled(Layout)`
  background: none;
`;
const Fieldset = styled.fieldset`
  white-space: nowrap;
  h1 {
    text-align: center;
  }
`;
const MainRow = styled(Row)``;
const MainCol = styled(Col)`
  width: 368px;
  min-width: 260px;
  box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
  padding: 38px;
  margin: 20px;
`;
const Submit = styled(Button)`
  width: 100%;
`;

/** 登录表单 */
@select('')
@Form.create()
export default class LoginComponent extends React.PureComponent<Props, State> {
  state = {
    username: '',
    password: '',
    rememberPwd: false
  };

  componentDidMount() {
    const localName = window.localStorage.getItem('username');
    const localPwd = window.localStorage.getItem('password');
    this.setState({
      username: localName ? localName : '',
      password: localPwd ? localPwd : '',
      rememberPwd: true
    });
  }

  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    this.props.form!.validateFields((err: object, values: object) => {
      if (!err) {
        this.props.dispatch!({ type: this.props.actionType, payload: values });
      }
    });
  }

  onChange = () => {
    this.setState({ rememberPwd: !this.state.rememberPwd });
  }

  render() {
    const { getFieldDecorator } = this.props.form || ({} as WrappedFormUtils);
    const { login, height = '' } = this.props;
    const { username, password, rememberPwd } = this.state;

    return (
      <PageLayout>
        <Layout.Content>
          <MainRow type="flex" justify="space-around" align="middle" style={{ height: height }}>
            <MainCol>
              <Form onSubmit={this.onSubmit}>
                <Fieldset disabled={login.loading}>
                  <h1>
                    <svg className="icon" aria-hidden="true">
                      <use xlinkHref="#icon-37750" />
                    </svg>
                    {environment.title}
                  </h1>
                  <Form.Item hasFeedback={true}>
                    {getFieldDecorator('username', {
                      initialValue: username,
                      rules: [
                        {
                          required: true,
                          message: '请输入用户名'
                        }
                      ]
                    })(
                      <Input
                        prefix={<Icon type="user" />}
                        autoFocus={true}
                        autoComplete="off"
                        placeholder="用户名"
                      />
                    )}
                  </Form.Item>
                  <Form.Item hasFeedback={true}>
                    {getFieldDecorator('password', {
                      initialValue: password,
                      rules: [
                        {
                          required: true,
                          message: '请输入密码'
                        }
                      ]
                    })(
                      <Input
                        prefix={<Icon type="lock" />}
                        type="password"
                        autoComplete="off"
                        placeholder="密码"
                      />
                    )}
                  </Form.Item>
                  {/* <Form.Item>
                    {getFieldDecorator('rememberPwd', {
                      initialValue: rememberPwd
                    })(
                      <Checkbox checked={rememberPwd} onChange={this.onChange}>
                        记住密码
                      </Checkbox>
                    )}
                  </Form.Item> */}
                  <Form.Item>
                    <Submit type="primary" htmlType="submit" loading={login.loading}>
                      登录
                    </Submit>
                  </Form.Item>
                </Fieldset>
              </Form>
            </MainCol>
          </MainRow>
        </Layout.Content>
      </PageLayout>
    );
  }
}

interface State {
  username: string;
  password: string;
  rememberPwd: boolean;
}

interface Props {
  form?: WrappedFormUtils;
  dispatch?: Dispatch;
  login: any; // tslint:disable-line:no-any
  height?: string; // tslint:disable-line:no-any // 样式高度
  actionType: string; // dispatch action type
}
