import * as React from 'react';
import * as ReactDOM from 'react-dom';
import styled from 'styled-components';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { Button, Form, Input, Select } from 'antd';
import InputComponent from '../input/InputComponent';
import { SettingState } from '../../home/header/setting/Setting.model';
import { Result } from '../../../utils/result';
import { FormItemProps, ValidationRule } from 'antd/lib/form';
import { toClass } from 'recompose';
import moment from 'moment';
import { FieldProps } from '../../../utils/TableFormField';

moment.locale('zh-cn');

const Wrap = styled.section`
  background: #fff;

  .ant-select {
    min-width: 100px;
  }
`;

type DefaultProps = { autoFocus?: boolean; placeholder?: string; ref?: Function };

/** 表单 */
@withLocale
@Form.create()
@select('setting')
export class FormComponent extends React.PureComponent<FormComponentProps, {}> {
  state = {
    loading: false,
    visibleModal: false
  };

  autoFocus(isFirst?: boolean) {
    return isFirst
      ? {
          autoFocus: true,
          ref: (ref: React.ReactInstance) => {
            const component = ReactDOM.findDOMNode(ref) as HTMLInputElement;
            if (component) {
              requestAnimationFrame(() => component.focus());
            }
          }
        }
      : {};
  }
  // 提交
  onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { actionType, onSubmit, showMessage, onCancel, onDone, resetFields } = this.props;
    this.props.form!.validateFields((err: object, values: object) => {
      if (this.props.pageSize) {
        values = {
          ...values,
          page: 1,
          page_size: this.props.pageSize
        };
      }
      if (!err) {
        // 处理日期范围
        Object.entries(values)
          .filter(([key, value]) => key.includes(','))
          .forEach(([key, value]) => {
            const [fromKey, toKey] = key.split(',').map((k: string) => k.trim());
            if (Array.isArray(value) && !!value.length) {
              // TODO: 时分秒
              if (typeof value[0] === 'object' && typeof value[1] === 'object') {
                values[fromKey] = moment(value[0].toString()).format('YYYY-MM-DD hh:mm:ss');
                values[toKey] = moment(value[1].toString()).format('YYYY-MM-DD hh:mm:ss');
              } else if (typeof value[0] === 'string' && typeof value[1] === 'string') {
                values[fromKey] = value[0];
                values[toKey] = value[1];
              }
            }
            delete values[key];
          });
        const closeModal = (result: Result<object> | void) => {
          if (showMessage && result) {
            showMessage(result);
          }
          this.setState({ loading: false });
          if (resetFields) {
            this.props.form.resetFields();
          }
          if (onCancel) {
            onCancel();
          }
          return result;
        };

        if (actionType) {
          // 只传入type,已处理发送异步请求与成功与失败的提示
          this.setState({ loading: true });
          this.props.dispatch!({ type: actionType, payload: values })
            .then(closeModal)
            .then(onDone)
            .catch((error: object) => {
              this.setState({ loading: false });
              console.info(`🐞: `, error);
            });
        } else if (onSubmit) {
          // 自定义方法请求，成功与失败提示信息
          this.setState({ loading: true });
          const promise = onSubmit(values);
          if (promise && 'then' in promise) {
            promise.then(closeModal).then(() => {
              if (onDone) {
                onDone();
              }
            });
          } else {
            this.setState({ loading: false });
            console.error('onSubmit 必须返回Promise');
          }
        }
      }
    });
  }

  // 重置
  onReset = () => {
    this.props.form!.resetFields();
    this.setState({ loading: false });
  }

  public render() {
    const { getFieldDecorator } = this.props.form;
    const {
      fieldConfig,
      site = () => '',
      formLayout = 'inline',
      submitText,
      resetText,
      hasResetBtn = false,
      setting
    } = this.props;

    // hasResetBt为true认为是搜索表单
    const formStyle = hasResetBtn ? { padding: '20px 20px 10px' } : {};
    let inputIndex = 0;
    return (
      <Wrap style={formStyle}>
        <Form onSubmit={this.onSubmit} layout={formLayout}>
          <fieldset disabled={this.state.loading}>
            {fieldConfig.map(v => {
              // 当前语言
              const currentLang = setting && setting.lang === 'en_US' ? ' ' : '';
              const formItemProps: FormItemProps = v.formItemProps ? v.formItemProps() : {};

              // 控件布局
              let defaultItemLayout =
                formLayout === 'horizontal'
                  ? {
                      labelCol: {
                        span: 6
                      },
                      wrapperCol: {
                        span: 13
                      }
                    }
                  : {};

              // 校验规则
              const rules: ValidationRule[] = v.formRules ? v.formRules() : [];
              if (rules[0] && !rules[0].message && typeof v.title === 'string') {
                const text = `${v.title}${currentLang}${site('为必填')}`;
                rules[0].message = text;
              }

              // 元素
              const element = v.formItemRender
                ? v.formItemRender()
                : console.info(`🐞: `, '缺少formItemRender');

              // 初始值
              // 排除formInitialValue缺省时值为undefined，而提交时缺少字段，(有时后台必须的字段值可以为空)
              const initialValue = v.formInitialValue ? v.formInitialValue : '';

              let defaultProps = {} as DefaultProps;

              // 字段提示信息
              if (element) {
                if (
                  element.type === Input ||
                  element.type === InputComponent ||
                  element.type === Input.TextArea
                ) {
                  defaultProps = {
                    placeholder: `${site('请输入')}${currentLang}${v.title}`,
                    ...this.autoFocus(inputIndex === 0)
                  };
                  console.log('☞☞☞ 9527 FormCompoent 197', inputIndex, v, element);
                  inputIndex += 1;
                } else if (element.type === Select) {
                  defaultProps = {
                    placeholder: `${site('请选择')}${currentLang}${v.title}`,
                    ...this.autoFocus(inputIndex === 0)
                  };
                  inputIndex += 1;
                }
              }

              let itemStyle: object = { marginBottom: '10px' };
              // hasResetBt为true认为是搜索表单
              if (formItemProps.style) {
                itemStyle = { ...itemStyle, ...formItemProps.style };
              }
              let elementOk = element;
              if (typeof element === 'function') {
                const Component = toClass<Partial<FieldProps>>(element);
                elementOk = (
                  <Component
                    text={initialValue}
                    record={this.props.record}
                    view={this.props.view}
                  />
                );
              }
              return element ? (
                <Form.Item
                  label={v.title}
                  key={v.dataIndex}
                  {...defaultItemLayout}
                  {...formItemProps}
                  style={itemStyle}
                >
                  {getFieldDecorator(v.dataIndex, {
                    initialValue: initialValue,
                    rules: rules
                  })(
                    React.cloneElement(
                      elementOk,
                      { ...defaultProps, ...elementOk.props },
                      elementOk.props.children
                    )
                  )}
                </Form.Item>
              ) : null;
            })}
            <Form.Item className="submitItem" style={hasResetBtn ? { marginBottom: '10px' } : {}}>
              <Button htmlType="submit" type="primary" loading={this.state.loading}>
                {submitText}
              </Button>
            </Form.Item>
            {hasResetBtn ? (
              <Form.Item style={hasResetBtn ? { marginBottom: '10px' } : {}}>
                <Button htmlType="reset" onClick={this.onReset}>
                  {resetText}
                </Button>
              </Form.Item>
            ) : (
              ''
            )}
            {this.props.footer}
          </fieldset>
        </Form>
      </Wrap>
    );
  }
}

