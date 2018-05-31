import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input } from 'antd';
import { ChildProps, Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../../zongzi/pc/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult } from '../../../utils/apollo';
import DiscountManagePage from './DiscountManage.page';
import { DiscountManage } from './DiscountManage.model';
import ActivityApplyPage from '../activityApply/ActivityApply.page';
import { ActivityApply } from '../activityApply/ActivityApply.model';
import { Link } from 'react-router-dom';
import CheckboxUI from '../../../zongzi/pc/checkbox/CheckboxUI';
import { Result } from '../../../utils/result';

const site = withLocale.site;

interface UserLevel {
  id: number;
  name: string;
}

/** DiscountManage字段 */
export default class DiscountManageField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('活动名称'),
    form: <Input />,
    table: ({ text, record, view }: FieldProps<string, ActivityApply, ActivityApplyPage>) => (
      <Link
        to={`/discount/${record.id}`}
        onClick={() => {
          this.setState({ detail: record });
        }}
      >
        {text}
      </Link>
    )
  };

  effect_time = {
    title: site('有效时间')
  };

  people_coupon = {
    title: site('实际发放人数/实际发放金额')
  };

  created = {
    title: site('创建时间')
  };

  created_uname = {
    title: site('创建人')
  };

  withdraw_per = {
    title: site('打码量(%)')
  };

  member_level = {
    title: site('层级'),
    form: ({ record, view }: FieldProps<string, DiscountManage, DiscountManagePage>) => (
      <Query
        query={gql`
          query {
            userLevels @rest(type: "UserLevelResult", path: "/user/levels") {
              data {
                id
                name
              }
            }
          }
        `}
      >
        {({
          data: { userLevels = { data: [] } } = {}
        }: ChildProps<{}, { userLevels: Result<UserLevel[]> }, {}>) => (
          <CheckboxUI options={userLevels.data} name="name" formatOut={['id', 'name']} key="id" />
        )}
      </Query>
    )
  };

  games = {
    title: site('游戏类型')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, DiscountManage, DiscountManagePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/discountManage/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['discountManageQuery']}
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
