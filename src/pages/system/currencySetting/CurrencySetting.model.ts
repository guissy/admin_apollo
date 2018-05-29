import gql from 'graphql-tag';

/** 代理推广资源 */
export interface CurrencySetting {
  id: number;
  cytype: string;
  ctype: string;
  status: string;
}

/** 代理推广资源: GraphQL */
export const CurrencySettingFragment = gql`
  fragment CurrencySettingFragment on CurrencySetting {
    id
    cytype
    ctype
    status
  }
`;
