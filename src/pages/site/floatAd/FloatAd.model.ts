import gql from 'graphql-tag';

/** 浮动广告 */
export interface FloatAd {
  id: number;
  name: string;
  link: string;
  language: string;
  picture: string;
  position: string;
  pf: string;
  approve: string;
  sort: string;
}

/** 浮动广告: GraphQL */
export const FloatAdFragment = gql`
  fragment FloatAdFragment on FloatAd {
    id
    name
    link
    language
    picture
    position
    pf
    approve
    sort
  }
`;

/** 显示位置 */
export interface FloatAdPosition {
  id: number;
  name: string;
}
/** 显示位置 GraphQL */
export const floatAdPositionQuery = gql`
  query {
    floatAdPositionList @rest(type: "FloatAdPositionResult", path: "/floatAdPosition") {
      data {
        id
        name
      }
    }
  }
`;
/** 平台 */
export interface FloatAdPf {
  id: number;
  name: string;
}
/** 平台 GraphQL */
export const floatAdPfQuery = gql`
  query {
    floatAdPfList @rest(type: "FloatAdPfResult", path: "/floatAdPf") {
      data {
        id
        name
      }
    }
  }
`;
/** 审核状态 */
export interface FloatAdApprove {
  id: number;
  name: string;
}
/** 审核状态 GraphQL */
export const floatAdApproveQuery = gql`
  query {
    floatAdApproveList @rest(type: "FloatAdApproveResult", path: "/floatAdApprove") {
      data {
        id
        name
      }
    }
  }
`;
