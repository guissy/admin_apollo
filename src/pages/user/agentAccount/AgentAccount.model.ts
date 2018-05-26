import gql from 'graphql-tag';

/** 代理管理 */
export interface AgentAccount {
  id: number;
  similar: string;
  name: string;
  truename: string;
  type: string;
  pname: string;
  level: string;
  inferisors_num: string;
  play_num: string;
  balance: string;
  code: string;
  register_from: string;
  register_to: string;
  created: string;
  channel: string;
  online: string;
  status: number;
}

/** 缓存数据：代理管理 */
export const AgentAccountFragment = gql`
  fragment AgentAccountFragment on AgentAccount {
    id
    name
    truename
    type
    pname
    level
    inferisors_num
    play_num
    balance
    code
    created
    channel
    online
    status
  }
`;

/** 代理类型 */
export interface AgentAccountType {
  id: number;
  name: string;
}
/** 代理类型 GraphQL */
export const agentAccountTypeQuery = gql`
  query {
    agentAccountTypeList @rest(type: "AgentAccountTypeResult", path: "/agentAccountType") {
      data {
        id
        name
      }
    }
  }
`;
/** 注册来源 */
export interface AgentAccountChannel {
  id: number;
  name: string;
}
/** 注册来源 GraphQL */
export const agentAccountChannelQuery = gql`
  query {
    agentAccountChannelList @rest(type: "AgentAccountChannelResult", path: "/agentAccountChannel") {
      data {
        id
        name
      }
    }
  }
`;
/** 在线状态 */
export interface AgentAccountOnline {
  id: number;
  name: string;
}
/** 在线状态 GraphQL */
export const agentAccountOnlineQuery = gql`
  query {
    agentAccountOnlineList @rest(type: "AgentAccountOnlineResult", path: "/agentAccountOnline") {
      data {
        id
        name
      }
    }
  }
`;
/** 账号状态 */
export interface AgentAccountStatus {
  id: number;
  name: string;
}
/** 账号状态 GraphQL */
export const agentAccountStatusQuery = gql`
  query {
    agentAccountStatusList @rest(type: "AgentAccountStatusResult", path: "/agentAccountStatus") {
      data {
        id
        name
      }
    }
  }
`;
