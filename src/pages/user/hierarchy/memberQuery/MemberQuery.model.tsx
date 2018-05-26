import gql from 'graphql-tag';

/** 会员查询 */
export interface MemberQuery {
  id: number;
  name: string;
  agnet: string;
  created: string;
  last_login: string;
  deposit_total: string;
  deposit_money: string;
  deposit_max: string;
  withdraw_total: string;
  withdraw_money: string;
  layered: string;
  lock: string;
}

/** 缓存数据：会员查询 */
export const MemberQueryFragment = gql`
  fragment MemberQueryFragment on MemberQuery {
    id
    name
    agnet
    created
    last_login
    deposit_total
    deposit_money
    deposit_max
    withdraw_total
    withdraw_money
    layered
    lock
  }
`;

/** 分层 */
export interface MemberQueryLayered {
  id: number;
  name: string;
}
/** 分层 GraphQL */
export const memberQueryLayeredQuery = gql`
  query {
    memberQueryLayeredList @rest(type: "MemberQueryLayeredResult", path: "/memberQueryLayered") {
      data {
        id
        name
      }
    }
  }
`;
/** 锁定 */
export interface MemberQueryLock {
  id: number;
  name: string;
}
/** 锁定 GraphQL */
export const memberQueryLockQuery = gql`
  query {
    memberQueryLockList @rest(type: "MemberQueryLockResult", path: "/memberQueryLock") {
      data {
        id
        name
      }
    }
  }
`;
