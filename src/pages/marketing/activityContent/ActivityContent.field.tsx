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
import { Record } from '../content/ContentManage.model';
import CheckboxComponent from '../../components/checkbox/CheckboxComponent';
import ActivityApply from '../activityApply/ActivityApply';

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

  types = {
    title: site('优惠类型'),
    table: ({ text, record, view }: FieldProps<string, ActivityContentItem, ActivityContent>) => {
      let types: React.ReactNode = record.types.map((item: { name: string }, index: number) => (
        <span key={index}>{item.name}</span>
      ));
      return <div>{types}</div>;
    }
    // formItemRender: () => (
    //   <CheckboxComponent
    //     options={this.props.contentManage.types}
    //     name="name"
    //     formatOut={['name', 'id']}
    //   />
    // ),
  };

  name = {
    title: site('优惠活动名称'),
    edit: () => <Input />
  };

  title = {
    title: site('优惠活动标题'),
    edit: () => <Input />
  };

  constructor(view: React.PureComponent<T & { client: ApolloClient<{}> }>) {
    super(view);
  }
}
