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
import Activitycontent from './Activitycontent';
import { ActivitycontentItem, ActivitycontentItemFragment } from './Activitycontent.model';

const site = withLocale.site;

interface ActivitycontentResult {
  data: ActivitycontentItem[];
}

interface Activitycontent {
  activityContent: ActivitycontentResult;
}

/** Activitycontent字段 */
export default class ActivitycontentField<
  T extends { client: ApolloClient<{}> }
> extends TableFormField<T> {
  id = {
    edit: <input type="hidden" />,
    table: notInTable
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
