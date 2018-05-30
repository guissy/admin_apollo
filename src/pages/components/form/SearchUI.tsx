import * as React from 'react';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { FormUI, FormConfig } from './FormUI';
import { Result } from '../../../utils/result';
import { cloneButtonBar } from '../button/ButtonBar';
import { Form } from 'antd';

/** 表格上面的查询 */
@withLocale
@select('')
@Form.create()
export class SearchUI extends React.PureComponent<Props> {
  public render() {
    const { fieldConfig, site = () => '', actionType, pageSize, onSubmit, onDone } = this.props;
    return (
      <FormUI
        submitText={site('查询')}
        resetText={site('重置')}
        hasResetBtn={true}
        fieldConfig={fieldConfig}
        actionType={actionType}
        pageSize={pageSize}
        onSubmit={onSubmit}
        onDone={onDone}
        footer={cloneButtonBar()}
      />
    );
  }
}

interface Props {
  form?: any; // tslint:disable-line:no-any
  fieldConfig: SearchFormConfig[]; // 字段配置
  onSubmit?: (values: object) => Promise<Result<object>>; // 提交事件，返回Promise，用于关闭模态框，清理表单
  onDone?: (result?: Result<object> | void) => void; // onSubmit后的回调
  actionType?: string; // naresult?: Result<object> | voidmespace/effect
  site?: (words: string) => string;
  pageSize?: number; // 查询记录数量
}

/** 搜索字段 */
export interface SearchFormConfig extends FormConfig {}
