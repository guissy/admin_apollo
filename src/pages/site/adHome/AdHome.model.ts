import gql from 'graphql-tag';

/** 文案管理 */
export interface AdHome {
  id: number;
  name: string;
  language: string;
  approve_status: string;
  created: string;
  status: string;
  sort: string;
}

/** 缓存数据：文案管理 */
export const AdHomeFragment = gql`
  fragment AdHomeFragment on AdHome {
    id
    name
    language
    approve_status
    created
    status
    sort
  }
`;
