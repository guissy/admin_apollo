import gql from 'graphql-tag';

export interface ActivityApply {
  id: number;
  active_id: string;
  active_name: string;
  active_title: string;
  apply_time: string;
  coupon_money: string;
  deposit_money: string;

  // ip: string;
  // issue_mode: string;
  level: string;
  memo: string;
  process_time: string;
  // state: string;
  status: string;
  // type_id: string;
  withdraw_require: string;
  // type_name: string;
  // user_id: string;

  mobile: string;
  email: string;
  content: string;
  user_name: string;
}

export const ActivityApplyFragment = gql`
  fragment ActivityApplyFragment on ActivityApply {
    id
    active_id
    active_name
    active_title
    agent_id
    apply_time
    content
    coupon_money
    deposit_money
    email
    ip
    issue_mode
    level
    memo
    mobile
    process_time
    state
    status
    type_id
    type_name
    user_id
    user_name
    withdraw_require
  }
`;
