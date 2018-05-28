import gql from 'graphql-tag';

/** 会员稽核信息 */
export interface MemberAudit {
  id: number;
  money: string;
  coupon_money: string;
  valid_bet: string;
  withdraw_bet_principal: string;
  withdraw_bet_coupon: string;
  is_pass: string;
  deduct_coupon: string;
  deduct_admin_fee: string;
}

/** 缓存数据：会员稽核信息 */
export const MemberAuditFragment = gql`
  fragment MemberAuditFragment on MemberAudit {
    id
    money
    coupon_money
    valid_bet
    withdraw_bet_principal
    withdraw_bet_coupon
    is_pass
    deduct_coupon
    deduct_admin_fee
  }
`;
