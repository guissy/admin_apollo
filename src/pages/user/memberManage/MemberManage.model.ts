import gql from 'graphql-tag';

/** 会员管理 */
export interface MemberManage {
  id: number;
  username: string;
  truename: string;
  agent: string;
  amount: string;
  created: string;
  ip: string;
  channel: string;
  tags: string;
  online: string;
  state: string;
}

/** 缓存数据：会员管理 */
export const MemberManageFragment = gql`
  fragment MemberManageFragment on MemberManage {
    id
    username
    truename
    agent
    amount
    created
    ip
    channel
    tags
    online
    state
  }
`;

/** 注册来源 */
export interface MemberManageChannel {
  id: number;
  name: string;
}
/** 注册来源 GraphQL */
export const memberManageChannelQuery = gql`
  query {
    memberManageChannelList @rest(type: "MemberManageChannelResult", path: "/memberManageChannel") {
      data {
        id
        name
      }
    }
  }
`;
/** 标签 */
export interface MemberManageTags {
  id: number;
  name: string;
}
/** 标签 GraphQL */
export const memberManageTagsQuery = gql`
  query {
    memberManageTagsList @rest(type: "MemberManageTagsResult", path: "/memberManageTags") {
      data {
        id
        name
      }
    }
  }
`;
/** 在线状态 */
export interface MemberManageOnline {
  id: number;
  name: string;
}
/** 在线状态 GraphQL */
export const memberManageOnlineQuery = gql`
  query {
    memberManageOnlineList @rest(type: "MemberManageOnlineResult", path: "/memberManageOnline") {
      data {
        id
        name
      }
    }
  }
`;
/** 账号状态 */
export interface MemberManageState {
  id: number;
  name: string;
}
/** 账号状态 GraphQL */
export const memberManageStateQuery = gql`
  query {
    memberManageStateList @rest(type: "MemberManageStateResult", path: "/memberManageState") {
      data {
        id
        name
      }
    }
  }
`;
