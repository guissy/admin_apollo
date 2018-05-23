import gql from 'graphql-tag';

/** 实体类型 */
export interface AgentLink {
  id: number;
  domain: string;
  comment: string;
  status: string;
}

/** 缓存数据：实体类型 */
export const AgentLinkFragment = gql`
  fragment AgentLinkFragment on AgentLink {
    id
    domain
    comment
    status
  }
`;
