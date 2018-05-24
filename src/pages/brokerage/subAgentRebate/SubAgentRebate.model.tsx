import gql from 'graphql-tag';

/** 下级佣金统计 */
export interface SubAgentRebate {
  id: number;
  period_name: string;
  uname: string;
  settings: string;
  total: number;
  status: string;
  account: string;
  level: number;
}

/** 缓存数据：下级佣金统计 */
export const SubAgentRebateFragment = gql`
  fragment SubAgentRebateFragment on SubAgentRebate {
    id
    period_name
    uname
    settings
    total
    status
    account
    level
  }
`;

/** 下级佣金统计详情 */
export interface SubAgentRebateDetail {
  id: number;
  username: string;
  bkge_amount: number;
  rate: number;
  commission: number;
}

/** 缓存数据：下级佣金统计 */
export const SubAgentRebateDetailFragment = gql`
  fragment SubAgentRebateDetailFragment on SubAgentRebateDetail {
    id
    username
    bkge_amount
    rate
    commission
  }
`;
