import * as React from 'react';
import { select } from '../../utils/model';
import { Dispatch } from 'dva';
import { Button, Form, Input, Row, Col, Icon, Layout } from 'antd';
import styled from 'styled-components';
import environment from '../../utils/environment';
import { WrappedFormUtils } from 'antd/es/form/Form';
import gql from 'graphql-tag';
import { FetchResult, Mutation } from 'react-apollo';
import { URL as uuidv5 } from 'uuid/v5';
import request from '../../utils/request';
import update from 'immutability-helper';
import { push } from 'react-router-redux';
import { transformLoginRoute } from './Login.model';

const PageLayout = styled(Layout)`
  background: none;
  fieldset {
    white-space: nowrap;
    h1 {
      text-align: center;
    }
    .col {
      width: 368px;
      min-width: 260px;
      box-shadow: 0 0 100px rgba(0, 0, 0, 0.08);
      padding: 38px;
      margin: 20px;
    }
    .ant-btn-primary {
      width: 100%;
    }
  }
`;

/** 登录表单 */
@select('')
@Form.create()
export default class LoginComponent extends React.PureComponent<Props, State> {
  state = {
    username: 'xiaoming',
    password: '123456',
    rememberPwd: false
  };

  onChange = () => {
    this.setState({ rememberPwd: !this.state.rememberPwd });
  }

  render() {
    const { getFieldDecorator } = this.props.form || ({} as WrappedFormUtils);
    const { height = '', dispatch } = this.props;
    const { username, password, rememberPwd } = this.state;

    return (
      <PageLayout>
        <Layout.Content>
          <Row type="flex" justify="space-around" align="middle" style={{ height: height }}>
            <Col className="col">
              <Mutation
                mutation={gql`
                  mutation loginMutation($body: LoginInput!) {
                    signIn(body: $body)
                      @rest(
                        bodyKey: "body"
                        path: "/admin/login/one"
                        method: "post"
                        type: "LoginResult"
                      ) {
                      state
                      message
                      data {
                        uid
                        fid
                        sign
                      }
                    }
                  }
                `}
              >
                {(signIn, { data, loading }) => (
                  <Form
                    onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                      e.preventDefault();
                      this.props.form!.validateFields((err: object, values: object) => {
                        if (!err) {
                          signIn({ variables: { body: values } }).then(
                            ({ data: { signIn: signInResult = {} } = {} }: FetchResult) => {
                              return request(`/admin/login/two`, {
                                method: 'POST',
                                body: JSON.stringify({
                                  ...signInResult.data,
                                  code: 0
                                })
                              })
                                .then(result =>
                                  update(result, {
                                    data: {
                                      route: transformLoginRoute
                                    }
                                  })
                                )
                                .then(result => {
                                  dispatch!({
                                    type: 'login/token',
                                    loading: false,
                                    payload: result
                                  });
                                  const lastUrl = window.localStorage.getItem(environment.lastUrl);
                                  dispatch!(push(lastUrl || '/'));
                                });
                            }
                          );
                        }
                      });
                    }}
                  >
                    <fieldset disabled={loading}>
                      {getFieldDecorator('mac', {
                        initialValue: uuidv5
                      })(<input hidden={true} />)}
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
                        <Button type="primary" htmlType="submit" loading={loading}>
                          登录
                        </Button>
                      </Form.Item>
                    </fieldset>
                  </Form>
                )}
              </Mutation>
            </Col>
          </Row>
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
  // login: any; // tslint:disable-line:no-any
  height?: string; // tslint:disable-line:no-any // 样式高度
  // actionType: string; // dispatch action type
}
