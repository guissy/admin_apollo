---
    to: src/pages/<%= h.inflection.camelize(name, true) %>/<%= h.inflection.camelize(name) %>.field.tsx
---
<% Page = h.inflection.camelize(name); page = h.inflection.camelize(name, true) -%>
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
import <%= Page %> from './<%= Page %>';
import { <%= Page %>Item, <%= Page %>ItemFragment } from './<%= Page %>.model';

const site = withLocale.site;

interface <%= Page %>Result {
  data: <%= Page %>Item[];
}

interface <%= Page %> {
  <%= name %>: <%= Page %>Result;
}

/** <%= Page %>字段 */
export default class <%= Page %>Field<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    edit: <input type="hidden" />,
    table: notInTable
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
