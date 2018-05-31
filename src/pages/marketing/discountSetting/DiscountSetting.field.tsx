import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select, InputNumber } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../../zongzi/pc/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import DiscountSettingPage from './DiscountSetting.page';
import { DiscountSetting, DiscountSettingFragment } from './DiscountSetting.model';

const site = withLocale.site;

/** DiscountSetting字段 */
export default class DiscountSettingField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };
  valid_money = {
    title: site('有效总投注金额'),
    form: <InputNumber />
  };
  upper_limit = {
    title: site('优惠上限'),
    form: <InputNumber />
  };
  memo = {
    title: site('备注')
  };
  status = {
    title: site('状态'),
    table: ({ text, record }: FieldProps<string, DiscountSetting, DiscountSettingPage>) => {
      const STATUS = {
        enabled: <Tag className="audit-ed">{site('启用')}</Tag>,
        disabled: <Tag className="audit-refused">{site('停用')}</Tag>
      };
      return <div>{STATUS[text]}</div>;
    },
    form: (
      <Select style={{ width: 120 }}>
        <Select.Option value="enabled">{site('启用')}</Select.Option>
        <Select.Option value="disabled">{site('停用')}</Select.Option>
      </Select>
    )
  };
  created_uname = {
    title: site('创建人')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, DiscountSetting, DiscountSettingPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/discountSetting/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['discountSettingQuery']}
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
