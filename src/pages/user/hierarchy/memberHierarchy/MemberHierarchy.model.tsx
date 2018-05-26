import gql from 'graphql-tag';

/** 会员层级 */
export interface MemberHierarchy {
  id: number;
  name: string;
  memo: string;
  register_stime: string;
  register_etime: string;
  deposit_stime: string;
  deposit_etime: string;
  deposit_min: string;
  deposit_max: string;
  deposit_times: string;
  deposit_money: string;
  max_deposit_money: string;
  withdraw_times: string;
  withdraw_count: string;
  num: string;
  comment: string;
}

/** 缓存数据：会员层级 */
export const MemberHierarchyFragment = gql`
  fragment MemberHierarchyFragment on MemberHierarchy {
    id
    name
    memo
    register_stime
    register_etime
    deposit_stime
    deposit_etime
    deposit_min
    deposit_min
    deposit_max
    deposit_times
    deposit_money
    max_deposit_money
    withdraw_times
    withdraw_count
    num
    comment
  }
`;
