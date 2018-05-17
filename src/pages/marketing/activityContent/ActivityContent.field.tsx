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
import ActivityContent from './Activitycontent';
import { ActivityContentItem, ActivityContentItemFragment } from './Activitycontent.model';

const site = withLocale.site;

interface ActivityContentResult {
  data: ActivityContentItem[];
}

interface Activitycontent {
  activityContent: ActivityContentResult;
}

/** Activitycontent字段 */
export default class ActivityContentField<T> extends TableFormField<T> {
  id = {
    edit: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('优惠活动名称'),
    edit: () => <Input />
  };

  constructor(view: React.PureComponent<T & { client: ApolloClient<{}> }>) {
    super(view);
  }
}
