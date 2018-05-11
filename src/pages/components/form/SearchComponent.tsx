import * as React from 'react';
import { IntlKeys } from '../../../locale/zh_CN';
import withLocale from '../../../utils/withLocale';
import { select } from '../../../utils/model';
import { FormComponent, FormConfig } from './FormCompoent';
import { Result } from '../../../utils/result';
import { cloneButtonBar } from '../buttonBar/ButtonBarComponent';

/** 表格上面的查询 */
@withLocale
@select('')
export class SearchComponent extends React.PureComponent<SearchComponentProps> {
  public render() {
    const { fieldConfig, site = () => '', actionType, pageSize, onSubmit, onDone } = this.props;
    return (
      <FormComponent
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

interface SearchComponentProps {
  form?: any; // tslint:disable-line:no-any
  fieldConfig: SearchFormConfig[]; // 字段配置
  onSubmit?: (values: object) => Promise<Result<object>>; // 提交事件，返回Promise，用于关闭模态框，清理表单
  onDone?: (result?: Result<object> | void) => void; // onSubmit后的回调
  actionType?: string; // naresult?: Result<object> | voidmespace/effect
  site?: (words: IntlKeys) => string;
  pageSize?: number; // 查询记录数量
}

/** 搜索字段 */
export interface SearchFormConfig extends FormConfig {}
