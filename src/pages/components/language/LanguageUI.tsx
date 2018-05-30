import * as React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import withLocale from '../../../utils/withLocale';
const Option = Select.Option;

interface Props {
  labelInValue?: boolean; // 默认情况下 onChange 里只能拿到 value，如果需要拿到选中的节点文本 label，可以使用 labelInValue 属性
  placeholder?: string;
  children?: React.ReactNode;
  site?: (words: string) => string;
}
const language: Array<{ value: string; text: string }> = [
  { text: '简体中文', value: '1' },
  { text: '繁体中文', value: '2' },
  { text: 'English', value: '3' },
  { text: 'ภาษาไทย', value: '4' },
  { text: 'Tiếng Việt', value: '5' },
  { text: '日本语', value: '6' },
  { text: 'Indonesia', value: '7' }
];

// todo LanguageComponent 改为 LanguageSelect
/** 语言下拉框 */
export default withLocale(function LanguageUI({
  placeholder,
  children,
  site = (words: string) => '',
  value,
  ...props
}: Props & SelectProps) {
  let valueOk = value;
  if (props.labelInValue && typeof value === 'string') {
    const found = language.find(item => item.value === value);
    if (found) {
      valueOk = { key: value, label: found.text } as any; // tslint:disable-line
    } else {
      valueOk = undefined;
    }
  }
  return (
    <Select placeholder={placeholder || site('请选择语言')} value={valueOk} {...props}>
      {language.map(item => <Option key={item.value}>{item.text}</Option>)}
    </Select>
  );
});
