import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../../utils/formRule';
import LinkUI from '../../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../../utils/TableFormField';
import TableAction from '../../../../zongzi/pc/table/TableAction';
import { messageResult } from '../../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { Result } from '../../../../utils/result';
import PromotionPage from './Promotion.page';
import { Promotion, PromotionFragment } from './Promotion.model';

const site = withLocale.site;

/** 推广信息字段 */
export default class PromotionField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  code = {
    title: site('推广码'),
    form: <Input />
  };

  site = {
    title: site('个人网站'),
    form: <Input />
  };

  link = {
    title: site('会员推广链接'),
    form: <Input />
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, Promotion, PromotionPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/promotion/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['promotionQuery']}
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
