import * as React from 'react';
import { Select } from 'antd';
import { SelectValue } from 'antd/lib/select';
const Option = Select.Option;
interface Props {
  labelInValue?: boolean;
  placeholder?: string;
  onChange?: (value: SelectValue) => void; // 子组件返给父组件的值  选填
  defaultValue?: SelectValue;
  value?: SelectValue;
}
const depositTypeList: Array<{ value: string; text: string }> = [
  { text: '微信存款', value: 'wechat_deposit' },
  { text: '公司存款', value: 'company_deposit' },
  { text: '第三方网银', value: 'unionpay_deposit' },
  { text: '支付宝存款', value: 'alipay_deposit' },
  { text: '全局', value: 'global' }
];
interface State {}

/** 下拉存款方式 */
export default class ApplyComponent extends React.PureComponent<Props, State> {
  static defaultProps = {
    placeholder: '请选择',
    labelInValue: false // 默认情况下 onChange 里只能拿到 value，如果需要拿到选中的节点文本 label，可以使用 labelInValue 属性
  };
  render() {
    const { placeholder, labelInValue, value, onChange } = this.props;
    return (
      <Select
        placeholder={placeholder}
        labelInValue={labelInValue}
        onChange={onChange}
        value={value}
      >
        {depositTypeList.map(item => <Option key={item.value}>{item.text}</Option>)}
      </Select>
    );
  }
}
