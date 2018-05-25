import * as React from 'react';
import * as ReactDOM from 'react-dom';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { Form, Input, Select } from 'antd';
import { SettingState } from '../../home/header/setting/Setting.model';
import { ValidationRule } from 'antd/lib/form';
import { toClass } from 'recompose';
import { FieldProps } from '../../../utils/TableFormField';
import { WrappedFormUtils } from 'antd/es/form/Form';
import { autobind } from 'core-decorators';

interface Hoc {
  setting: SettingState; // 获取全局设置
  site: (words: string) => string;
}

interface Props extends Partial<Hoc> {
  form: WrappedFormUtils;
  title: React.ReactNode;
  dataIndex: string;
  formItemProps?: object;
  formItemRender: React.ReactElement<any> | React.PureComponent; // tslint:disable-line
  formRules?: () => {}[]; // 字段验证规则
  initialValue?: string | number | Array<number> | object;
  record?: { isTotalRow?: boolean };
  view?: React.PureComponent;
  isFirst: boolean; // 用于autoFocus
}

type DefaultProps = {
  autoFocus?: boolean;
  placeholder?: string;
  ref?: Function;
  onChange?: Function;
};

/** FormItemUi */
@withLocale
@select('setting')
@autobind
export default class FormItemUI extends React.PureComponent<Props, {}> {
  state = {
    hidden: false,
    element: <div />,
    itemProps: {},
    rules: [],
    initialValue: '',
    isDirty: false
  };
  component: HTMLInputElement;

  componentDidMount() {
    const {
      formItemProps = {},
      formItemRender,
      site = () => '',
      title,
      dataIndex,
      formRules,
      initialValue = '', // 排除formInitialValue缺省时值为undefined，而提交时缺少字段，(有时后台必须的字段值可以为空)
      setting,
      isFirst,
      view,
      record,
      form
    } = this.props;
    // 当前语言
    const currentLang = setting && setting.lang === 'en_US' ? ' ' : '';

    // 校验规则
    const rules: ValidationRule[] = formRules ? formRules() : [];
    if (rules[0] && !rules[0].message && typeof title === 'string') {
      const text = `${title}${currentLang}${site('为必填')}`;
      rules[0].message = text;
    }

    // 元素
    const element = formItemRender || console.info(`🐞: `, '缺少formItemRender');

    let defaultElementProps = {} as DefaultProps;
    let defaultItemStyle: object = { marginBottom: '10px' };
    let elementOk = element as React.ReactElement<any> | null; // tslint:disable-line
    // 字段提示信息
    if (elementOk) {
      let txt = '';
      if (elementOk.type === Input || elementOk.type === Input.TextArea) {
        txt = site('请输入');
      } else if (elementOk.type === Select) {
        txt = site('请选择');
      }
      defaultElementProps = {
        placeholder: `${txt}${currentLang}${title}`,
        ...this.autoFocus(isFirst)
      };
    }
    if (typeof element === 'function') {
      const Component = toClass<Partial<FieldProps>>(element);
      elementOk = (
        <Component text={initialValue} record={record} view={view} form={form} hide={this.hide} />
      );
      if (elementOk.props.children === null) {
        elementOk = null;
      }
    } else if (elementOk !== null) {
      elementOk = React.cloneElement(
        elementOk,
        { ...defaultElementProps, ...element.props },
        element.props.children
      );
    }

    this.setState({
      itemProps: {
        ...defaultItemStyle,
        ...formItemProps
      },
      rules,
      element: elementOk
    });
  }

  hide(visible: boolean) {
    this.setState({ hidden: visible, isDirty: false });
  }

  autoFocus(isFirst?: boolean) {
    return isFirst
      ? {
          autoFocus: true,
          ref: (ref: React.ReactInstance) => {
            this.component = ReactDOM.findDOMNode(ref) as HTMLInputElement;
            if (this.component && !this.state.isDirty) {
              requestAnimationFrame(() => this.component.focus());
            }
          }
        }
      : {
          onChange: () => {
            this.setState({ isDirty: true });
          }
        };
  }

  render(): React.ReactNode {
    const {
      form: { getFieldDecorator }
    } = this.props;
    const {
      title,
      dataIndex,
      initialValue = '' // 排除formInitialValue缺省时值为undefined，而提交时缺少字段，(有时后台必须的字段值可以为空)
    } = this.props;
    const { element, itemProps, rules } = this.state;
    const display = { display: this.state.hidden ? 'none' : '' };
    return element ? (
      <Form.Item label={title} key={dataIndex} style={display} {...itemProps}>
        {getFieldDecorator(dataIndex, {
          initialValue: initialValue,
          rules: rules
        })(element)}
      </Form.Item>
    ) : null;
  }
}
