import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import MemberLogPage from './MemberLog.page';
import { MemberLog, MemberLogFragment } from './MemberLog.model';

const site = withLocale.site;

/** 会员操作日志字段 */
export default class MemberLogField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    title: site('记录编号')
  };

  name = {
    title: site('用户'),
    search: <Input />
  };

  domain = {
    title: site('域名'),
    search: <Input />
  };

  log_type = {
    title: site('操作类型'),
    search: <Input />
  };

  status = {
    title: site('状态'),
    search: <Switch checkedChildren={site('启用')} unCheckedChildren={site('停用')} />,
    table: ({ text, record, view }: FieldProps<string, MemberLog, MemberLogPage>) => (
      <>
        {record.status === 'enabled' ? (
          <Tag className="account-opened">{site('成功')}</Tag>
        ) : (
          <Tag className="account-close">{site('失败')}</Tag>
        )}
      </>
    )
  };

  created = {
    title: site('操作时间'),
    form: <Input />,
    search: 'form'
  };

  log_ip = {
    title: site('操作IP'),
    search: <Input />
  };

  log_value = {
    title: site('操作详细信息'),
    search: <Input />
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
