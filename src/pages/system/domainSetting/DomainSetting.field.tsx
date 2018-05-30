import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Switch } from 'antd';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import DomainSettingPage from './DomainSetting.page';
import { DomainSetting } from './DomainSetting.model';
import UploadUI from '../../components/upload/UploadUI';
import Editor from '../../components/editor/Editor';

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
    form: <UploadUI />,
    table: ({ text, record, view }: FieldProps<string, DomainSetting, DomainSettingPage>) => (
      <img src={text} alt="logo" />
    )
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
