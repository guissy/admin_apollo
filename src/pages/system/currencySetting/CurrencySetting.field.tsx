import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Switch, Tag } from 'antd';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import CurrencySettingPage from './CurrencySetting.page';
import { CurrencySetting } from './CurrencySetting.model';

const site = withLocale.site;

/** 代理推广资源字段 */
export default class CurrencySettingField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  cytype = {
    title: site('货币代码')
  };

  ctype = {
    title: site('货币名称')
  };

  status = {
    title: site('当前状态'),
    form: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, CurrencySetting, CurrencySettingPage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('启用')}</Tag>
        ) : (
          <Tag className="account-close">{site('停用')}</Tag>
        )}
      </>
    )
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
