import gql from 'graphql-tag';

/** 实体类型 */
export interface DiscountSetting {
  id: number;
  valid_money: number;
  memo: string;
  status: string;
  upper_limit: number;
  created_uname: string;
}

/** 缓存数据：实体类型 */
export const DiscountSettingFragment = gql`
  fragment DiscountSettingFragment on DiscountSetting {
    id
    valid_money
    memo
    status
    upper_limit
    created_uname
  }
`;
