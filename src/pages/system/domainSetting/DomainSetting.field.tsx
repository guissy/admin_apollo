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
import DomainSettingPage from './DomainSetting.page';
import { DomainSetting, DomainSettingFragment } from './DomainSetting.model';
import UploadComponent from '../../components/upload/UploadComponent';
import Editor from '../../components/richTextEditor/Editor';

const site = withLocale.site;

/** 前台域名设置字段 */
export default class DomainSettingField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('站点名称'),
    form: <Input />
  };

  title = {
    title: site('站点标题'),
    form: <Input />
  };

  bottom = {
    title: site('站点底部信息'),
    form: <Editor id="domainSetting_bottom" />
  };

  is_ssl = {
    title: site('SSL加密'),
    form: <Switch checkedChildren={site('SSL加密')} unCheckedChildren={site('不SSL加密')} />
  };

  logo = {
    title: site('LOGO'),
    form: <UploadComponent />,
    table: ({ text, record, view }: FieldProps<string, DomainSetting, DomainSettingPage>) => (
      <img src={text} alt="logo" />
    )
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
