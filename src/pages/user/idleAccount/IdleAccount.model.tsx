import gql from 'graphql-tag';

/** 闲置账号 */
export interface IdleAccount {
  id: number;
  name: string;
  agent: string;
  total: string;
  last_login: string;
  balance: string;
}

/** 缓存数据：闲置账号 */
export const IdleAccountFragment = gql`
  fragment IdleAccountFragment on IdleAccount {
    id
    name
    agent
    total
    last_login
    balance
  }
`;
