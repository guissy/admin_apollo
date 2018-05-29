import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { DatePicker, Input, Select } from 'antd';
import { ChildProps, Query } from 'react-apollo';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps } from '../../../utils/TableFormField';
import { Result } from '../../../utils/result';
import CmsLogPage from './CmsLog.page';
import { CmsLogResult, cmsLogResultQuery, OpType, opTypeQuery } from './CmsLog.model';

const site = withLocale.site;

/** 代理推广资源字段 */
export default class CmsLogField<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    title: site('记录编号')
  };

  created_uname = {
    title: site('操作者'),
    form: <Input />,
    search: 'form'
  };

  user_name = {
    title: site('被操作者'),
    form: <Input />,
    search: 'form'
  };

  ip = {
    title: site('操作IP'),
    form: <Input />,
    search: 'form'
  };

  module = {
    title: site('模块名称'),
    form: <Input />,
    search: 'form'
  };

  op_type = {
    title: site('操作类型'),
    form: ({ text, record, view, value, onChange }: FieldProps<string, OpType, CmsLogPage>) => (
      <Query query={opTypeQuery}>
        {({
          data: { opTypeList = { data: [] as OpType[] } } = {}
        }: ChildProps<{}, { opTypeList: Result<OpType[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {opTypeList.data.map((type: OpType, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, OpType, CmsLogPage>) => (
      <Query query={opTypeQuery}>
        {({
          data: { opTypeList = { data: [] as OpType[] } } = {}
        }: ChildProps<{}, { opTypeList: Result<OpType[]> }, {}>) =>
          opTypeList.data.filter(opType => opType.id === Number(text)).map(opType => opType.name)
        }
      </Query>
    )
  };

  result = {
    title: site('结果'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, CmsLogResult, CmsLogPage>) => (
      <Query query={cmsLogResultQuery}>
        {({
          data: { cmsLogResultList = { data: [] as CmsLogResult[] } } = {}
        }: ChildProps<{}, { cmsLogResultList: Result<CmsLogResult[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {cmsLogResultList.data.map((type: CmsLogResult, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, CmsLogResult, CmsLogPage>) => (
      <Query query={cmsLogResultQuery}>
        {({
          data: { cmsLogResultList = { data: [] as CmsLogResult[] } } = {}
        }: ChildProps<{}, { cmsLogResultList: Result<CmsLogResult[]> }, {}>) =>
          cmsLogResultList.data
            .filter(cmsLogResult => cmsLogResult.id === Number(text))
            .map(cmsLogResult => cmsLogResult.name)
        }
      </Query>
    )
  };

  created = {
    title: site('操作时间'),
    form: <DatePicker.RangePicker />,
    search: 'form'
  };

  remark = {
    title: site('详细信息'),
    form: <Input />,
    search: 'form'
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
