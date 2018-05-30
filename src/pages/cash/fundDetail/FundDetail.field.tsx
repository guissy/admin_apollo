import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkUI from '../../components/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../components/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import FundDetailPage from './FundDetail.page';
import {
  FundDetail,
  FundDetailFragment,
  DealCategory,
  DealType,
  DealTypeFragment,
  DealTypesQuery,
  DealCategorysQuery
} from './FundDetail.model';

const site = withLocale.site;

/** 现金流水字段 */
export default class FundDetailField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    search: <input type="hidden" />,
    table: notInTable
  };

  username = {
    title: site('用户名'),
    form: <Input />,
    search: <Input />
  };

  no = {
    title: site('体系'),
    form: <Input />,
    search: <Input />
  };

  deal_category = {
    title: site('交易类别'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, DealCategory, FundDetailPage>) => (
      <Query query={DealCategorysQuery}>
        {({
          data: { dealCategorys = { data: [] as DealCategory[] } } = {}
        }: ChildProps<{}, { dealCategorys: Result<DealCategory[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {dealCategorys.data.map((type: DealCategory, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    search: 'form',
    table: ({ text, record, view }: FieldProps<string, FundDetail, FundDetailPage>) => (
      <Query query={DealCategorysQuery}>
        {({
          data: { dealCategorys = { data: [] as DealCategory[] } } = {}
        }: ChildProps<{}, { dealCategorys: Result<DealCategory[]> }, {}>) =>
          dealCategorys.data
            .filter(category => category.id === Number(text))
            .map(category => category.name)
        }
      </Query>
    )
  };

  deal_type = {
    title: site('交易类型'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, DealType, FundDetailPage>) => (
      <Query query={DealTypesQuery}>
        {({
          data: { dealTypes = { data: [] as DealType[] } } = {}
        }: ChildProps<{}, { dealTypes: Result<DealType[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {dealTypes.data.map((type: DealType, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    search: 'form',
    table: ({ text, record, view }: FieldProps<string, FundDetail, FundDetailPage>) => (
      <Query query={DealTypesQuery}>
        {({
          data: { dealTypes = { data: [] as DealType[] } } = {}
        }: ChildProps<{}, { dealTypes: Result<DealType[]> }, {}>) =>
          dealTypes.data
            .filter(dealType => dealType.id === Number(text))
            .map(dealType => dealType.name)
        }
      </Query>
    )
  };

  'start_time,end_time' = {
    title: site('交易时间'),
    form: <DatePicker.RangePicker />,
    search: 'form',
    table: ({ record, view }: FieldProps<string, FundDetail, FundDetailPage>) => record.start_time
  };

  deal_money = {
    title: site('交易金额')
  };

  balance = {
    title: site('交易后余额')
  };

  memo = {
    title: site('备注')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, FundDetail, FundDetailPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/fundDetail/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['fundDetailQuery']}
          >
            {remove => (
              <TableAction>
                <LinkUI
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
                </LinkUI>
                <LinkUI
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  编辑
                </LinkUI>
              </TableAction>
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
