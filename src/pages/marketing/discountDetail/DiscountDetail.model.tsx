import gql from 'graphql-tag';

/** 实体类型 */
export interface DiscountDetail {
  id: number;
  user_name: string;
  status: number;
  agent_name: string;
  valid_coupon: string;
}

/** 缓存数据：实体类型 */
export const DiscountDetailFragment = gql`
  fragment DiscountDetailFragment on DiscountDetail {
    id
    user_name
    status
    agent_name
    valid_coupon
  }
`;
