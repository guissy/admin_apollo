import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../../utils/formRule';
import LinkUI from '../../../components/link/LinkUI';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../../utils/TableFormField';
import TableAction from '../../../components/table/TableAction';
import { messageResult } from '../../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { Result } from '../../../../utils/result';
import MemberHierarchyPage from './MemberHierarchy.page';
import { MemberHierarchy, MemberHierarchyFragment } from './MemberHierarchy.model';

const site = withLocale.site;

/** 会员层级字段 */
export default class MemberHierarchyField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('层级名称'),
    form: <Input />
  };

  memo = {
    title: site('描述'),
    form: <Input.TextArea />
  };

  'register_stime,register_etime' = {
    title: site('会员加入时间'),
    form: <DatePicker.RangePicker />,
    table: ({ text, record, view }: FieldProps<string, MemberHierarchy, MemberHierarchyPage>) => (
      <>
        {record.register_stime} <br />
        {record.register_etime}
      </>
    )
  };

  'deposit_stime,deposit_etime' = {
    title: site('存款时间'),
    form: <DatePicker.RangePicker />,
    table: ({ text, record, view }: FieldProps<string, MemberHierarchy, MemberHierarchyPage>) => (
      <>
        {record.deposit_stime} <br />
        {record.deposit_etime}
      </>
    )
  };

  'deposit_min,deposit_max' = {
    title: site('区间存款总额'),
    form: <Input />,
    table: ({ text, record, view }: FieldProps<string, MemberHierarchy, MemberHierarchyPage>) => (
      <>
        {record.deposit_min} - {record.deposit_max}
      </>
    )
  };

  deposit_min = {
    title: site('存款最小金额'),
    form: <InputNumber />,
    table: notInTable
  };

  deposit_max = {
    title: site('存款最大金额'),
    form: <InputNumber />,
    table: notInTable
  };

  deposit_times = {
    title: site('存款次数'),
    form: <InputNumber />
  };

  deposit_money = {
    title: site('存款总额'),
    form: <InputNumber />
  };

  max_deposit_money = {
    title: site('最大存款额'),
    form: <InputNumber />
  };

  withdraw_times = {
    title: site('提款次数'),
    form: <InputNumber />
  };

  withdraw_count = {
    title: site('提款总额'),
    form: <InputNumber />
  };

  num = {
    title: site('会员人数'),
    form: <Input />
  };

  comment = {
    title: site('备注'),
    form: <Input.TextArea />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, MemberHierarchy, MemberHierarchyPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/memberHierarchy/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['memberHierarchyQuery']}
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
