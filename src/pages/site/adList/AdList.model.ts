import gql from 'graphql-tag';

/** 轮播广告 */
export interface AdList {
  id: number;
  name: string;
  pf: string;
  position: string;
  picture: string;
  link: string;
  language: string;
  sort: string;
  approve: string;
  status: string;
  created: string;
  picture: string;
}

/** 缓存数据：轮播广告 */
export const AdListFragment = gql`
  fragment AdListFragment on AdList {
    id
    name
    pf
    position
    picture
    link
    language
    sort
    approve
    status
    created
    picture
  }
`;

/** 使用平台 */
export interface AdListPf {
  id: number;
  name: string;
}
/** 使用平台 GraphQL */
export const adListPfQuery = gql`
  query {
    adListPfList @rest(type: "AdListPfResult", path: "/adListPf") {
      data {
        id
        name
      }
    }
  }
`;
/** 审核状态 */
export interface AdListApprove {
  id: number;
  name: string;
}
/** 审核状态 GraphQL */
export const adListApproveQuery = gql`
  query {
    adListApproveList @rest(type: "AdListApproveResult", path: "/adListApprove") {
      data {
        id
        name
      }
    }
  }
`;
