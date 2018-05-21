import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { InputNumber, Input, Tag, Select } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import ActivityTypePage from './ActivityType.page';
import { ActivityType, ActivityTypeFragment } from './ActivityType.model';

const site = withLocale.site;

/** ActivityType字段 */
export default class ActivityTypeField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('优惠类型'),
    form: <Input />
  };

  description = {
    title: site('优惠类型描述'),
    form: <Input.TextArea />
  };

  sort = {
    title: site('排序'),
    form: <InputNumber />
  };

  created_uname = {
    title: site('创建人')
  };

  created = {
    title: site('创建时间')
  };

  updated = {
    title: site('修改时间')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, ActivityType, ActivityTypePage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/active/types/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['activityTypeQuery']}
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
