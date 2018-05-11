import React, { ErrorInfo } from 'react';
import { select } from '../../../utils/model';
import { messageDebug } from '../../../utils/showMessage';

interface Props {
  type?: string;
  placeholder?: React.ReactNode;
}

/** 错误边界 */
@select('error')
export default class ErrorBoundary extends React.PureComponent<Props, {}> {
  state = {
    hasError: false,
    error: {} as Error,
    errorInfo: {} as ErrorInfo
  };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      hasError: true
    });
    // todo Sentry.io
    console.error(error);
    console.error(errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { type, placeholder } = this.props;
    if (hasError) {
      messageDebug(this.state.error, this.state.errorInfo.componentStack);
      switch (type) {
        case 'placeholder':
          return placeholder;
        case 'skip':
          return null;
        default:
          return this.props.children;
      }
    }
    return this.props.children;
  }
}
