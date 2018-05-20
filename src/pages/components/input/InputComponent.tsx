import * as React from 'react';
import { Input } from 'antd';

/**
 * 用于自动添加 placeholder
 *
 * {@link FormUI#render}
 */
export default class InputComponent extends React.PureComponent<InputComponentProps, {}> {
  render() {
    return <Input {...this.props} />;
  }
}

interface InputComponentProps {}
