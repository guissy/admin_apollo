import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, Tag, DatePicker, InputNumber, Radio, Select } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../utils/formRule';
import LinkComponent from '../../components/link/LinkComponent';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableActionComponent from '../../components/table/TableActionComponent';
import { messageResult, messageSuccess } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { ActivityContentItem, ActivityContentItemFragment } from './Activitycontent.model';
import CheckboxComponent from '../../components/checkbox/CheckboxComponent';
import ActivityApply from '../activityApply/ActivityApply';
import ActivityContent from './ActivityContent';
import { ActivityType } from './ActivityContent.model';
import { Result } from '../../../utils/result';
import environment from '../../../utils/environment';
import { getFullSrc } from '../../../utils/env.utils';
import { Record } from '../content/ContentManage.model';
import { ActivityApplyItem } from '../activityApply/ActivityApply.model';
import LanguageComponent from '../../components/language/LanguageComponent';
import UploadComponent from '../../components/upload/UploadComponent';
import Editor from '../../components/richTextEditor/Editor';

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
    form: <input type="hidden" />,
    table: notInTable
  };

  types = {
    title: site('优惠类型'),
    table: ({ text, record, view }: FieldProps<string, ActivityContentItem, ActivityContent>) => {
      let types: React.ReactNode = record.types.map((item: { name: string }, index: number) => (
        <span key={index} style={{ display: 'inline-block', padding: 2 }}>
          {item.name}
        </span>
      ));
      return <div>{types}</div>;
    },
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, ActivityContentItem, ActivityContent>) => (
      <Query
        query={gql`
          query {
            activityTypes @rest(type: "ActivityTypeResult", path: "/active/types") {
              data {
                id
                name
              }
            }
          }
        `}
      >
        {({
          data: { activityTypes = { data: [] } } = {}
        }: GqlResult<'activityTypes', ActivityType[]>) => (
          <CheckboxComponent
            options={activityTypes.data}
            name="name"
            formatOut={['name', 'id']}
            value={value}
            onChange={onChange}
          />
        )}
      </Query>
    )
  };

  name = {
    title: site('优惠活动名称'),
    form: <Input />
  };

  title = {
    title: site('优惠活动标题'),
    form: <Input />
  };

  cover = {
    title: site('活动图片'),
    table: ({ text, record, view }: FieldProps<string, ActivityContentItem, ActivityContent>) => (
      <img src={text} style={{ height: '20px' }} />
    ),
    form: <UploadComponent onDone={() => messageSuccess(site('上传成功'))} />
  };

  'begin_time,end_time' = {
    title: site('开始时间'),
    table: ({ record }: FieldProps<string, ActivityContentItem, ActivityContent>) =>
      record.begin_time,
    form: <DatePicker.RangePicker />
  };

  end_time = {
    title: site('结束时间')
  };

  language_id = {
    title: site('语言'),
    table: notInTable,
    form: <LanguageComponent labelInValue={true} />
  };

  language_name = {
    title: site('语言')
  };

  description = {
    title: site('优惠活动描述'),
    form: <Input.TextArea />
  };

  sort = {
    title: site('排序'),
    notInTable: true,
    form: <InputNumber />
  };

  open_type = {
    title: site('打开方式'),
    notInTable: true,
    form: (
      <Radio.Group>
        <Radio value={'1'}>{site('新窗口')}</Radio>
        <Radio value={'2'}>{site('本页面跳转')}</Radio>
        <Radio value={'4'}>{site('下拉展开')}</Radio>
      </Radio.Group>
    )
  };

  link = {
    title: site('链接'),
    notInTable: true,
    form: ({ form }: FieldProps<string, ActivityContentItem, ActivityContent>) =>
      form.getFieldValue('open_type') !== '4' ? <Input /> : null
  };

  content = {
    title: site('PC优惠规则编辑'),
    notInTable: true,
    form: ({ form, value, onChange }: FieldProps<string, ActivityContentItem, ActivityContent>) => (
      <Editor
        id={'contentpc'}
        hidden={form.getFieldValue('open_type') === '4'}
        value={value}
        onChange={onChange}
      />
    )
  };

  content2 = {
    title: site('h5优惠规则编辑'),
    notInTable: true,
    form: ({ form, value, onChange }: FieldProps<string, ActivityContentItem, ActivityContent>) => (
      <Editor
        id={'contenth5'}
        hidden={form.getFieldValue('open_type') === '4'}
        value={value}
        onChange={onChange}
      />
    )
  };

  apply_times = {
    title: site('会员申请次数'),
    notInTable: true,
    form: <Input />
  };

  created = {
    title: site('建立时间')
  };
  created_uname = {
    title: site('建立人')
  };
  updated = {
    title: site('修改时间')
  };
  updated_uname = {
    title: site('修改人')
  };
  status = {
    title: site('状态'),
    table: ({ text, record }: FieldProps<string, ActivityContentItem, ActivityContent>) => {
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

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, ActivityApplyItem, ActivityApply>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation statusMutation($body: StatusInput!) {
                status(body: $body)
                  @rest(
                    bodyKey: "body"
                    path: "/active/apply/status"
                    method: "PUT"
                    type: "StatusResult"
                  ) {
                  state
                  message
                }
              }
            `}
          >
            {(pass, { data }) => (
              <TableActionComponent>
                {record.status === 'pending' && (
                  <>
                    <LinkComponent
                      confirm={true}
                      onClick={() =>
                        pass({ variables: { body: { id: record.id, status: 'pass' } } })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ActivityApplyItem', {
                              id: record.id,
                              status: 'pass'
                            });
                            return v.data.status;
                          })
                      }
                    >
                      {site('通过')}
                    </LinkComponent>
                    <LinkComponent
                      confirm={true}
                      onClick={() =>
                        pass({ variables: { body: { id: record.id, status: 'rejected' } } })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ActivityApplyItem', {
                              id: record.id,
                              status: 'rejected'
                            });
                            return v.data.status;
                          })
                      }
                    >
                      {site('拒绝')}
                    </LinkComponent>
                  </>
                )}
                <LinkComponent
                  onClick={() => {
                    this.setState({
                      edit: { visible: true, record }
                    });
                  }}
                >
                  编辑
                </LinkComponent>
              </TableActionComponent>
            )}
          </Mutation>
        )
      );
    }
  };

  constructor(view: React.PureComponent<T & { client: ApolloClient<{}> }>) {
    super(view);
  }
}
