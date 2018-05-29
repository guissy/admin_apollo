import gql from 'graphql-tag';

/** 公告管理 */
export interface AnnounceManage {
  id: number;
  send_type: string;
  type: string;
  title: string;
  content: string;
  popup_type: string;
  start_time: string;
  end_time: string;
  recipient: string;
  admin_name: string;
  recipient_origin: string;
  status: string;
  language_id: string;
}

/** 公告管理: GraphQL */
export const AnnounceManageFragment = gql`
  fragment AnnounceManageFragment on AnnounceManage {
    id
    send_type
    type
    title
    content
    popup_type
    recipient
    admin_name
    recipient_origin
    status
    language_id
    start_time
    end_time
  }
`;

/** 发送类型 */
export interface SendType {
  id: number;
  name: string;
}
/** 发送类型 GraphQL */
export const sendTypeQuery = gql`
  query {
    sendTypeList @rest(type: "SendTypeResult", path: "/sendType") {
      data {
        id
        name
      }
    }
  }
`;
/** 消息类型 */
export interface AnnounceManageType {
  id: number;
  name: string;
}
/** 消息类型 GraphQL */
export const announceManageTypeQuery = gql`
  query {
    announceManageTypeList @rest(type: "AnnounceManageTypeResult", path: "/announceManageType") {
      data {
        id
        name
      }
    }
  }
`;
/** 弹出类型 */
export interface PopupType {
  id: number;
  name: string;
}
/** 弹出类型 GraphQL */
export const popupTypeQuery = gql`
  query {
    popupTypeList @rest(type: "PopupTypeResult", path: "/popupType") {
      data {
        id
        name
      }
    }
  }
`;
