import * as React from 'react';
import ApolloClient from 'apollo-client/ApolloClient';
import { Input } from 'antd';
import withLocale from '../../../../utils/withLocale';
import TableFormField, { notInTable } from '../../../../utils/TableFormField';

const site = withLocale.site;

/** 代理管理字段 */
export default class AgentInfoField<T extends { client: ApolloClient<{}> }> extends TableFormField<
  T
> {
  id = {
    form: <input type="hidden" />,
    table: notInTable
  };

  name = {
    title: site('代理用户名'),
    form: <Input />
  };

  play_num = {
    title: site('会员数'),
    form: <Input />
  };

  truename = {
    title: site('真实姓名'),
    form: <Input />
  };

  inferisors_num = {
    title: site('下级代理数'),
    form: <Input />
  };

  up_agent_name = {
    title: site('上级代理'),
    form: <Input />
  };

  pwd1_login = {
    title: site('登陆密码'),
    form: <Input />
  };

  pwd_money = {
    title: site('取款密码'),
    form: <Input />
  };

  type = {
    title: site('用户类型'),
    form: <Input />
  };

  level = {
    title: site('所属层'),
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

  register_ip = {
    title: site('注册ip'),
    form: <Input />
  };

  login_ip = {
    title: site('最后登陆ip'),
    form: <Input />
  };

  channel = {
    title: site('注册来源'),
    form: <Input />
  };

  mobile = {
    title: site('联系电话'),
    form: <Input />
  };

  email = {
    title: site('邮箱'),
    form: <Input />
  };

  qq = {
    title: site('QQ'),
    form: <Input />
  };

  skype = {
    title: site('skype'),
    form: <Input />
  };

  weixin = {
    title: site('微信'),
    form: <Input />
  };

  gender = {
    title: site('性别'),
    form: <Input />
  };

  brith = {
    title: site('生日'),
    form: <Input />
  };

  country = {
    title: site('目标市场国家'),
    form: <Input />
  };

  language_name = {
    title: site('语言'),
    form: <Input />
  };

  province = {
    title: site('目标市场省份'),
    form: <Input />
  };

  ctype = {
    title: site('货币'),
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
