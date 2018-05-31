import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkUI from '../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../../zongzi/pc/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { Result } from '../../../utils/result';
import MemberLabelPage from './MemberLabel.page';
import { MemberLabel, MemberLabelFragment } from './MemberLabel.model';

const site = withLocale.site;

/** 会员标签字段 */
export default class MemberLabelField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  title = {
    title: site('标签名称'),
    form: <Input />
  };

  content = {
    title: site('描述'),
    form: <Input />
  };

  admin_name = {
    title: site('建立人'),
    form: <Input />
  };

  inserted = {
    title: site('建立时间'),
    form: <Input />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, MemberLabel, MemberLabelPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/memberLabel/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['memberLabelQuery']}
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
