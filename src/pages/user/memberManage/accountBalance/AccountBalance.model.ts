import gql from 'graphql-tag';

/** 账户余额 */
export interface AccountBalance {
  id: number;
  currency_name: string;
  updated: string;
  balance: string;
  freeze_withdraw: string;
  amount: string;
}

/** 缓存数据：账户余额 */
export const AccountBalanceFragment = gql`
  fragment AccountBalanceFragment on AccountBalance {
    id
    currency_name
    updated
    balance
    freeze_withdraw
    amount
  }
`;
