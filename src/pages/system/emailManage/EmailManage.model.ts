import gql from 'graphql-tag';

/** 邮件管理 */
export interface EmailManage {
  id: number;
  title: string;
  created: string;
  send_type: string;
  status: number;
  hyper_text: string;
  content: string;
}

/** 邮件管理: GraphQL */
export const EmailManageFragment = gql`
  fragment EmailManageFragment on EmailManage {
    id
    title
    created
    send_type
    status
    hyper_text
    content
  }
`;

/** 发送状态 */
export interface SendType {
  id: number;
  name: string;
}
/** 发送状态 GraphQL */
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
