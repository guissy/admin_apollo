import gql from 'graphql-tag';

/** 现金流水 */
export interface FundDetail {
  id: number;
  username: string;
  no: string;
  deal_category: string;
  deal_type: string;
  start_time: string;
  end_time: string;
  deal_money: number;
  balance: number;
  memo: string;
}

/** 缓存数据：现金流水 */
export const FundDetailFragment = gql`
  fragment FundDetailFragment on FundDetail {
    id
    username
    no
    deal_category
    deal_type
    start_time
    end_time
    deal_money
    balance
    memo
  }
`;

/** 交易类别 */
export interface DealCategory {
  id: number;
  name: string;
}

/** 交易类别: 列表查询 */
export const DealCategorysQuery = gql`
  query {
    dealCategorys @rest(type: "DealCategoryResult", path: "/dealCategory") {
      data {
        id
        name
      }
    }
  }
`;

/** 交易类别: 结果片断 */
export const DealCategoryFragment = gql`
  fragment DealCategoryFragment on DealCategory {
    id
    name
  }
`;

/** 交易类型 */
export interface DealType {
  id: number;
  name: string;
}

/** 交易类型: 列表查询 */
export const DealTypesQuery = gql`
  query {
    dealTypes @rest(type: "DealTypeResult", path: "/dealType") {
      data {
        id
        name
      }
    }
  }
`;

/** 交易类型: 结果片断 */
export const DealTypeFragment = gql`
  fragment DealTypeFragment on DealType {
    id
    name
  }
`;
