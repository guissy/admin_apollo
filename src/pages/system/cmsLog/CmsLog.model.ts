import gql from 'graphql-tag';

/** 代理推广资源 */
export interface CmsLog {
  id: number;
  created_uname: string;
  user_name: string;
  ip: string;
  module: string;
  op_type: string;
  result: string;
  created: string;
  remark: string;
}

/** 代理推广资源: GraphQL */
export const CmsLogFragment = gql`
  fragment CmsLogFragment on CmsLog {
    id
    created_uname
    user_name
    ip
    module
    op_type
    result
    created
    remark
  }
`;

/** 操作类型 */
export interface OpType {
  id: number;
  name: string;
}
/** 操作类型 GraphQL */
export const opTypeQuery = gql`
  query {
    opTypeList @rest(type: "OpTypeResult", path: "/opType") {
      data {
        id
        name
      }
    }
  }
`;
/** 结果 */
export interface CmsLogResult {
  id: number;
  name: string;
}
/** 结果 GraphQL */
export const cmsLogResultQuery = gql`
  query {
    cmsLogResultList @rest(type: "CmsLogResultResult", path: "/cmsLogResult") {
      data {
        id
        name
      }
    }
  }
`;
