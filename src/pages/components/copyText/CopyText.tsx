import * as React from 'react';
import { Button, message } from 'antd';
import withLocale from '../../../utils/withLocale';
import { messageError, messageSuccess } from '../../../utils/showMessage';

/**
 * 复制文本（js调用)
 * @external environment
 * @external document.body
 * @external document.createElement
 * @external document.execCommand
 */
export function copyToClipboard(content: string = '', success: string) {
  if (!content) {
    messageError(success);
    return;
  }
  const textField = document.createElement('textarea');
  textField.innerText = content;
  document.body.appendChild(textField);
  textField.select();
  document.execCommand('copy');
  textField.remove();
  messageSuccess(success);
}

function onClickCopy(e: React.MouseEvent<HTMLElement>) {
  const elm = e.currentTarget;
  const { content } = elm.dataset || { content: elm.getAttribute('data-content') };
  copyToClipboard(content, withLocale.site('复制成功'));
}

interface Props {
  content: string; // 传入需要复制的文字
  type?: 'button' | 'a'; // 默认为 a
  children?: React.ReactNode;
  disabled?: boolean;
}

/**
 * 复制文本 (jsx调用)
 * 实现途径借 textarea + execCommand
 *
 * 当 type=button 显示 Button 标签，默认 a 标签
 * @example
 *  <CopyText content={'haha'} type={'button'}>
 *    复制它
 *  </CopyText>
 */
export default function CopyText({ type, content, children, ...props }: Props) {
  let contentOk = content;
  const notString = !(typeof content === 'string');
  if (notString) {
    contentOk = '';
    console.error('CopyText.props.content must be String type');
  }
  const disabled = notString || props.disabled;
  return type === 'button' ? (
    <Button
      data-content={contentOk}
      disabled={disabled}
      onClick={onClickCopy}
      size={'small'}
      {...props}
    >
      {children}
    </Button>
  ) : (
    <a data-content={contentOk} onClick={onClickCopy} {...props}>
      {children}
    </a>
  );
}
