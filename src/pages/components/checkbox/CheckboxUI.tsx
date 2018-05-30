import * as React from 'react';
import { Checkbox } from 'antd';
import withLocale from '../../../utils/withLocale';
import { CheckboxChangeEvent } from 'antd/lib/checkbox/Checkbox';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';

type OptionAntd = string | number | object;
type OptionValue = string | number | object;
interface Props {
  site?: (words: string) => string;
  options: (string | number | object)[];
  value?: (string | number | object)[];
  onChange?: (value: (string | number | object)[]) => void;
  name?: string;
  formatOut?: string[];
  key?: string;
}

function toAntd(options: OptionValue[], name?: string) {
  const isObject = options.every(item => item instanceof Object);
  if (isObject && name) {
    return options.map(item => item[name]);
  } else {
    return options.map(item => item.toString());
  }
}
/** checkbox */
@withLocale
export default class CheckboxUI extends React.PureComponent<Props, {}> {
  static getDerivedStateFromProps(nextProps: Props, prevState: {}) {
    return {
      optionsAntd: toAntd(nextProps.options, nextProps.name),
      checkedList: nextProps.value ? toAntd(nextProps.value, nextProps.name) : []
    };
  }
  state = {
    optionsAntd: toAntd(this.props.options, this.props.name),
    checkedList: this.props.value ? toAntd(this.props.value, this.props.name) : []
  };
  update(checkedValue: CheckboxValueType[]) {
    this.setState({
      checkedList: checkedValue
    });
    if (this.props.onChange) {
      const value = this.formatData(checkedValue);
      this.props.onChange(value);
    }
  }
  formatData = (value: CheckboxValueType[]) => {
    if (this.props.formatOut && this.props.name) {
      const formatOut = this.props.formatOut;
      const name = this.props.name;
      return this.props.options.filter(item => value.includes(item[name])).map(item => {
        const formatItem = {};
        formatOut.forEach(element => {
          formatItem[element] = item[element];
        });
        return formatItem;
      });
    } else {
      return value;
    }
  }
  onCheckAll = (e: CheckboxChangeEvent) => {
    const all = this.state.optionsAntd;
    this.update(e.target.checked ? all : []);
  }
  onCheck = (checkedValue: CheckboxValueType[]) => {
    this.update(checkedValue);
  }
  render() {
    const { site = () => '' } = this.props;
    const checkedList = this.state.checkedList;
    const indeterminate = !!checkedList.length && checkedList.length < this.props.options.length;
    return (
      <div>
        <div>
          <Checkbox
            indeterminate={indeterminate}
            onChange={this.onCheckAll}
            checked={checkedList.length > 0}
          >
            {site('全选')}
          </Checkbox>
        </div>
        <Checkbox.Group
          options={this.state.optionsAntd}
          value={this.state.checkedList}
          onChange={this.onCheck}
          key={this.props.key}
        />
      </div>
    );
  }
}
