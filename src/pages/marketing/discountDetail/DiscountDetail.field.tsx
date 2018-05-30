import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Tag } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../components/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../components/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult } from '../../../utils/apollo';
import DiscountDetailPage from './DiscountDetail.page';
import { DiscountDetail } from './DiscountDetail.model';

const site = withLocale.site;

/** DiscountDetail字段 */
export default class DiscountDetailField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  user_name = {
    title: site('会员账号')
  };

  status = {
    title: site('返水状态'),
    table: ({ text, record, view }: FieldProps<string, DiscountDetail, DiscountDetailPage>) => (
      <>
        {record.status === 0 ? (
          <Tag className="audit-ed">{site('已返')}</Tag>
        ) : (
          <Tag className="audit-refused">{site('冲销')}</Tag>
        )}
      </>
    )
  };

  agent_name = {
    title: site('代理商')
  };

  valid_coupon = {
    title: site('有效总投注')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, DiscountDetail, DiscountDetailPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/discountDetail/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['discountDetailQuery']}
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
