import gql from 'graphql-tag';

/** 实体类型 */
export interface IpBlackList {
  id: number;
  ip: string;
  created: string;
  updated: string;
  memo: string;
  status: string;
}

/** 缓存数据：实体类型 */
export const IpBlackListFragment = gql`
  fragment IpBlackListFragment on IpBlackList {
    id
    ip
    created
    updated
    memo
    status
  }
`;
