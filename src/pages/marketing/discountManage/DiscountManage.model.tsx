import gql from 'graphql-tag';

/** 实体类型 */
export interface DiscountManage {
  id: number;
  name: string;
  effect_time: string;
  people_coupon: string;
  created: string;
  created_uname: string;
  withdraw_per: number;
  member_level: string;
  games: string;
}

/** 缓存数据：实体类型 */
export const DiscountManageFragment = gql`
  fragment DiscountManageFragment on DiscountManage {
    id
    name
    effect_time
    people_coupon
    created
    created_uname
    withdraw_per
    member_level
    games
  }
`;
