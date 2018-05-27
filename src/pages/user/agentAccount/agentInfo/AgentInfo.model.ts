import gql from 'graphql-tag';

/** 代理管理 */
export interface AgentInfo {
  id: number;
  name: string;
  play_num: string;
  truename: string;
  inferisors_num: string;
  up_agent_name: string;
  pwd1_login: string;
  pwd_money: string;
  type: string;
  level: string;
  created: string;
  last_login: string;
  register_ip: string;
  login_ip: string;
  channel: string;
  mobile: string;
  email: string;
  qq: string;
  skype: string;
  weixin: string;
  gender: string;
  brith: string;
  country: string;
  language_name: string;
  province: string;
  ctype: string;
  memo: string;
}

/** 缓存数据：代理管理 */
export const AgentInfoFragment = gql`
  fragment AgentInfoFragment on AgentInfo {
    id
    name
    play_num
    truename
    inferisors_num
    up_agent_name
    pwd1_login
    pwd_money
    type
    level
    created
    last_login
    register_ip
    login_ip
    channel
    mobile
    email
    qq
    skype
    weixin
    gender
    brith
    country
    language_name
    province
    ctype
    memo
  }
`;
