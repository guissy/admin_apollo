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
import FloatAdPage from './FloatAd.page';
import {
  FloatAd,
  FloatAdFragment,
  FloatAdPosition,
  floatAdPositionQuery,
  FloatAdPf,
  floatAdPfQuery,
  FloatAdApprove,
  floatAdApproveQuery
} from './FloatAd.model';
import LanguageComponent from '../../components/language/LanguageComponent';
import UploadComponent from '../../components/upload/UploadComponent';

const site = withLocale.site;

/** 浮动广告字段 */
export default class FloatAdField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('图片名称'),
    form: <Input />,
    search: 'form'
  };

  link = {
    title: site('跳转链接'),
    form: <Input />,
    search: 'form'
  };

  language = {
    title: site('语言'),
    form: <LanguageComponent />,
    search: 'form'
  };

  picture = {
    title: site('缩略图'),
    form: <UploadComponent />,
    table: ({ text, record, view }: FieldProps<string, FloatAd, FloatAdPage>) => (
      <img src={text} alt="picture" />
    )
  };

  position = {
    title: site('显示位置'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, FloatAdPosition, FloatAdPage>) => (
      <Query query={floatAdPositionQuery}>
        {({
          data: { floatAdPositionList = { data: [] as FloatAdPosition[] } } = {}
        }: ChildProps<{}, { floatAdPositionList: Result<FloatAdPosition[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {floatAdPositionList.data.map((type: FloatAdPosition, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, FloatAdPosition, FloatAdPage>) => (
      <Query query={floatAdPositionQuery}>
        {({
          data: { floatAdPositionList = { data: [] as FloatAdPosition[] } } = {}
        }: ChildProps<{}, { floatAdPositionList: Result<FloatAdPosition[]> }, {}>) =>
          floatAdPositionList.data
            .filter(floatAdPosition => floatAdPosition.id === Number(text))
            .map(floatAdPosition => floatAdPosition.name)
        }
      </Query>
    )
  };

  pf = {
    title: site('平台'),
    form: ({ text, record, view, value, onChange }: FieldProps<string, FloatAdPf, FloatAdPage>) => (
      <Query query={floatAdPfQuery}>
        {({
          data: { floatAdPfList = { data: [] as FloatAdPf[] } } = {}
        }: ChildProps<{}, { floatAdPfList: Result<FloatAdPf[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {floatAdPfList.data.map((type: FloatAdPf, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, FloatAdPf, FloatAdPage>) => (
      <Query query={floatAdPfQuery}>
        {({
          data: { floatAdPfList = { data: [] as FloatAdPf[] } } = {}
        }: ChildProps<{}, { floatAdPfList: Result<FloatAdPf[]> }, {}>) =>
          floatAdPfList.data
            .filter(floatAdPf => floatAdPf.id === Number(text))
            .map(floatAdPf => floatAdPf.name)
        }
      </Query>
    )
  };

  approve = {
    title: site('审核状态'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, FloatAdApprove, FloatAdPage>) => (
      <Query query={floatAdApproveQuery}>
        {({
          data: { floatAdApproveList = { data: [] as FloatAdApprove[] } } = {}
        }: ChildProps<{}, { floatAdApproveList: Result<FloatAdApprove[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {floatAdApproveList.data.map((type: FloatAdApprove, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, FloatAdApprove, FloatAdPage>) => (
      <Query query={floatAdApproveQuery}>
        {({
          data: { floatAdApproveList = { data: [] as FloatAdApprove[] } } = {}
        }: ChildProps<{}, { floatAdApproveList: Result<FloatAdApprove[]> }, {}>) =>
          floatAdApproveList.data
            .filter(floatAdApprove => floatAdApprove.id === Number(text))
            .map(floatAdApprove => floatAdApprove.name)
        }
      </Query>
    )
  };

  sort = {
    title: site('排序'),
    form: <Input />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, FloatAd, FloatAdPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/floatAd/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['floatAdQuery']}
          >
            {remove => (
              <TableActionComponent>
                <LinkComponent
                  confirm={true}
                  onClick={() =>
                    remove({ variables: { id: record.id } })
                      .then(messageResult('remove'))
                      .then((v: GqlResult<'remove'>) => {
                        return v.data && v.data.remove;
                      })
                  }
                >
                  {site('删除')}
                </LinkComponent>
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  {site('编辑')}
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
        )
      );
    }
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
