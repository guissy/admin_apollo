import * as React from 'react';
import LoginComponent from './LoginComponent';

/** 登录 */
export default class Login extends React.PureComponent<{}, {}> {
  render() {
    return <LoginComponent height={'100vh'} />;
  }
}
