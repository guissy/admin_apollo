import * as React from 'react';
import styled from 'styled-components';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { Dispatch } from 'dva';
import { Button, Form } from 'antd';
import { Result } from '../../../utils/result';
import { FormItemProps } from 'antd/lib/form';
import moment from 'moment';
import { isEqual, omit } from 'lodash/fp';
import { WrappedFormUtils } from 'antd/es/form/Form';
import FormItemUI from './FormItemUI';

moment.locale('zh-cn');

const Section = styled.section`
  background: #fff;

  .ant-select {
    min-width: 100px;
  }
`;

/** 表单 */
@withLocale
@Form.create()
@select('setting')
export class FormUI extends React.Component<FormUIProps, {}> {
  state = {
    loading: false,
    visibleModal: false
  };
  hasSubmit: boolean;
  foundFirst: boolean;

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
        this.hasSubmit = true;
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
            const { form } = this.props as Hoc;
            form.resetFields();
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

  shouldComponentUpdate(
    nextProps: Readonly<FormUIProps>,
    nextState: Readonly<{}>,
    nextContext: object
  ): boolean {
    const omitForm = omit(['form']);
    const changedState = !isEqual(this.state, nextState);
    const changedProps = !isEqual(omitForm(this.props), omitForm(nextProps));
    const changedContext = !isEqual(this.context, nextContext);
    const needUpdate = changedState || changedProps || changedContext;
    const dontUpdate = nextProps.resetFields && this.hasSubmit; // 提交之后不更新，避免表单字段闪回原来的值
    return !dontUpdate;
  }

  // tslint:disable-next-line
  isFirst(render: React.ReactElement<any> | React.PureComponent<any>, dataIndex: string): boolean {
    if (
      !(typeof render === 'function') &&
      render.props &&
      (render.props.hidden !== true || render.props.type !== 'hidden') &&
      !this.foundFirst &&
      dataIndex !== 'id'
    ) {
      this.foundFirst = true;
      return true;
    } else {
      return false;
    }
  }

  public render() {
    const {
      fieldConfig,
      formLayout = 'inline',
      submitText,
      resetText,
      hasResetBtn = false,
      defaultFormItemProps
    } = this.props;
    const { form } = this.props as Hoc;

    // hasResetBt为true认为是搜索表单
    const formStyle = hasResetBtn ? { padding: '20px 20px 10px' } : {};
    this.foundFirst = false;
    return (
      <Section style={formStyle}>
        <Form onSubmit={this.onSubmit} layout={formLayout}>
          <fieldset disabled={this.state.loading}>
            {fieldConfig.map(v => (
              <FormItemUI
                key={v.dataIndex}
                form={form}
                title={v.title}
                dataIndex={v.dataIndex}
                formItemProps={{ ...defaultFormItemProps, ...v.formItemProps }}
                formItemRender={v.formItemRender}
                initialValue={v.formInitialValue}
                formRules={v.formRules}
                record={this.props.record}
                view={this.props.view}
                isFirst={this.isFirst(v.formItemRender, v.dataIndex)}
              />
            ))}
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
      </Section>
    );
  }
}

interface Hoc {
  form: WrappedFormUtils;
  site: (words: string) => React.ReactNode;
}

/** EditForm & Search 字段 */
export interface FormUIProps extends Partial<Hoc> {
  defaultFormItemProps?: FormItemProps;
  fieldConfig: FormConfig[]; // 字段配置
  actionType?: string; // namespace/effect
  dispatch?: Dispatch;
  formLayout?: 'inline' | 'horizontal' | 'vertical'; // 表单排版类型
  submitText?: string; // 提交按钮文字
  resetText?: string; //  重置按钮文字
  hasResetBtn?: boolean; // 是否显示重置按钮，默认false
  pageSize?: number; // 查询记录数量
  showMessage?: (result: Result<object>) => void; // 是否显示返回结果提示信息
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
  formItemProps?: { style: object }; // 控件属性
  formItemRender: React.ReactElement<any> | React.PureComponent<any>; // tslint:disable-line
  formInitialValue?: string | number | Array<number> | object;
  formRules?: () => {}[]; // 字段验证规则
  render?: (text: string, record: object) => React.ReactNode; // 表格行操作
}