/** EditForm & Search 字段 */
export interface FormComponentProps {
  form?: any; // tslint:disable-line:no-any
  fieldConfig: FormConfig[]; // 字段配置
  actionType?: string; // namespace/effect
  site?: (words: string) => React.ReactNode;
  dispatch?: Dispatch;
  formLayout?: 'inline' | 'horizontal' | 'vertical'; // 表单排版类型
  submitText?: string; // 提交按钮文字
  resetText?: string; //  重置按钮文字
  hasResetBtn?: boolean; // 是否显示重置按钮，默认false
  pageSize?: number; // 查询记录数量
  showMessage?: (result: Result<object>) => void; // 是否显示返回结果提示信息
  setting?: SettingState; // 获取全局设置
  onSubmit?: (values: object) => Promise<Result<object> | void>; // 提交事件，返回Promise，用于关闭模态框，清理表单
  onCancel?: Function; // 成功后关闭模态框
  onDone?: (result?: Result<object> | void) => void; // onSubmit后的回调
  resetFields?: boolean; // 重置字段
  footer?: React.ReactNode;
  record?: { isTotalRow?: boolean };
  view?: React.PureComponent;
}

/** 表单字段 */
export interface FormConfig {
  title?: React.ReactNode; // 字段标题
  dataIndex: string; // 字段键名
  notInTable?: boolean; // 是否在表格中显示
  formItemProps?: (form?: object) => {}; // 控件属性
  formItemRender: Function; // 控件
  formInitialValue?: string | number | Array<number> | object;
  formRules?: () => {}[]; // 字段验证规则
  render?: (text: string, record: object) => React.ReactNode; // 表格行操作
}
