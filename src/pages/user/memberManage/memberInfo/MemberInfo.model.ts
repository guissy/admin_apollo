import gql from 'graphql-tag';

/** 个人资料 */
export interface MemberInfo {
  id: number;
  tags: string;
  truename: string;
  pwd_login: string;
  pwd_money: string;
  user_type: string;
  level: string;
  created: string;
  last_login: string;
  ip: string;
  last_ip: string;
  channel: string;
  country: string;
  province: string;
  city: string;
  nationality: string;
  ctype: string;
  language: string;
  birth: string;
  gender: string;
  idcard: string;
  mobile: string;
  qq: string;
  weixin: string;
  email: string;
  skype: string;
  address: string;
  postcode: string;
  question_id: string;
  answer: string;
  memo: string;
}

/** 缓存数据：个人资料 */
export const MemberInfoFragment = gql`
  fragment MemberInfoFragment on MemberInfo {
    id
    tags
    truename
    pwd_login
    pwd_money
    user_type
    level
    created
    last_login
    ip
    last_ip
    channel
    country
    province
    city
    nationality
    ctype
    language
    birth
    gender
    idcard
    mobile
    qq
    weixin
    email
    skype
    address
    postcode
    question_id
    answer
    memo
  }
`;

/** 安全问题 */
export interface QuestionId {
  id: number;
  name: string;
}
/** 安全问题 GraphQL */
export const questionIdQuery = gql`
  query {
    questionIdList @rest(type: "QuestionIdResult", path: "/questionId") {
      data {
        id
        name
      }
    }
  }
`;
