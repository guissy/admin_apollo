---
to: src/pages/<%= h.folder(name) %>.field.tsx
unless_exists: true
---
<% Page = h.Page(name); page = h.page(name) -%>
import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import <%= Page %>Page from './<%= Page %>.page';
import { <%= Page %>, <%= Page %>Fragment } from './<%= Page %>.model';

const site = withLocale.site;

/** <%= Page %>字段 */
export default class <%= Page %>Field<T extends { client: ApolloClient<{}> }> extends TableFormField<T> {
  id = {
    table: notInTable
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
