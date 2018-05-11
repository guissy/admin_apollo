import * as React from 'react';
import { Input } from 'antd';

interface Props {
  maxLength?: number; // 最大字符数：超出将报错
  value?: string;
  onChange?: (value: string) => void;
}

interface State {
  value: string;
  leftLength: number;
  maxLength: number;
}

/**
 * @example
 * <Form.Item label={'描述'}>
 *   {this.props.form.getFieldDecorator('text', {
 *      initialValue: '一二三四五六七八九十'
 *   })(<TextareaComponent maxLength={11}/>)}
 * </Form.Item>
 */
export default class TextareaComponent extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      leftLength: NaN,
      maxLength: NaN
    };
  }
  componentWillMount() {
    // 初始值验证
    const { value, maxLength = NaN } = this.props;
    this.setState({
      maxLength,
      leftLength: maxLength && value ? maxLength - value.length : NaN,
      value: this.props.value || ''
    });
  }
  onChange = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const value = (e.target as HTMLTextAreaElement).value;
    this.setState({
      value,
      leftLength: this.state.maxLength - value.length
    });
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(value.slice(0, this.state.maxLength));
    }
  }
  render() {
    const { maxLength } = this.props;
    let isOverHalf; // 超过最大长度的一半 才显示余下多少
    if (maxLength) {
      isOverHalf = this.state.value.length > maxLength / 2;
    }
    const showLeft = this.state.leftLength > 0 && isOverHalf;
    return (
      <div>
        <Input.TextArea value={this.state.value} onChange={this.onChange} />
        {showLeft && (
          <span style={{ color: '#999999' }}>{`您还可以输入 ${this.state.leftLength} 字符`}</span>
        )}
        {this.state.leftLength < 0 && (
          <span style={{ color: '#f64e3f' }}>{`已超出 ${-this.state.leftLength} 字符`}</span>
        )}
      </div>
    );
  }
}
