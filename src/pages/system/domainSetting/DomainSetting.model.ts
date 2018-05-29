import gql from 'graphql-tag';

/** 前台域名设置 */
export interface DomainSetting {
  id: number;
  name: string;
  title: string;
  bottom: string;
  is_ssl: string;
  logo: string;
}

/** 前台域名设置: GraphQL */
export const DomainSettingFragment = gql`
  fragment DomainSettingFragment on DomainSetting {
    id
    name
    title
    bottom
    is_ssl
    logo
  }
`;
