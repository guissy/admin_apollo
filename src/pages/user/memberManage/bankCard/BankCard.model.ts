import gql from 'graphql-tag';

/** 个人资料 */
export interface BankCard {
  id: number;
  card: string;
  bank_name: string;
  address: string;
  accountname: string;
  state: string;
  created_time: string;
  updated_time: string;
}

/** 缓存数据：个人资料 */
export const BankCardFragment = gql`
  fragment BankCardFragment on BankCard {
    id
    card
    bank_name
    address
    accountname
    state
    created_time
    updated_time
  }
`;

/** 银行名称 */
export interface BankName {
  id: number;
  name: string;
}
/** 银行名称 GraphQL */
export const bankNameQuery = gql`
  query {
    bankNameList @rest(type: "BankNameResult", path: "/bankName") {
      data {
        id
        name
      }
    }
  }
`;
/** 状态 */
export interface BankCardState {
  id: number;
  name: string;
}
/** 状态 GraphQL */
export const bankCardStateQuery = gql`
  query {
    bankCardStateList @rest(type: "BankCardStateResult", path: "/bankCardState") {
      data {
        id
        name
      }
    }
  }
`;
