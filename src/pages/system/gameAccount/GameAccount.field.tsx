import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input } from 'antd';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../../zongzi/pc/table/TableAction';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult } from '../../../utils/apollo';
import GameAccountPage from './GameAccount.page';
import { GameAccount } from './GameAccount.model';

const site = withLocale.site;

/** 游戏后台帐号字段 */
export default class GameAccountField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  partner_name = {
    title: site('游戏类型')
  };

  admin_url = {
    title: site('后台网址')
  };

  admin_account = {
    title: site('登录账号')
  };

  admin_password = {
    title: site('登录密码')
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
