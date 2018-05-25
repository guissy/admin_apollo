import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch, InputNumber, DatePicker } from 'antd';
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
import IdleAccountPage from './IdleAccount.page';
import { IdleAccount, IdleAccountFragment } from './IdleAccount.model';

const site = withLocale.site;

/** 闲置账号字段 */
export default class IdleAccountField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('用户名'),
    form: <Input />,
    search: <Input />
  };

  agent = {
    title: site('上级代理'),
    form: <Input />,
    search: <Input />
  };

  total = {
    title: site('总余额'),
    form: <InputNumber />,
    search: <InputNumber />
  };

  last_login = {
    title: site('最后登录时间'),
    search: <DatePicker.RangePicker />
  };

  balance = {
    title: site('总额小于'),
    form: <InputNumber />,
    search: <InputNumber />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, IdleAccount, IdleAccountPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/idleAccount/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['idleAccountQuery']}
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
                  编辑
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
