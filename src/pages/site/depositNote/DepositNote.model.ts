import gql from 'graphql-tag';

/** 存款文案 */
export interface DepositNote {
  id: number;
  name: string;
  language: string;
  approve_status: string;
  status: string;
  content: string;
  apply_to: string;
  created: string;
}

/** 存款文案: GraphQL */
export const DepositNoteFragment = gql`
  fragment DepositNoteFragment on DepositNote {
    id
    name
    language
    approve_status
    status
    content
    apply_to
    created
  }
`;

/** 审核状态 */
export interface ApproveStatus {
  id: number;
  name: string;
}
/** 审核状态 GraphQL */
export const approveStatusQuery = gql`
  query {
    approveStatusList @rest(type: "ApproveStatusResult", path: "/approveStatus") {
      data {
        id
        name
      }
    }
  }
`;
/** 使用于 */
export interface ApplyTo {
  id: number;
  name: string;
}
/** 使用于 GraphQL */
export const applyToQuery = gql`
  query {
    applyToList @rest(type: "ApplyToResult", path: "/applyTo") {
      data {
        id
        name
      }
    }
  }
`;
