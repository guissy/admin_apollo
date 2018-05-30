import * as React from 'react';
import withLocale from '../../../utils/withLocale';
import styled from 'styled-components';

const TagButton = styled.div`
  display: inline-block;
  padding: 3px;
  margin: 0 3px;
  background: #e6fffb;
  color: #13c2c2;
  border: 1px solid #87e8de;
  border-radius: 4px;
  cursor: pointer;
`;

interface Props {
  onClick?: () => void;
  hidden?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children?: React.ReactNode;
}

/** 标签按钮组件 */
export default function TagButtonComponent({ children, ...props }: Props) {
  return <TagButton {...props}>{children}</TagButton>;
}
