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
import OtherMemberPage from './OtherMember.page';
import { OtherMember, OtherMemberFragment, Name } from './OtherMember.model';

const site = withLocale.site;

/** 第三方会员查询字段 */
export default class OtherMemberField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  uname = {
    title: site('会员账号'),
    form: <Input />,
    search: <Input />
  };

  name = {
    title: site('第三方游戏'),
    form: ({ text, record, view, value, onChange }: FieldProps<string, Name, OtherMemberPage>) => (
      <Query
        query={gql`
          query {
            thirdGames @rest(type: "ThirdNameResult", path: "/thirdGame") {
              data {
                id
                name
              }
            }
          }
        `}
      >
        {({
          data: { thirdGames = { data: [] as Name[] } } = {}
        }: ChildProps<{}, { thirdGames: Result<Name[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {thirdGames.data.map((type: Name, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    search: 'form'
  };

  game_username = {
    title: site('第三方账号'),
    form: <Input />,
    search: <Input />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, OtherMember, OtherMemberPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/otherMember/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['otherMemberQuery']}
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
