import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input, InputNumber, Checkbox, Tag, Select, Switch, DatePicker } from 'antd';
import { Query, ChildProps, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { moneyPattern } from '../../../../utils/formRule';
import LinkComponent from '../../../components/link/LinkComponent';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { FieldProps, notInTable } from '../../../../utils/TableFormField';
import TableActionComponent from '../../../components/table/TableActionComponent';
import { messageResult } from '../../../../utils/showMessage';
import { GqlResult, writeFragment } from '../../../../utils/apollo';
import { Result } from '../../../../utils/result';
import MemberInfoPage from './MemberInfo.page';
import { MemberInfo, MemberInfoFragment, QuestionId, questionIdQuery } from './MemberInfo.model';

const site = withLocale.site;

/** 个人资料字段 */
export default class MemberInfoField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  tags = {
    title: site('标签'),
    form: <Input />
  };

  truename = {
    title: site('真实姓名'),
    form: <Input />
  };

  pwd_login = {
    title: site('登陆密码'),
    form: <Input />
  };

  pwd_money = {
    title: site('取款密码'),
    form: <Input />
  };

  user_type = {
    title: site('用户类型'),
    form: <Input />
  };

  level = {
    title: site('会员层级'),
    form: <Input />
  };

  created = {
    title: site('注册时间'),
    form: <Input />
  };

  last_login = {
    title: site('最后登陆时间'),
    form: <Input />
  };

  ip = {
    title: site('注册ip'),
    form: <Input />
  };

  last_ip = {
    title: site('最后登陆ip'),
    form: <Input />
  };

  channel = {
    title: site('注册来源'),
    form: <Input />
  };

  country = {
    title: site('国家'),
    form: <Input />
  };

  'province,city' = {
    title: site('省市'),
    form: <Input />,
    table: ({ text, record, view }: FieldProps<string, MemberInfo, MemberInfoPage>) => (
      <>
        {record.province} <br />
        {record.city}
      </>
    )
  };

  nationality = {
    title: site('国籍'),
    form: <Input />
  };

  ctype = {
    title: site('货币'),
    form: <Input />
  };

  language = {
    title: site('语言'),
    form: <Input />
  };

  birth = {
    title: site('生日'),
    form: <Input />
  };

  gender = {
    title: site('性别'),
    form: <Input />
  };

  idcard = {
    title: site('身份证号码'),
    form: <Input />
  };

  mobile = {
    title: site('手机'),
    form: <Input />
  };

  qq = {
    title: site('QQ'),
    form: <Input />
  };

  weixin = {
    title: site('微信'),
    form: <Input />
  };

  email = {
    title: site('邮箱'),
    form: <Input />
  };

  skype = {
    title: site('Skype'),
    form: <Input />
  };

  address = {
    title: site('地址'),
    form: <Input />
  };

  postcode = {
    title: site('邮编'),
    form: <Input />
  };

  question_id = {
    title: site('安全问题'),
    form: ({
      text,
      record,
      view,
      value,
      onChange
    }: FieldProps<string, QuestionId, MemberInfoPage>) => (
      <Query query={questionIdQuery}>
        {({
          data: { questionIdList = { data: [] as QuestionId[] } } = {}
        }: ChildProps<{}, { questionIdList: Result<QuestionId[]> }, {}>) => (
          <Select defaultValue={value} onChange={onChange}>
            {questionIdList.data.map((type: QuestionId, i: number) => (
              <Select.Option key={i} value={String(type.id)}>
                {type.name}
              </Select.Option>
            ))}
          </Select>
        )}
      </Query>
    ),
    table: ({ text, record, view }: FieldProps<string, QuestionId, MemberInfoPage>) => (
      <Query query={questionIdQuery}>
        {({
          data: { questionIdList = { data: [] as QuestionId[] } } = {}
        }: ChildProps<{}, { questionIdList: Result<QuestionId[]> }, {}>) =>
          questionIdList.data
            .filter(questionId => questionId.id === Number(text))
            .map(questionId => questionId.name)
        }
      </Query>
    )
  };

  answer = {
    title: site('安全答案'),
    form: <Input />
  };

  memo = {
    title: site('备注'),
    form: <Input />
  };

  constructor(view: React.PureComponent<T>) {
    super(view);
  }
}
