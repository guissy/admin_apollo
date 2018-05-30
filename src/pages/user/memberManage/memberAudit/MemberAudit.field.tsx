import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
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
import MemberAuditPage from './MemberAudit.page';
import { MemberAudit, MemberAuditFragment } from './MemberAudit.model';

const site = withLocale.site;

/** 会员稽核信息字段 */
export default class MemberAuditField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  money = {
    title: site('存款金额'),
    form: <Input />
  };

  coupon_money = {
    title: site('优惠金额'),
    form: <Input />
  };

  valid_bet = {
    title: site('有效投注额'),
    form: <Input />
  };

  withdraw_bet_principal = {
    title: site('常态打码量'),
    form: <Input />
  };

  withdraw_bet_coupon = {
    title: site('优惠打码量'),
    form: <Input />
  };

  is_pass = {
    title: site('是否到达投注额'),
    form: <Input />
  };

  deduct_coupon = {
    title: site('扣除优惠'),
    form: <Input />
  };

  deduct_admin_fee = {
    title: site('扣除行政费'),
    form: <Input />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, MemberAudit, MemberAuditPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/memberAudit/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['memberAuditQuery']}
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
                  {site('编辑')}
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
