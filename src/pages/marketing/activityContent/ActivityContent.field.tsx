import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { DatePicker, Input, InputNumber, Radio, Select, Tag } from 'antd';
import { Mutation, Query } from 'react-apollo';
import gql from 'graphql-tag';
import LinkUI from '../../../zongzi/pc/link/LinkUI';
import withLocale from '../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../utils/TableFormField';
import TableAction from '../../../zongzi/pc/table/TableAction';
import { messageResult, messageSuccess } from '../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../utils/apollo';
import { ActivityContent, ActivityType } from './ActivityContent.model';
import CheckboxUI from '../../../zongzi/pc/checkbox/CheckboxUI';
import ActivityApplyPage from '../activityApply/ActivityApply.page';
import ActivityContentPage from './ActivityContent.page';
import { ActivityApply } from '../activityApply/ActivityApply.model';
import LanguageComponent from '../../../zongzi/pc/language/LanguageUI';
import UploadUI from '../../../zongzi/pc/upload/UploadUI';
import Editor from '../../../zongzi/pc/editor/Editor';

const site = withLocale.site;

/** Activitycontent字段 */
export default class ActivityContentField<T> extends TableFormField<T> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  types = {
    title: site('优惠类型'),
    table: ({ text, record, view }: FieldProps<string, ActivityContent, ActivityContentPage>) => {
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
    }: FieldProps<string, ActivityContent, ActivityContentPage>) => (
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
          <CheckboxUI
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

  type_id = {
    search: this.types.form
  };

  name = {
    title: site('优惠活动名称'),
    form: <Input />,
    search: <Input />
  };

  title = {
    title: site('优惠活动标题'),
    form: <Input />
  };

  cover = {
    title: site('活动图片'),
    table: ({ text, record, view }: FieldProps<string, ActivityContent, ActivityContentPage>) => (
      <img src={text} style={{ height: '20px' }} />
    ),
    form: <UploadUI onDone={() => messageSuccess(site('上传成功'))} />
  };

  'begin_time,end_time' = {
    title: site('开始时间'),
    table: ({ record }: FieldProps<string, ActivityContent, ActivityContentPage>) =>
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
    form: ({ form, hide }: FieldProps<string, ActivityContent, ActivityContentPage>) => (
      <Input ref={() => hide(form.getFieldValue('open_type') === '4')} />
    )
  };

  content = {
    title: site('PC优惠规则编辑'),
    notInTable: true,
    form: ({
      form,
      value,
      onChange,
      hide
    }: FieldProps<string, ActivityContent, ActivityContentPage>) => (
      <Editor
        id={'contentpc'}
        hidden={form.getFieldValue('open_type') === '4'}
        ref={() => hide(form.getFieldValue('open_type') === '4')}
        value={value}
        onChange={onChange}
      />
    )
  };

  content2 = {
    title: site('h5优惠规则编辑'),
    notInTable: true,
    form: ({
      form,
      value,
      onChange,
      hide
    }: FieldProps<string, ActivityContent, ActivityContentPage>) => (
      <Editor
        id={'contenth5'}
        hidden={form.getFieldValue('open_type') === '4'}
        ref={() => hide(form.getFieldValue('open_type') === '4')}
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
    table: ({ text, record }: FieldProps<string, ActivityContent, ActivityContentPage>) => {
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

  memo = {
    title: site('备注')
  };

  oparation = {
    title: site('操作'),
    table: ({ record, view }: FieldProps<string, ActivityApply, ActivityApplyPage>) => {
      return (
        !record.isTotalRow && (
          <Mutation
            mutation={gql`
              mutation removeMutation($id: RemoveInput!) {
                remove(id: $id)
                  @rest(path: "/active/manual/:id", method: "DELETE", type: "RemoveResult") {
                  state
                  message
                }
              }
            `}
            refetchQueries={['activityContentQuery']}
          >
            {remove => (
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
                {status => (
                  <TableAction>
                    <LinkUI
                      confirm={true}
                      onClick={() =>
                        status({
                          variables: {
                            body: {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            }
                          }
                        })
                          .then(messageResult('status'))
                          .then((v: GqlResult<'status'>) => {
                            writeFragment(this.props.client, 'ActivityContent', {
                              id: record.id,
                              status: record.status === 'enabled' ? 'disabled' : 'enabled'
                            });
                            return v.data && v.data.status;
                          })
                      }
                    >
                      {record.status === 'enabled' ? site('停用') : site('启用')}
                    </LinkUI>
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
