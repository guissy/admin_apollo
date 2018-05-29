import gql from 'graphql-tag';

/** 游戏后台帐号 */
export interface GameAccount {
  id: number;
  partner_name: string;
  admin_url: string;
  admin_account: string;
  admin_password: string;
}

/** 游戏后台帐号: GraphQL */
export const GameAccountFragment = gql`
  fragment GameAccountFragment on GameAccount {
    id
    partner_name
    admin_url
    admin_account
    admin_password
  }
`;
