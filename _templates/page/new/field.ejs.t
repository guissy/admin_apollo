---
    to: src/pages/<%= name %>/<%= Name %>.field.tsx
---
import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, Select } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import <%= Name %> from './<%= Name %>';
import { <%= Name %>Item, <%= Name %>ItemFragment } from './<%= Name %>.model';

const site = withLocale.site;

interface <%= Name %>Result {
  data: <%= Name %>Item[];
}

interface <%= Name %> {
  <%= name %>: <%= Name %>Result;
}

/** <%= Name %>字段 */
export default class <%= Name %>Field<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    edit: <input type="hidden" />,
    table: notInTable
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
