import gql from 'graphql-tag';

/** 代理审核 */
export interface AgentAudit {
  id: number;
  name: string;
  mobile: string;
  email: string;
  truename: string;
  created: string;
  channel: number;
  ip: string;
  admin_user: string;
  status: string;
}

/** 缓存数据：代理审核 */
export const AgentAuditFragment = gql`
  fragment AgentAuditFragment on AgentAudit {
    id
    name
    mobile
    email
    truename
    created
    channel
    ip
    admin_user
    status
  }
`;

/** 审核状态 */
export interface AgentAuditStatus {
  id: number;
  name: string;
}
